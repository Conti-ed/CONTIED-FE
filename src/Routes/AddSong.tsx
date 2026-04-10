import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Content,
  RecentSearchContainer,
} from "../styles/Search.styles";
import EmptyState from "../components/EmptyState";
import SafariSpace from "../components/SafariSpace";
import Keyboard from "../components/Keyboard";
import Icon from "../components/Icon";
import InputSafariSpace from "../components/InputSafariSpace";
import SearchSuggestions from "../components/SearchSuggestions";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getRandomSuggestions } from "../utils/randomUtils";
import { extractWordsFromLyrics } from "../utils/lyricsUtils";
import { 
  getRecentSearches, 
  postRecentSearch, 
  deleteRecentSearch, 
  clearAllRecentSearches,
  getAllSongs
} from "../utils/axios";

interface SearchHistoryItem {
  id: number;
  query: string;
  updatedAt: string;
}

// Custom hook for managing recent searches (Refactored for Backend)
const useRecentSearches = () => {
  const queryClient = useQueryClient();

  const { data: recentSearches = [] } = useQuery<SearchHistoryItem[]>(
    "recentSearches",
    getRecentSearches
  );

  const addMutation = useMutation(postRecentSearch, {
    onSuccess: () => queryClient.invalidateQueries("recentSearches"),
  });

  const deleteMutation = useMutation(deleteRecentSearch, {
    onSuccess: () => queryClient.invalidateQueries("recentSearches"),
  });

  const clearAllMutation = useMutation(clearAllRecentSearches, {
    onSuccess: () => queryClient.invalidateQueries("recentSearches"),
  });

  const performAdd = (search: string) => addMutation.mutate(search);
  const performClearAll = () => clearAllMutation.mutate();
  const performDelete = (id: number) => deleteMutation.mutate(id);

  return {
    recentSearches,
    addRecentSearch: performAdd,
    clearAllRecentSearches: performClearAll,
    removeRecentSearch: performDelete,
  };
};

const SearchAddSong: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    recentSearches,
    addRecentSearch,
    clearAllRecentSearches,
    removeRecentSearch,
  } = useRecentSearches();

  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 컴포넌트 인스턴스별로 고유한 ID 생성하여 전환 시 충돌 방지 및 브라우저 경고 해결
  const inputId = useMemo(() => `search-input-addsong-${Math.random().toString(36).substr(2, 9)}`, []);
  const inputName = useMemo(() => `search-query-addsong-${Math.random().toString(36).substr(2, 9)}`, []);

  const { contiId } = location.state || {};

  // 1. 초기 진입 시 상태 동기화
  useEffect(() => {
    if (location.state?.query) {
      setSearchQuery(location.state.query);
    }
    inputRef.current?.focus();
    setIsFocused(true);
  }, []);

  // 2. 클릭 외부 영역 감지 (포커스 해제)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        recentSearchRef.current &&
        !recentSearchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. 추천 검색어 데이터 (Lyrics Word Cloud 기반)
  const { data: lyricsSuggestions = [] } = useQuery(
    "lyricsSuggestions",
    async () => {
      const response = await getAllSongs();
      const songArray = response.songData;
      if (Array.isArray(songArray)) {
        const allLyrics = songArray.flatMap((song: any) => song.lyrics);
        const allWords = allLyrics.flatMap((lyrics: string) => extractWordsFromLyrics(lyrics));
        return getRandomSuggestions(allWords, 14);
      }
      return [];
    },
    {
      staleTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
    }
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsFocused(false);
      setIsLoading(true);
      inputRef.current?.blur();
      addRecentSearch(searchQuery);
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/result?query=${encodeURIComponent(searchQuery)}`, {
          state: { query: searchQuery, contiId: contiId },
        });
      }, 1000);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
    navigate(`/result?query=${encodeURIComponent(query)}`, {
      state: { query: query, contiId: contiId },
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleRecentSearchClick(suggestion);
  };

  const renderRecentSearches = () => (
    <RecentSearchContainer ref={recentSearchRef}>
      <RecentSearchesHeader>
        <span>최근 검색어</span>
        <ClearAllButton onClick={clearAllRecentSearches}>
          전체삭제
        </ClearAllButton>
      </RecentSearchesHeader>
      {recentSearches.map((item) => (
        <RecentSearchItem key={item.id}>
          <span onClick={() => handleRecentSearchClick(item.query)}>
            {item.query}
          </span>
          <svg
            onClick={() => removeRecentSearch(item.id)}
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
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StatusBar />
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
        {!isFocused && (
          <BackIcon
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            viewBox="0 0 9 16"
            onClick={() => navigate(-1)}
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
            id={inputId}
            name={inputName}
            ref={inputRef}
            placeholder="콘티, 노래 또는 가사 등"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {searchQuery && isFocused && (
            <ClearIcon onClick={handleClearSearch}>
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
          <Loading top="37.5%" />
        ) : isFocused && recentSearches.length > 0 ? (
          renderRecentSearches()
        ) : isFocused ? (
          <EmptyState message="최근 검색한 기록이 없어요." top="37.5%" />
        ) : (
          <SearchSuggestions
            suggestions={lyricsSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        )}
      </Content>
      <TabBarWrapper $isFocused={isFocused}>
        <InputSafariSpace $isFocused={isFocused} />
      </TabBarWrapper>
      <Keyboard />
      <SafariSpace $isFocused={isFocused} />
    </Container>
  );
};

export default SearchAddSong;
