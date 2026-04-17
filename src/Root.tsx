import { ThemeProvider, createGlobalStyle } from "styled-components";
import { lightTheme, darkTheme } from "./Theme";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import TabBar from "./components/TabBar";
import SuspenseFallback from "./components/SuspenseFallback";
import { supabase } from "./utils/supabase";
import { removeTokens, setTokens } from "./utils/auth";
import { useRef, useCallback } from "react";

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  background-color: ${(props) => props.theme.bgColor};
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);

  @media (max-width: 430px) {
    box-shadow: none;
  }
`;

const ContentWrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.bgColor};
`;

function Root() {
  const isDark = useRecoilValue(isDarkAtom);
  const location = useLocation();
  const navigate = useNavigate();
  const { direction = 0 } = (location.state as any) || {};

  // 리다이렉트 중복 방지 플래그
  const isRedirecting = useRef(false);

  const getIsPublicRoute = useCallback(() => {
    const path = window.location.pathname;
    return path === "/" || path === "/auth/callback" || path === "/waiting";
  }, []);

  useEffect(() => {
    isRedirecting.current = false;

    const checkAuth = async () => {
      // 이미 리다이렉트 중이면 무시
      if (isRedirecting.current) return;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // 세션이 살아있으면 쿠키 토큰도 자동 동기화
          // (Supabase 내부에서 갱신이 이루어져 쿠키와 불일치하는 경우 대비)
          setTokens(session.access_token, session.refresh_token);
        } else if (!getIsPublicRoute()) {
          // 세션 없음 + 보호된 경로 → 로그인 페이지로
          console.log("No session found on protected route, redirecting...");
          isRedirecting.current = true;
          removeTokens();
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (!isRedirecting.current && !getIsPublicRoute()) {
          isRedirecting.current = true;
          removeTokens();
          navigate("/", { replace: true });
        }
      }
    };

    // 1. 초기 마운트 시 체크
    checkAuth();

    // 2. 윈도우 포커스 및 가시성 변경 시 체크 (PWA/WebView 대응)
    //    디바운스를 적용하여 빠른 연속 호출 방지
    let visibilityTimeout: ReturnType<typeof setTimeout>;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(visibilityTimeout);
        visibilityTimeout = setTimeout(() => {
          isRedirecting.current = false; // 복귀 시 플래그 초기화
          checkAuth();
        }, 1000); // 1초 디바운스
      }
    };

    // focus 이벤트도 디바운스된 핸들러 사용 (visibilitychange와 중복 방지)
    let focusTimeout: ReturnType<typeof setTimeout>;
    const handleFocus = () => {
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(() => {
        isRedirecting.current = false;
        checkAuth();
      }, 1000);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", handleVisibilityChange);

    // 3. 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        removeTokens();
        if (!getIsPublicRoute()) {
          isRedirecting.current = true;
          navigate("/", { replace: true });
        }
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Supabase가 자동으로 토큰을 갱신했을 때 쿠키도 업데이트
        setTokens(session.access_token, session.refresh_token);
      } else if (!session && !getIsPublicRoute()) {
        isRedirecting.current = true;
        removeTokens();
        navigate("/", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(visibilityTimeout);
      clearTimeout(focusTimeout);
    };
  }, [navigate, getIsPublicRoute]); // location.pathname 제거! 무한 루프 방지

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);

    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  const showTabBar =
    location.pathname === "/home" ||
    location.pathname === "/search" ||
    location.pathname === "/result" ||
    location.pathname.startsWith("/mypage");

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <PageWrapper>
          <Suspense fallback={<SuspenseFallback />}>
            <Outlet />
          </Suspense>
          {showTabBar && <TabBar />}
        </PageWrapper>
      </ThemeProvider>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
html, body, div, span, Rootlet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
@font-face {
    font-family: 'GongGothic';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicBold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
}
@font-face {
    font-family: 'GongGothic';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicMedium.woff') format('woff');
    font-weight: 500;
    font-style: normal;
}
@font-face {
    font-family: 'GongGothic';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@1.0/GongGothicLight.woff') format('woff');
    font-weight: 300;
    font-style: normal;
}
::-webkit-scrollbar {
    display: none;
  }
body {
  line-height: 1;
  font-family: 'GongGothic', 'Noto Sans KR', sans-serif;
  background-color: ${(props) =>
    props.theme.bgColor === "#292929" ? "#1a1a1a" : "#e8e8e8"};
  color:${(props) => props.theme.textColor};
  overflow: hidden; /* 바위의 스크롤은 PageWrapper에서 관리하도록 유도 */
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
a {
  text-decoration:none;
  color: inherit;
}
button {
  font-family: 'GongGothic', 'Noto Sans KR', sans-serif;
  background-color: transparent;
  color:${(props) => props.theme.textColor};
  border: none;
  cursor: pointer;
}
input {
  font-family: 'GongGothic', 'Noto Sans KR', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor};
}
#root, html, body {
    height: 100%;
}
`;

export default Root;
