import styled, { keyframes, css } from "styled-components";

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.9;
  }
`;

export const Container = styled.div<{ $isFading: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #92b5f0;
  position: relative;
  overflow: hidden;
  ${({ $isFading }) =>
    $isFading &&
    css`
      animation: ${fadeOut} 0.1s forwards;
    `}
`;

export const BackgroundCircle = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -100px;
  z-index: 0;
`;

export const BackgroundCircleBottom = styled(BackgroundCircle)`
  top: auto;
  bottom: -150px;
  left: -150px;
  right: auto;
  width: 400px;
  height: 400px;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

export const Logo = styled.img`
  width: 250px;
  max-width: 70%; /* 반응형: 화면이 작을 때 로고 크기 조절 */
  height: auto;
  margin-bottom: 50px;
`;

export const ButtonContainer = styled.div`
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
  z-index: 1;
`;

export const StartButton = styled.button`
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

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 15px; /* 카카오 아이콘 왼쪽으로 붙이기 */
`;

export const TextContainer = styled.span`
  margin-left: 10px; /* Text와 Icon 사이의 간격 */
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  text-align: center;
  z-index: 1;
`;
