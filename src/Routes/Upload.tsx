import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import CustomUpload from "../components/Uploads/CustomUpload";
import AIUpload from "../components/Uploads/AIUpload";
import YouTubeUpload from "../components/Uploads/YouTubeUpload";
import Icon from "../components/Icon";

const Container = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Content = styled(motion.div)`
  height: auto;
  width: 100%;
  font-size: 24px;
  color: #000;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 23px;
`;

const Header = styled.div`
  width: 100%;
  margin-top: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const BackIcon = styled.svg`
  margin-left: 26px;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: #171a1f;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const Upload: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const spring = {
    type: "spring",
    stiffness: 500,
    damping: 30,
  };

  const renderContent = () => {
    switch (source) {
      case "내가?":
        return (
          <Content
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
          >
            <CustomUpload />
          </Content>
        );
      case "AI가?":
        return (
          <Content
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
          >
            <AIUpload />
          </Content>
        );
      case "유튜브가?":
        return (
          <Content
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
          >
            <YouTubeUpload />
          </Content>
        );
      default:
        return (
          <Content
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
          >
            잘못된 접근입니다.
          </Content>
        );
    }
  };

  const renderTitle = () => {
    switch (source) {
      case "내가?":
        return "내게 맡겨!";
      case "AI가?":
        return "AI에게 맡겨!";
      case "유튜브가?":
        return "유튜브에게 맡겨!";
      default:
        return "잘못된 접근입니다.";
    }
  };

  return (
    <Container>
      <Header>
        <BackIcon width="9" viewBox="0 0 9 16" onClick={() => navigate(-1)}>
          <Icon id="back-upload" width="9" height="16" />
        </BackIcon>
        <Title>{renderTitle()}</Title>
      </Header>
      {renderContent()}
    </Container>
  );
};

export default Upload;
