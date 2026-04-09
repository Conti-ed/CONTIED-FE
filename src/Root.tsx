import { ThemeProvider, createGlobalStyle } from "styled-components";
import { lightTheme, darkTheme } from "./Theme";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import TabBar from "./components/TabBar";
import { supabase } from "./utils/supabase";
import { removeTokens } from "./utils/auth";

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isPublicRoute =
        location.pathname === "/" ||
        location.pathname === "/auth/callback" ||
        location.pathname === "/waiting";

      if (!session && !isPublicRoute) {
        console.log("No session found on protected route, redirecting...");
        removeTokens(); // 쿠키 및 로컬스토리지 정리
        navigate("/", { replace: true });
      }
    };

    // 1. 초기 마운트 시 체크
    checkAuth();

    // 2. 윈도우 포커스 시 체크 (PWA/WebView 대응)
    window.addEventListener("focus", checkAuth);

    // 3. 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const isPublicRoute =
        location.pathname === "/" ||
        location.pathname === "/auth/callback" ||
        location.pathname === "/waiting";

      if (event === "SIGNED_OUT") {
        removeTokens();
        if (!isPublicRoute) navigate("/", { replace: true });
      } else if (!session && !isPublicRoute) {
        removeTokens();
        navigate("/", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("focus", checkAuth);
    };
  }, [navigate, location.pathname]);

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
          <Outlet />
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
