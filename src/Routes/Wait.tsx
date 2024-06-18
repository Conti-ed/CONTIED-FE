import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";

const changeColor = keyframes`
  0%, 100% {
    filter: brightness(1);
    color: #ffffff; /* 기본 텍스트 색상 */
  }
  50% {
    filter: brightness(1) saturate(105%) invert(60%) sepia(46%) saturate(749%) hue-rotate(160deg) brightness(110%) contrast(94%);
    color: #7094db; /* 텍스트 색상 */
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0.9;
  }
  to {
    opacity: 1;
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

const Image = styled.img`
  width: 110px; /* 이미지 크기 */
  height: 110px;
  animation: ${changeColor} 6s infinite;
`;

const Text = styled.div`
  margin-top: 30px;
  font-size: 25px;
  font-weight: 500;
  animation: ${changeColor} 6s infinite;
`;

const Wait: React.FC = () => {
  const [text, setText] = useState("로그인 하는 중...");
  const navigate = useNavigate();

  useEffect(() => {
    const animationDuration = 6000; // 6초 애니메이션
    const textChangeTimeout = setTimeout(() => {
      setText("로그인 완료!");
    }, animationDuration);

    const redirectTimeout = setTimeout(() => {
      navigate("/select");
    }, animationDuration + 3000); // 텍스트 변경 후 3초 뒤 리디렉션

    return () => {
      clearTimeout(textChangeTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <Container>
      <StatusBar />
      <Content $isFading={true}>
        <Image src="/images/WaitforLogin.png" alt="Loading" />
        <Text>{text}</Text>
      </Content>
      <SafariSpace $isFocused={false} />
    </Container>
  );
};

export default Wait;
