import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import StatusBar from "../components/StatusBar";
import TabBar from "../components/TabBar";
import SafariSpace from "../components/SafariSpace";

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
  margin-left: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 23px;
  font-weight: 500;
  color: #171a1f;
`;

const SearchInputContainer = styled.div`
  width: 90%;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 5px 0;

  &:focus {
    outline: none;
    font-weight: 300;
  }

  &::placeholder {
    color: #8c8c8c;
    font-weight: 300;
  }
`;

const SearchIcon = styled.svg`
  margin-right: 3px;
`;

const SearchBar = styled.div`
  margin-top: 6px;
  width: 100%;
  border-bottom: 2px solid #171a1f;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchPageText = styled.h2`
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #171a1f;
  margin-bottom: 40px;
`;

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const Search: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <Container
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
        <StatusBar />
        <Header>
          <Title>검색</Title>
        </Header>
        <SearchInputContainer>
          <SearchInputWrapper>
            <SearchInput placeholder="콘티, 노래 또는 가사 등" />
            <SearchIcon width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.25 17.25L11.75 11.75M13.5833 7.16667C13.5833 10.7105 10.7105 13.5833 7.16667 13.5833C3.62284 13.5833 0.75 10.7105 0.75 7.16667C0.75 3.62284 3.62284 0.75 7.16667 0.75C10.7105 0.75 13.5833 3.62284 13.5833 7.16667Z"
                stroke="#545F71"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </SearchIcon>
          </SearchInputWrapper>
          <SearchBar />
        </SearchInputContainer>
        <Content>
          <SearchPageText>Search Page</SearchPageText>
        </Content>
        <TabBar />
        <SafariSpace />
      </Container>
    </AnimatePresence>
  );
};

export default Search;
