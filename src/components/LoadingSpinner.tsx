import styled, { keyframes } from "styled-components";

const LoadingAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${LoadingAnimation} 2s linear infinite;
  margin-top: 10px;
`;

export default LoadingSpinner;
