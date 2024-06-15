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
import SectionTabs from "../components/SectionTabs";
import EmptyState from "../components/EmptyState";
import ContiTab from "../components/Tabs/ContiTab";

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("전체");
  const [isSearched, setIsSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsFocused(false);
  }, [location]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearSearch = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      setIsLoading(true);
      setIsFocused(false);
      setIsSearched(true); // 검색이 완료되었음을 표시
      saveRecentSearch(query);
      setTimeout(() => {
        setIsLoading(false);
        setSearchQuery(query);
        navigate(`/result?query=${encodeURIComponent(query)}`, {
          state: { query },
        });
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const storedSearches = localStorage.getItem("recentSearches");
    let recentSearches = storedSearches ? JSON.parse(storedSearches) : [];
    recentSearches = [
      searchQuery,
      ...recentSearches.filter((item: string) => item !== searchQuery),
    ];
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  };

  const renderEmptyState = () => {
    const tabText =
      selectedTab === "전체"
        ? "검색 결과가 없어요."
        : `${selectedTab} 검색 결과가 없어요.`;
    return <EmptyState message={tabText} top="49.5%" />;
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
        <Title $isFocused={isFocused}>검색</Title>
        <div style={{ width: "9px", height: "16px" }} />
      </Header>
      <SearchInputContainer>
        <SearchInputWrapper>
          <SearchInput
            ref={inputRef}
            value={query}
            placeholder="콘티, 노래 또는 가사 등"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
          />
          {query && (
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
      <SectionTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <Content>
        {isLoading ? (
          <Loading />
        ) : searchQuery.trim() === "" ? (
          renderEmptyState()
        ) : selectedTab === "콘티" ? (
          <ContiTab searchQuery={searchQuery} />
        ) : (
          renderEmptyState()
        )}
      </Content>
      <TabBarWrapper $isFocused={isFocused}>
        <TabBar onHomeClick={() => setIsFocused(false)} />
        <InputSafariSpace $isFocused={isFocused} />
      </TabBarWrapper>
      {isFocused && <Keyboard />}
      <SafariSpace $isFocused={false} />
    </Container>
  );
};

export default Result;
