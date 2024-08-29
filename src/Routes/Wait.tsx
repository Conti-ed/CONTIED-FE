import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";
import animationData from "../components/waitingAnimation.json";
import Cookies from "js-cookie";
import axios from "axios";

const hue = keyframes`
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(180deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Container = styled.div`
  height: 100vh;
`;

const Content = styled.div<{ $isFading: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 663px;
  width: 100%;
  background-color: #fff;
  ${({ $isFading }) =>
    $isFading &&
    css`
      animation: ${fadeIn} 0.1s forwards;
    `}
`;

const Text = styled.div<{ $fadeState: "fadeIn" | "fadeOut" }>`
  font-size: 25px;
  font-weight: 500;
  background-image: linear-gradient(92deg, #26dbf3, #4e3afe);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${hue} 30s infinite linear,
    ${({ $fadeState }) => ($fadeState === "fadeIn" ? fadeIn : fadeOut)} 3s
      forwards;
`;

const Wait: React.FC = () => {
  const [text, setText] = useState("로그인 하는 중...");
  const [fadeState, setFadeState] = useState<"fadeIn" | "fadeOut">("fadeIn");
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const currentURL = new URL(window.location.href);
    const redirect_uri = `${currentURL.protocol}//${currentURL.host}/auth`; // Redirect URI

    const kakaoLogin = async () => {
      try {
        const response = await axios.post(`/api/auth/social/kakao`, {
          code,
          redirect_uri,
        });
        // 쿠키에 토큰 저장
        Cookies.set("token", response.data.token, { expires: 7 }); // 7일 동안 쿠키 유지
        setText("로그인 완료!");
      } catch (error: any) {
        console.log(error.response);
        setText("로그인 실패...");
      }
    };

    kakaoLogin(); // 로그인 요청 함수 호출

    const textChangeTimeout = setTimeout(() => {
      setFadeState("fadeOut");
    }, 3000); // 3초 후 텍스트 사라지기 시작

    const textFadeInTimeout = setTimeout(() => {
      setText("로그인 완료!");
      setFadeState("fadeIn");
    }, 6000); // 3초 후 텍스트 변경 및 다시 나타나기 시작

    const redirectTimeout = setTimeout(() => {
      navigate("/select");
    }, 9000); // 텍스트 변경 후 3초 뒤 리디렉션

    return () => {
      clearTimeout(textChangeTimeout);
      clearTimeout(textFadeInTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <Container>
      <StatusBar />
      <Content $isFading={true}>
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: "200px", width: "200px" }}
        />
        <Text $fadeState={fadeState}>{text}</Text>
      </Content>
      <SafariSpace $isFocused={false} />
    </Container>
  );
};

export default Wait;
