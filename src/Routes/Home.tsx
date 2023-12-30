import React from "react";
import styled from "styled-components";
import Conti from "../components/Conti";
import { CiSearch, CiMenuKebab } from "react-icons/ci";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;
const LogoContainer = styled.div``;
const Logo = styled.img`
  width: 132px;
`;
const HeaderRight = styled.div`
  display: flex;
  gap: 15px;
`;
const HeaderRightIcons = styled.div`
  font-size: 20px;
  cursor: pointer;
`;
const KeywordContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow: auto;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const Keyword = styled.div`
  background-color: ${(props) => props.theme.keywordColor};
  padding: 6px 16px;
  display: grid;
  place-content: center;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 1px;
`;
const MyContiContainer = styled.div``;
const MyContiHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
`;
const MyContiHeaderTitle = styled.span`
  font-size: 30px;
`;
const MyContiHeaderMore = styled.div`
  background-color: ${(props) => props.theme.keywordColor};
  display: grid;
  place-content: center;
  width: 48px;
  height: 18px;
  font-size: 9px;
  font-weight: 400;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 1px;
`;

const MyContiBody = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  overflow: auto;
  margin-bottom: 15px;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const CCMContainer = styled.div``;
const CCMHeader = styled.div``;

function Home() {
  return (
    <Container>
      <Header>
        <LogoContainer>
          <Logo src="images/logo1.png" alt="왜안뜨노" />
        </LogoContainer>
        <HeaderRight>
          <HeaderRightIcons>
            <CiSearch />
          </HeaderRightIcons>
          <HeaderRightIcons>
            <CiMenuKebab />
          </HeaderRightIcons>
        </HeaderRight>
      </Header>
      <KeywordContainer>
        <Keyword>사랑</Keyword>
        <Keyword>시편</Keyword>
        <Keyword>구원</Keyword>
        <Keyword>희망</Keyword>
        <Keyword>고난</Keyword>
        <Keyword>성탄절</Keyword>
        <Keyword>기쁘다 구주 오셨네</Keyword>
        <Keyword>감사</Keyword>
        <Keyword>찬양</Keyword>
      </KeywordContainer>
      <MyContiContainer>
        <MyContiHeader>
          <MyContiHeaderTitle>My Conti</MyContiHeaderTitle>
          <MyContiHeaderMore>더보기</MyContiHeaderMore>
        </MyContiHeader>
        <MyContiBody>
          {Array.from({ length: 20 }).map((_, index) => (
            <Conti key={index}></Conti>
          ))}
        </MyContiBody>
      </MyContiContainer>
      <CCMContainer>
        <CCMHeader>
          <h1>최신 CCM</h1>
          <div>더보기</div>
        </CCMHeader>
      </CCMContainer>
    </Container>
  );
}

export default Home;
