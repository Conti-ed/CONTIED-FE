import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { useMemo } from "react";
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
import { getRandomSuggestions } from "../utils/randomUtils";
import EmptyState from "../components/EmptyState";
import { extractWordsFromLyrics } from "../utils/lyricsUtils";
import { 
  getAllSongs, 
  getRecentSearches, 
  postRecentSearch, 
  deleteRecentSearch, 
  clearAllRecentSearches 
} from "../utils/axios";
import Icon from "../components/Icon";
import { useMutation, useQueryClient } from "react-query";

interface SearchHistoryItem {
  id: number;
  query: string;
  updatedAt: string;
}

const Search: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // 1. 최근 검색어 조회 (React Query)
  const { data: recentSearches = [] } = useQuery<SearchHistoryItem[]>(
    "recentSearches",
    getRecentSearches,
    {
      staleTime: 1000 * 60 * 5, // 5분 캐시
    }
  );

  // 2. 검색 기록 관련 Mutations
  const addMutation = useMutation(postRecentSearch, {
    onMutate: async (newSearch) => {
      await queryClient.cancelQueries("recentSearches");
      const previousSearches = queryClient.getQueryData<SearchHistoryItem[]>("recentSearches");
      queryClient.setQueryData<SearchHistoryItem[]>("recentSearches", (old = []) => {
        const filtered = old.filter(item => item.query !== newSearch);
        return [{ id: Date.now(), query: newSearch, updatedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
      });
      return { previousSearches };
    },
    onError: (err, newSearch, context) => {
      if (context?.previousSearches) {
        queryClient.setQueryData("recentSearches", context.previousSearches);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries("recentSearches");
    },
  });

  const deleteMutation = useMutation(deleteRecentSearch, {
    onMutate: async (id) => {
      await queryClient.cancelQueries("recentSearches");
      const previousSearches = queryClient.getQueryData<SearchHistoryItem[]>("recentSearches");
      queryClient.setQueryData<SearchHistoryItem[]>("recentSearches", (old = []) => 
        old.filter(item => item.id !== id)
      );
      return { previousSearches };
    },
    onError: (err, id, context) => {
      if (context?.previousSearches) {
        queryClient.setQueryData("recentSearches", context.previousSearches);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries("recentSearches");
    },
  });

  const clearAllMutation = useMutation(clearAllRecentSearches, {
    onMutate: async () => {
      await queryClient.cancelQueries("recentSearches");
      const previousSearches = queryClient.getQueryData<SearchHistoryItem[]>("recentSearches");
      queryClient.setQueryData("recentSearches", []);
      return { previousSearches };
    },
    onError: (err, variables, context) => {
      if (context?.previousSearches) {
        queryClient.setQueryData("recentSearches", context.previousSearches);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries("recentSearches");
    },
  });

  // 컴포넌트 인스턴스별로 고유한 ID 생성하여 전환 시 충돌 방지 및 브라우저 경고 해결
  const inputId = useMemo(() => `search-input-${Math.random().toString(36).substr(2, 9)}`, []);
  const inputName = useMemo(() => `search-query-${Math.random().toString(36).substr(2, 9)}`, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearchesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { contiId } = location.state || {};

  // 1. 초기 진입 시 네비게이션 상태 동기화 (마운트 시 1회만 실행)
  useEffect(() => {
    if (location.state) {
      setSearchQuery(location.state.query || "");
      if (location.state.isFocused !== undefined) {
        setIsFocused(location.state.isFocused);
      }
    }
  }, []); // 의존성 배열을 비워 최초 마운트 시에만 동기화 하도록 제한

  // 2. 포커스 상태 변경에 따른 DOM 포커스 관리
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);





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
      
      // 서버에 검색 기록 저장
      addMutation.mutate(searchQuery);
      
      setTimeout(() => {
        setIsLoading(false); // 로딩 종료
        navigate(`/result?query=${encodeURIComponent(searchQuery)}`, {
          state: { query: searchQuery, contiId: contiId },
        }); // 결과 페이지로 이동
      }, 500); // 0.5초 후에 로딩 종료 (사용자 요청 반영)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearAll = () => {
    clearAllMutation.mutate();
  };

  const handleRecentSearchClick = (search: string) => {
    if (search.trim() !== "") {
      setSearchQuery(search); // 검색창 텍스트 업데이트
      setIsFocused(false);
      setIsLoading(true);
      
      // 서버에 검색 기록 저장 (목록 최상단으로 올리기 위함)
      addMutation.mutate(search);
      
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/result?query=${encodeURIComponent(search)}`, {
          state: { query: search, contiId: contiId },
        });
      }, 500); // 0.5초 후에 로딩 종료 (사용자 요청 반영)
    }
  };

  const handleRemoveRecentSearch = (id: number) => {
    deleteMutation.mutate(id);
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
      {recentSearches.map((item) => (
        <RecentSearchItem key={item.id}>
          <span onClick={() => handleRecentSearchClick(item.query)}>{item.query}</span>
          <svg
            onClick={() => handleRemoveRecentSearch(item.id)}
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
      const songArray = Array.isArray(response) ? response : [];
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
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
          <Title>검색</Title>
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
        <Content $centerContent={!isLoading && !isFocused}>
          {isLoading ? (
            <Loading />
          ) : isFocused && recentSearches.length > 0 ? (
            renderRecentSearches()
          ) : isFocused ? (
            <EmptyState message={"최근 검색한 기록이 없어요."} top="50%" />
          ) : (
            <SearchSuggestions
              suggestions={lyricsSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          )}
        </Content>
    </Container>
  );
};

export default Search;
