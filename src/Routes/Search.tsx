import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import StatusBar from "../components/StatusBar";
import {
  Container,
  Header,
  Title,
  SearchInputContainer,
  SearchInputWrapper,
  SearchInput,
  SearchIcon,
  ClearIcon,
  BackIcon,
  SearchBar,
  Content,
  SearchPageText,
  EmptyStateContainer,
  EmptyStateImage,
  EmptyStateText1,
  EmptyStateText2,
  TabBarWrapper,
} from "../styles/Search.styles";
import TabBar from "../components/TabBar";
import SafariSpace from "../components/SafariSpace";

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container>
      <StatusBar />
      <Header>
        <AnimatePresence>
          {isFocused && (
            <BackIcon
              key="back-icon"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 21 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              width="9"
              height="16"
              viewBox="0 0 9 16"
              fill="none"
              onClick={() => setIsFocused(false)}
            >
              <path
                d="M8 15L1 8L8 1"
                stroke="#545F71"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </BackIcon>
          )}
        </AnimatePresence>
        <Title $isFocused={isFocused}>검색</Title>
        <div style={{ width: "9px", height: "16px" }} />
      </Header>
      <SearchInputContainer>
        <SearchInputWrapper>
          <SearchInput
            placeholder="콘티, 노래 또는 가사 등"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {isFocused && (
            <ClearIcon
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              onClick={() => setIsFocused(false)}
            >
              <path
                d="M4.5 13.5L13.5 4.5M4.5 4.5L13.5 13.5"
                stroke="#545F71"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </ClearIcon>
          )}
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
        {isFocused ? (
          <EmptyStateContainer>
            <EmptyStateImage src="images/WhitePiano.png" alt="Empty state" />
            <EmptyStateText1>앗!</EmptyStateText1>
            <EmptyStateText2>최근 검색한 기록이 없어요.</EmptyStateText2>
          </EmptyStateContainer>
        ) : (
          <SearchPageText>Search Page</SearchPageText>
        )}
      </Content>
      <TabBarWrapper $isFocused={isFocused}>
        <TabBar />
      </TabBarWrapper>
      <SafariSpace $isFocused={isFocused} />
    </Container>
  );
};

export default Search;
