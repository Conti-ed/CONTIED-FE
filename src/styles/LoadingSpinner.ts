import styled, { keyframes } from "styled-components";

const LoadingAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface LoadingSpinnerProps {
  color: string;
}

export const LoadingSpinner = styled.div<LoadingSpinnerProps>`
  margin-bottom: 28px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${({ color }) => color};
  border-radius: 50%;
  width: 23px;
  height: 23px;
  animation: ${LoadingAnimation} 2s linear infinite;
`;
