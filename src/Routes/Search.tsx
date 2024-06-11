import React from "react";
import { AnimatePresence } from "framer-motion";
import {
  Container,
  Header,
  Title,
  SearchInputContainer,
  SearchInputWrapper,
  SearchInput,
  SearchIcon,
  SearchBar,
  Content,
  SearchPageText,
} from "../styles/Search.styles";
import StatusBar from "../components/StatusBar";
import TabBar from "../components/TabBar";
import SafariSpace from "../components/SafariSpace";

const Search: React.FC = () => {
  return (
    <AnimatePresence mode="wait">
      <Container>
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
