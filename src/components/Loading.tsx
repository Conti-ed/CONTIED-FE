import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";
import { styled } from "styled-components";
import animationData from "../components/waitingAnimation.json";

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  bottom: 0;
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  justify-content: center;
  z-index: 3000;
`;

interface ContentContainerProps {
  $top?: string;
}

const ContentContainer = styled.div<ContentContainerProps>`
  position: absolute;
  top: ${(props) => props.$top || "46%"};
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingText = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #828282;
  text-align: center;
  margin-top: 10px;
`;

interface LoadingProps {
  top?: string;
}

const Loading: React.FC<LoadingProps> = ({ top }) => {
  return (
    <FullScreenContainer>
      <ContentContainer $top={top}>
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: "150px", width: "150px" }}
        />
        <LoadingText>잠시만요...</LoadingText>
      </ContentContainer>
    </FullScreenContainer>
  );
};

export default Loading;
