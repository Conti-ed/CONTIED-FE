import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";

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

const KakaoIcon = () => (
  /* 카카오 아이콘 */
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_924_3971)">
      <path
        d="M32 29.5C32 30.8808 30.8808 32 29.5 32H2.5C1.11925 32 0 30.8808 0 29.5V2.5C0 1.11925 1.11925 0 2.5 0H29.5C30.8808 0 32 1.11925 32 2.5V29.5Z"
        fill="#FFE812"
      />
      <path
        d="M15.6361 8.72754C11.017 8.72754 7.27246 11.6488 7.27246 15.2522C7.27246 17.5819 8.83791 19.6261 11.1928 20.7804C11.0646 21.2176 10.3695 23.5927 10.3418 23.7793C10.3418 23.7793 10.3252 23.9195 10.4169 23.973C10.5087 24.0264 10.6166 23.9849 10.6166 23.9849C10.8798 23.9485 13.668 22.0107 14.1506 21.6742C14.6327 21.7418 15.1291 21.7769 15.6361 21.7769C20.2552 21.7769 23.9997 18.8557 23.9997 15.2522C23.9997 11.6488 20.2552 8.72754 15.6361 8.72754Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_924_3971">
        <rect width="32" height="32" rx="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Start: React.FC = () => {
  const [isFading, setIsFading] = React.useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    setIsFading(true);
    setTimeout(() => {
      navigate("/waiting");
    }, 100); // 애니메이션 지속 시간과 일치하도록 설정
  };

  return (
    <StartPage $isFading={isFading}>
      <LogoContainer>
        <Logo src="/images/StartLogov2.png" alt="Contied Logo" />
      </LogoContainer>
      <ButtonContainer>
        <StartButton onClick={handleButtonClick}>
          <IconContainer>
            <KakaoIcon />
          </IconContainer>
          <TextContainer>카카오로 3초 만에 시작하기</TextContainer>
        </StartButton>
      </ButtonContainer>
    </StartPage>
  );
};

export default Start;
