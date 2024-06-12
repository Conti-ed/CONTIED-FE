import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // useNavigate, useLocation hook
import StatusBar from "../components/StatusBar";
import Loading from "../components/Loading";
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
  TabBarWrapper,
} from "../styles/Search.styles";
import TabBar from "../components/TabBar";
import EmptyState from "../components/EmptyState";
import SafariSpace from "../components/SafariSpace";
import InputSafariSpace from "../components/InputSafariSpace";
import Keyboard from "../components/Keyboard";

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setSearchQuery(location.state.query || "");
      setIsFocused(location.state.isFocused || false);
    }
  }, [location.state]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const handleClearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setIsFocused(false); // 포커스 해제
      setIsLoading(true); // 로딩 시작
      setTimeout(() => {
        setIsLoading(false); // 로딩 종료
        navigate("/result", { state: { query: searchQuery } }); // 결과 페이지로 이동
      }, 1000); // 3초 후에 로딩 종료
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const renderEmptyState = () => {
    return <EmptyState message={"최근 검색한 기록이 없어요."} top="35%" />;
  };

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
            ref={inputRef}
            placeholder="콘티, 노래 또는 가사 등"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && isFocused && (
            <ClearIcon
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              onClick={handleClearSearch}
            >
              <path
                d="M4.5 13.5L13.5 4.5M4.5 4.5L13.5 13.5"
                stroke="#545F71"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </ClearIcon>
          )}
          <SearchIcon
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          >
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
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {isFocused ? (
              renderEmptyState()
            ) : (
              <SearchPageText>Search Page</SearchPageText>
            )}
          </>
        )}
      </Content>
      <TabBarWrapper $isFocused={isFocused}>
        <TabBar />
        <InputSafariSpace $isFocused={isFocused} />
      </TabBarWrapper>
      {isFocused && <Keyboard />}
      <SafariSpace $isFocused={isFocused} />
    </Container>
  );
};

export default Search;
