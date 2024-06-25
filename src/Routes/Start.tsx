import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import Icon from "../components/Icon";

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
  width: 100vw;
  height: 100vh;
  background-color: #92b5f0; /* 배경 색상 */
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
  width: 250px; /* 로고 이미지 크기 */
  height: auto;
  margin-bottom: 50px; /* 로고 이미지 - 로그인 버튼 간격 */
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 160px; /* 로그인 버튼 페이지 하단에 고정 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffe812; /* 로그인 버튼 색상 */
  color: #000;
  border: none;
  padding: 15px 90px; /* 로그인 버튼 높이 조정 */
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  outline: none;
  position: relative; /* 폰트 중앙 정렬을 위해 */
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

const Start: React.FC = () => {
  const [isFading, setIsFading] = React.useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setIsFading(true);
    setTimeout(() => {
      navigate("/waiting");
    }, 100);
  };

  return (
    <StartPage $isFading={isFading}>
      <LogoContainer>
        <Logo src="/images/StartLogov2.png" alt="Contied Logo" />
      </LogoContainer>
      <ButtonContainer>
        <StartButton onClick={handleButtonClick}>
          <IconContainer>
            <Icon id="kakao-start" width="32" height="32" />
          </IconContainer>
          <TextContainer>카카오로 3초 만에 시작하기</TextContainer>
        </StartButton>
      </ButtonContainer>
    </StartPage>
  );
};

export default Start;
