import React from "react";
import { styled } from "styled-components";
import { motion } from "framer-motion";
import SafariSpace from "../components/SafariSpace";
import TabBar from "../components/TabBar";
import StatusBar from "../components/StatusBar";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
`;

const Header = styled.div`
  width: 100%;
  margin-top: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 23px;
  font-weight: 500;
  color: #171a1f;
  text-align: center;
`;

const Content = styled.div`
  margin-bottom: 134px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MyPageText = styled.h2`
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #171a1f;
  margin-bottom: 40px;
`;

const MyPage: React.FC = () => {
  return (
    <Container>
      <StatusBar />
      <Header>
        <Title>My Page</Title>
      </Header>
      <Content>
        <MyPageText>My Page</MyPageText>
      </Content>
      <TabBar />
      <SafariSpace $isFocused={false} />
    </Container>
  );
};

export default MyPage;
