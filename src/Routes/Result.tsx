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
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import InputSafariSpace from "../components/InputSafariSpace";
import Keyboard from "../components/Keyboard";
import SectionTabs from "../components/SectionTabs";
import EmptyState from "../components/EmptyState";
import ContiTab from "../components/Tabs/ContiTab";
import AllTab from "../components/Tabs/AllTab";
import SongsTab from "../components/Tabs/SongsTab";
import LyricsTab from "../components/Tabs/LyricsTab";
import Icon from "../components/Icon";

const Result: React.FC = () => {
  const location = useLocation();
  const { contiId } = location.state || {};
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("전체");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsFocused(false);
  }, [location, initialQuery]);

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

  const handleBackClick = () => {
    if (contiId) {
      navigate(`/conti/${contiId}`);
    } else {
      navigate("/search");
    }
  };

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
      saveRecentSearch(query);
      setTimeout(() => {
        setIsLoading(false);
        setSearchQuery(query);
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
      <Header>
        <AnimatePresence>
          <BackIcon
            key="back-icon"
            initial={{ opacity: 1, x: 21 }}
            width="9"
            height="16"
            onClick={handleBackClick}
          >
            <Icon id="back-upload" width="9" height="16" />
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
          {!isLoading && query && (
            <ClearIcon
              width="18"
              height="18"
              viewBox="0 0 18 18"
              onClick={handleClearSearch}
            >
              <Icon id="clear-search" width="18" height="18" />
            </ClearIcon>
          )}
          <SearchIcon
            width="18"
            height="18"
            viewBox="0 0 18 18"
            onClick={handleSearch}
            style={{ cursor: "pointer" }}
          >
            <Icon id="search-search" width="18" height="18" />
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
        ) : selectedTab === "전체" ? (
          <AllTab searchQuery={searchQuery} />
        ) : selectedTab === "곡" ? (
          <SongsTab searchQuery={searchQuery} />
        ) : selectedTab === "콘티" ? (
          <ContiTab searchQuery={searchQuery} />
        ) : selectedTab === "가사" ? (
          <LyricsTab searchQuery={searchQuery} />
        ) : (
          renderEmptyState()
        )}
      </Content>
      <TabBarWrapper $isFocused={isFocused}>
        <TabBar onHomeClick={() => setIsFocused(false)} />
        <InputSafariSpace $isFocused={isFocused} />
      </TabBarWrapper>
      {isFocused && <Keyboard />}
    </Container>
  );
};

export default Result;
