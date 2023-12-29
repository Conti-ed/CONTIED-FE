import React from "react";
import styled from "styled-components";

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

  section {
    display: flex;
    gap: 20px;
  }
`;
const Logo = styled.div``;
const Search = styled.div``;
const Menu = styled.div``;
const KeywordContainer = styled.div`
  display: flex;
  gap: 20px;
`;
const Keyword = styled.div`
  background-color: ${(props) => props.theme.cardColor};
  padding: 10px;
`;
const MyContiContainer = styled.div``;
const MyContiHeader = styled.div``;
const CCMContainer = styled.div``;
const CCMHeader = styled.div``;

function Home() {
  return (
    <Container>
      <Header>
        <Logo>Conti:ed</Logo>
        <section>
          <Search>돋보기</Search>
          <Menu>쩜쩜쩜</Menu>
        </section>
      </Header>
      <KeywordContainer>
        <Keyword>사랑</Keyword>
        <Keyword>사랑</Keyword>
        <Keyword>사랑</Keyword>
        <Keyword>사랑</Keyword>
        <Keyword>사랑</Keyword>
      </KeywordContainer>
      <MyContiContainer>
        <MyContiHeader>
          <h1>My Conti</h1>
          <div>더보기</div>
        </MyContiHeader>
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
