import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floating = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #92b5f0;
  position: relative;
  overflow: hidden;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

export const Logo = styled.img`
  width: 200px;
  max-width: 60%;
  height: auto;
  margin-bottom: 30px;
  animation: ${floating} 3s ease-in-out infinite;
`;

export const LoadingText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: white;
  text-align: center;
  letter-spacing: -0.5px;
  opacity: 0.9;
  
  &::after {
    content: "...";
    display: inline-block;
    width: 20px;
    text-align: left;
  }
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
