import React from "react";
import { styled } from "styled-components";

interface LoadingContainerProps {
  $top?: string;
}

const LoadingContainer = styled.div<LoadingContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: ${(props) => props.$top || "48%"};
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LoadingImage = styled.img`
  margin-bottom: 8px;
`;

const LoadingText = styled.div`
  font-size: 10px;
  font-weight: 300;
  color: #828282;
  text-align: center;
`;

interface LoadingProps {
  top?: string;
}

const Loading: React.FC<LoadingProps> = ({ top }) => {
  return (
    <LoadingContainer $top={top}>
      <LoadingImage src="images/WhitePiano.png" alt="Loading" />
      <LoadingText>잠시만요...</LoadingText>
    </LoadingContainer>
  );
};

export default Loading;
