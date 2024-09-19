import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";
import animationData from "../components/waitingAnimation.json";
import api from "../utils/axios";

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
    let textChangeTimeout: NodeJS.Timeout;
    let textFadeInTimeout: NodeJS.Timeout;
    let redirectTimeout: NodeJS.Timeout;

    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/users/role");
        const userRole = response.data.role || "UNKNOWN";
        console.log(response);

        textFadeInTimeout = setTimeout(() => {
          setText(userRole !== "UNKNOWN" ? "로그인 완료!" : "잠시만요...");
          setFadeState("fadeIn");
        }, 6000);

        redirectTimeout = setTimeout(() => {
          navigate(userRole === "UNKNOWN" ? "/select" : "/home");
        }, 9000);
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다:", error);
        textFadeInTimeout = setTimeout(() => {
          setText("문제가 있는 것 같아요...");
          setFadeState("fadeIn");
        }, 6000);

        redirectTimeout = setTimeout(() => {
          navigate("/select");
        }, 9000);
      }
    };

    textChangeTimeout = setTimeout(() => {
      setFadeState("fadeOut");
    }, 3000);

    fetchUserInfo();

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
