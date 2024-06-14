import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Content = styled(motion.div)`
  width: 100%;
  font-size: 24px;
  color: #000;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
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

const spring = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

function Upload() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");

  const renderContent = () => {
    switch (source) {
      case "내가?":
        return (
          <Content
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
          >
            내가? 버튼을 눌렀을 때의 페이지
          </Content>
        );
      case "AI가?":
        return (
          <Content
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
          >
            AI가? 버튼을 눌렀을 때의 페이지
          </Content>
        );
      case "유튜브가?":
        return (
          <Content
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
          >
            유튜브가? 버튼을 눌렀을 때의 페이지
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

  return (
    <Container>
      <StatusBar />
      <Header>
        <BackIcon
          width="9"
          height="16"
          viewBox="0 0 9 16"
          fill="none"
          onClick={() => navigate(-1)}
        >
          <path
            d="M8 15L1 8L8 1"
            stroke="#545F71"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </BackIcon>
      </Header>
      {renderContent()}
      <SafariSpace $isFocused={false} />
    </Container>
  );
}

export default Upload;
