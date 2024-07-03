import { Player } from "@lottiefiles/react-lottie-player";
import React from "react";
import { styled } from "styled-components";
import animationData from "../components/waitingAnimation.json";
import StatusBar from "./StatusBar";
import SafariSpace from "./SafariSpace";

const FullScreenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  display: flex;
  justify-content: center;
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
      <StatusBar />
      <ContentContainer $top={top}>
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: "150px", width: "150px" }}
        />
        <LoadingText>잠시만요...</LoadingText>
      </ContentContainer>
      <SafariSpace $isFocused={false} />
    </FullScreenContainer>
  );
};

export default Loading;
