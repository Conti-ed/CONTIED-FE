import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  RecentSearchesHeader,
  ClearAllButton,
  RecentSearchItem,
  TabBarWrapper,
} from "../styles/Search.styles";
import EmptyState from "../components/EmptyState";
import SafariSpace from "../components/SafariSpace";
import Keyboard from "../components/Keyboard";
import Icon from "../components/Icon";
import InputSafariSpace from "../components/InputSafariSpace";
import { styled } from "styled-components";

const Content = styled.div`
  height: 60.5%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RecentSearchContainer = styled.div`
  position: absolute;
  top: 18%;
  width: 90%;
  max-height: 39%;
  overflow-y: auto;
`;

// Custom hook for managing recent searches
const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = (search: string) => {
    setRecentSearches((prevSearches) => [
      search,
      ...prevSearches.filter((item) => item !== search),
    ]);
  };

  const clearAllRecentSearches = () => setRecentSearches([]);

  const removeRecentSearch = (search: string) => {
    setRecentSearches((prevSearches) =>
      prevSearches.filter((item) => item !== search)
    );
  };

  return {
    recentSearches,
    addRecentSearch,
    clearAllRecentSearches,
    removeRecentSearch,
  };
};

const SearchAddSong: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    recentSearches,
    addRecentSearch,
    clearAllRecentSearches,
    removeRecentSearch,
  } = useRecentSearches();

  useEffect(() => {
    if (location.state?.query) {
      setSearchQuery(location.state.query);
    }
    inputRef.current?.focus();
  }, [location.state]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      inputRef.current?.blur();
      addRecentSearch(searchQuery);
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/result?query=${encodeURIComponent(searchQuery)}`, {
          state: { query: searchQuery },
        });
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const renderRecentSearches = () => (
    <RecentSearchContainer>
      <RecentSearchesHeader>
        <span>최근 검색어</span>
        <ClearAllButton onClick={clearAllRecentSearches}>
          전체삭제
        </ClearAllButton>
      </RecentSearchesHeader>
      {recentSearches.map((search) => (
        <RecentSearchItem key={search}>
          <span
            onClick={() =>
              navigate(`/result?query=${encodeURIComponent(search)}`, {
                state: { query: search },
              })
            }
          >
            {search}
          </span>
          <svg
            onClick={() => removeRecentSearch(search)}
            width="18"
            viewBox="0 0 18 18"
          >
            <Icon id="remove-search" width="18" height="18" />
          </svg>
        </RecentSearchItem>
      ))}
    </RecentSearchContainer>
  );

  return (
    <Container>
      <StatusBar />
      <Header>
        <BackIcon
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 21 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          viewBox="0 0 9 16"
          onClick={() => navigate(-1)}
        >
          <Icon id="back-upload" width="9" height="16" />
        </BackIcon>
        <Title $isFocused={true}>검색</Title>
        <div style={{ width: "9px", height: "16px" }} />
      </Header>
      <SearchInputContainer>
        <SearchInputWrapper>
          <SearchInput
            ref={inputRef}
            placeholder="콘티, 노래 또는 가사 등"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <ClearIcon onClick={() => setSearchQuery("")}>
              <Icon id="clear-search" width="18" height="18" />
            </ClearIcon>
          )}
          <SearchIcon onClick={handleSearch}>
            <Icon id="search-search" width="18" height="18" />
          </SearchIcon>
        </SearchInputWrapper>
        <SearchBar />
      </SearchInputContainer>
      <Content>
        {isLoading ? (
          <Loading top="37.5%" />
        ) : recentSearches.length > 0 ? (
          renderRecentSearches()
        ) : (
          <EmptyState message="최근 검색한 기록이 없어요." top="37.5%" />
        )}
      </Content>
      <TabBarWrapper $isFocused={true}>
        <InputSafariSpace $isFocused={true} />
      </TabBarWrapper>
      <Keyboard />
      <SafariSpace $isFocused={true} />
    </Container>
  );
};

export default SearchAddSong;
