import React, { useState, useEffect, useCallback } from "react";
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

type FadeState = "fadeIn" | "fadeOut";
type UserRole = "LEADER" | "PLAYER" | "PARTICIPANT" | "UNKNOWN";

const Wait: React.FC = () => {
  const [text, setText] = useState("로그인 하는 중...");
  const [fadeState, setFadeState] = useState<FadeState>("fadeIn");
  const navigate = useNavigate();

  const fetchUserInfo = useCallback(async (): Promise<UserRole> => {
    try {
      const response = await api.get("/users/role");
      return response.data.role || "UNKNOWN";
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      return "UNKNOWN";
    }
  }, []);

  const handleTextChange = useCallback(
    (newText: string, newFadeState: FadeState) => {
      setText(newText);
      setFadeState(newFadeState);
    },
    []
  );

  const handleNavigation = useCallback(
    (userRole: UserRole) => {
      navigate(userRole === "UNKNOWN" ? "/select" : "/home");
    },
    [navigate]
  );

  const runTimerSequence = useCallback(
    (userRole: UserRole) => {
      const timeouts: NodeJS.Timeout[] = [];

      timeouts.push(setTimeout(() => setFadeState("fadeOut"), 3000));
      timeouts.push(
        setTimeout(() => {
          handleTextChange(
            userRole !== "UNKNOWN" ? "로그인 완료!" : "잠시만요...",
            "fadeIn"
          );
        }, 6000)
      );
      timeouts.push(setTimeout(() => handleNavigation(userRole), 9000));

      return () => timeouts.forEach(clearTimeout);
    },
    [handleTextChange, handleNavigation]
  );

  useEffect(() => {
    let cleanup: () => void;

    const initializeWaitSequence = async () => {
      const userRole = await fetchUserInfo();
      cleanup = runTimerSequence(userRole);
    };

    initializeWaitSequence();

    return () => {
      if (cleanup) cleanup();
    };
  }, [fetchUserInfo, runTimerSequence]);

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
