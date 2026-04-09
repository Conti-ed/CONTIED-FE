import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import Icon from "../components/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import { getAccessToken } from "../utils/auth";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.9;
  }
`;

const StartPage = styled.div<{ $isFading: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #92b5f0;
  ${({ $isFading }) =>
    $isFading &&
    css`
      animation: ${fadeOut} 0.1s forwards;
    `}
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 250px;
  max-width: 70%; /* 반응형: 화면이 작을 때 로고 크기 조절 */
  height: auto;
  margin-bottom: 50px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  padding: 0 40px;
  box-sizing: border-box;
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; /* 부모 컨테이너에 맞춰 너비 100% */
  background-color: #ffe812;
  color: #000;
  border: none;
  padding: 14px 0; /* 좌우 패딩 대신 너비 100% 사용 */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px; /* 조금 더 부드러운 버튼 모서리 */
  outline: none;
  position: relative;
  transition: opacity 0.2s ease-in-out;

  &:active {
    opacity: 0.8;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 15px; /* 카카오 아이콘 왼쪽으로 붙이기 */
`;

const TextContainer = styled.span`
  margin-left: 10px; /* Text와 Icon 사이의 간격 */
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  text-align: center;
`;

const Start: React.FC = () => {
  const [isFading, setIsFading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인된 토큰이 있는 경우 홈으로 리다이렉트
    const token = getAccessToken();
    if (token) {
      navigate("/home", { replace: true });
    }

    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get("error");

    if (errorParam === "auth_failed") {
      setError("인증에 실패했습니다. 다시 시도해 주세요.");
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  const handleLogin = async (provider: "kakao" | "google" | "github") => {
    setIsFading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(`로그인 실패: ${error.message}`);
      setIsFading(false);
    }
  };

  return (
    <StartPage $isFading={isFading}>
      <LogoContainer>
        <Logo src="/images/StartLogov2.png" alt="Contied Logo" />
      </LogoContainer>
      <ButtonContainer>
        {/* Kakao Login */}
        <StartButton onClick={() => handleLogin("kakao")} style={{ backgroundColor: "#ffe812", marginBottom: "12px" }}>
          <IconContainer>
            <Icon id="kakao-start" width="24" height="24" />
          </IconContainer>
          <TextContainer>카카오 로그인</TextContainer>
        </StartButton>

        {/* Google Login */}
        <StartButton onClick={() => handleLogin("google")} style={{ backgroundColor: "#ffffff", border: "1px solid #ddd", marginBottom: "12px" }}>
          <IconContainer>
            <Icon id="google-start" width="24" height="24" />
          </IconContainer>
          <TextContainer>구글 로그인</TextContainer>
        </StartButton>

        {/* GitHub Login */}
        <StartButton onClick={() => handleLogin("github")} style={{ backgroundColor: "#24292e", color: "#fff" }}>
          <IconContainer>
            <Icon id="github-start" width="24" height="24" />
          </IconContainer>
          <TextContainer>깃허브 로그인</TextContainer>
        </StartButton>
      </ButtonContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </StartPage>
  );
};

export default Start;
