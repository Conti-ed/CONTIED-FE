import React, { useState, useRef, useEffect } from "react";
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
import SafariSpace from "../components/SafariSpace";
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBar from "../components/StatusBar";
import Loading from "../components/Loading";
import InputSafariSpace from "../components/InputSafariSpace";
import Keyboard from "../components/Keyboard";

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || ""; // 전달된 초기 query를 가져옴
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const [isFocused, setIsFocused] = useState(false); // 포커스 상태 추가
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    // 컴포넌트가 처음 로드될 때 포커스를 해제합니다.
    setIsFocused(false);
  }, []);

  useEffect(() => {
    // query 값이 변경될 때 포커스를 해제합니다.
    setIsFocused(false);
  }, [query]);

  const handleClearSearch = () => {
    navigate("/search", { state: { query: "", isFocused: true } });
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      setIsFocused(false); // 포커스 해제
      setIsLoading(true); // 로딩 시작
      setTimeout(() => {
        setIsLoading(false); // 로딩 종료
        navigate("/result", { state: { query } }); // 결과 페이지로 이동
      }, 3000); // 3초 후에 로딩 종료
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <StatusBar />
      <Header>
        <AnimatePresence>
          <BackIcon
            key="back-icon"
            initial={{ opacity: 1, x: 21 }}
            width="9"
            height="16"
            viewBox="0 0 9 16"
            fill="none"
            onClick={() => navigate("/search")}
          >
            <path
              d="M8 15L1 8L8 1"
              stroke="#545F71"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </BackIcon>
        </AnimatePresence>
        <Title $isFocused={true}>검색</Title>
        <div style={{ width: "9px", height: "16px" }} />
      </Header>
      <SearchInputContainer>
        <SearchInputWrapper>
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
            onFocus={() => setIsFocused(true)} // 포커스 상태 업데이트
          />
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
          <SearchIcon
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            onClick={handleSearch} // 검색 아이콘 클릭 이벤트 추가
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
          <Loading /> // 로딩 상태일 때 로딩 컴포넌트를 표시
        ) : (
          <SearchPageText>
            {initialQuery}
            <br />에 대한 검색 결과
          </SearchPageText>
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

export default Result;
