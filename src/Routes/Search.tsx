import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import Loading from "../components/Loading";
import SearchSuggestions from "../components/SearchSuggestions";
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
  RecentSearchContainer,
  RecentSearchesHeader,
  ClearAllButton,
  RecentSearchItem,
} from "../styles/Search.styles";
import TabBar from "../components/TabBar";
import EmptyState from "../components/EmptyState";
import { extractWordsFromLyrics } from "../utils/lyricsUtils";
import { getRandomSuggestions } from "../utils/randomUtils";
import { getAllSongs } from "../utils/axios";
import Icon from "../components/Icon";

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearchesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { contiId } = location.state || {};

  useEffect(() => {
    if (location.state) {
      setSearchQuery(location.state.query || "");
      setIsFocused(location.state.isFocused || false);
    }
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [location.state, isFocused]);

  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (recentSearches.length > 0) {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node) &&
          recentSearchesRef.current &&
          !recentSearchesRef.current.contains(event.target as Node) &&
          !(event.target as HTMLElement).closest(".clear-icon")
        ) {
          setIsFocused(false);
        }
      } else {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [recentSearches]);

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
      setRecentSearches((prevSearches) => [
        searchQuery,
        ...prevSearches.filter((item) => item !== searchQuery),
      ]); // 검색어 저장 및 중복 제거
      setTimeout(() => {
        setIsLoading(false); // 로딩 종료
        navigate(`/result?query=${encodeURIComponent(searchQuery)}`, {
          state: { query: searchQuery, contiId: contiId },
        }); // 결과 페이지로 이동
      }, 1000); // 1초 후에 로딩 종료
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearAll = () => {
    setRecentSearches([]);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    navigate(`/result?query=${encodeURIComponent(search)}`, {
      state: { query: search },
    });
  };

  const handleRemoveRecentSearch = (search: string) => {
    setRecentSearches((prevSearches) =>
      prevSearches.filter((item) => item !== search)
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleRecentSearchClick(suggestion);
  };

  const renderRecentSearches = () => (
    <RecentSearchContainer ref={recentSearchesRef}>
      <RecentSearchesHeader>
        <span>최근 검색어</span>
        <ClearAllButton onClick={handleClearAll}>전체삭제</ClearAllButton>
      </RecentSearchesHeader>
      {recentSearches.map((search) => (
        <RecentSearchItem key={search}>
          <span onClick={() => handleRecentSearchClick(search)}>{search}</span>
          <svg
            onClick={() => handleRemoveRecentSearch(search)}
            width="18"
            viewBox="0 0 18 18"
          >
            <Icon id="remove-search" width="18" height="18" />
          </svg>
        </RecentSearchItem>
      ))}
    </RecentSearchContainer>
  );

  const { data: lyricsSuggestions = [], isLoading: isSuggestionsLoading } = useQuery(
    "lyricsSuggestions",
    async () => {
      const response = await getAllSongs();
      const songArray = response.songData;
      if (Array.isArray(songArray)) {
        const allLyrics = songArray.flatMap(
          (song: { lyrics: string }) => song.lyrics
        );
        const allWords = allLyrics.flatMap((lyrics: string) =>
          extractWordsFromLyrics(lyrics)
        );
        return getRandomSuggestions(allWords, 14);
      }
      return [];
    },
    {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours cache since suggestions are random anyway and songs grow slowly
      refetchOnWindowFocus: false,
    }
  );

  return (
    <AnimatePresence>
      <Container>
        <Header>
          {isFocused && (
            <BackIcon
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 21 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 9 16"
              onClick={() => setIsFocused(false)}
            >
              <Icon id="back-upload" width="9" height="16" />
            </BackIcon>
          )}
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
              <ClearIcon className="clear-icon" onClick={handleClearSearch}>
                <Icon id="clear-search" width="18" height="18" />
              </ClearIcon>
            )}
            <SearchIcon viewBox="0 0 18 18" onClick={handleSearch}>
              <Icon id="search-search" width="18" height="18" />
            </SearchIcon>
          </SearchInputWrapper>
          <SearchBar />
        </SearchInputContainer>
        <Content>
          {isLoading ? (
            <Loading />
          ) : isFocused && recentSearches.length > 0 ? (
            renderRecentSearches()
          ) : isFocused ? (
            <EmptyState message={"최근 검색한 기록이 없어요."} top="52%" />
          ) : (
            <SearchSuggestions
              suggestions={lyricsSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          )}
        </Content>
        <TabBar />
      </Container>
    </AnimatePresence>
  );
};

export default Search;
