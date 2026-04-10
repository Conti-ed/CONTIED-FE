import React, { useState, useRef, useEffect, useMemo } from "react";
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
  FlexSpacer,
} from "../styles/Search.styles";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import SectionTabs from "../components/SectionTabs";
import EmptyState from "../components/EmptyState";
import ContiTab from "../components/Tabs/ContiTab";
import AllTab from "../components/Tabs/AllTab";
import SongsTab from "../components/Tabs/SongsTab";
import LyricsTab from "../components/Tabs/LyricsTab";
import Icon from "../components/Icon";
import { 
  postRecentSearch,
  getRecentSearches,
  deleteRecentSearch,
  clearAllRecentSearches
} from "../utils/axios";
import { useMutation, useQueryClient, useQuery } from "react-query";


interface SearchHistoryItem {
  id: number;
  query: string;
  updatedAt: string;
}

const Result: React.FC = () => {
  const location = useLocation();
  const { contiId } = location.state || {};
  const navigate = useNavigate();
  const initialQuery = location.state?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("전체");
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const addMutation = useMutation(postRecentSearch, {
    onMutate: async (newSearch) => {
      await queryClient.cancelQueries("recentSearches");
      const previousSearches = queryClient.getQueryData<SearchHistoryItem[]>("recentSearches");
      queryClient.setQueryData<SearchHistoryItem[]>("recentSearches", (old = []) => {
        const existingItem = old.find(item => item.query === newSearch);
        const filtered = old.filter(item => item.query !== newSearch);
        const newItem = { 
          id: existingItem ? existingItem.id : Date.now(), 
          query: newSearch, 
          updatedAt: new Date().toISOString() 
        };
        return [newItem, ...filtered].slice(0, 20);
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

  const { data: recentSearches = [] } = useQuery<SearchHistoryItem[]>(
    "recentSearches",
    getRecentSearches,
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const inputId = useMemo(() => `search-input-result-${Math.random().toString(36).substr(2, 9)}`, []);
  const inputName = useMemo(() => `search-query-result-${Math.random().toString(36).substr(2, 9)}`, []);

  useEffect(() => {
    setIsFocused(false);
  }, [location, initialQuery]);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const recentSearchesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 백 버튼이나 그 자식 요소를 클릭한 경우는 제외 (handleBackClick에서 처리함)
      if (target.closest(".back-icon-btn")) return;

      if (recentSearches.length > 0) {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node) &&
          recentSearchesRef.current &&
          !recentSearchesRef.current.contains(event.target as Node) &&
          !target.closest(".clear-icon")
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

  const handleBackClick = () => {
    if (isFocused) {
      setIsFocused(false);
      setQuery(searchQuery); // 현재 검색 결과를 유지하도록 입력 필드 복구
    } else {
      if (contiId) {
        navigate(`/conti/${contiId}`);
      } else {
        navigate("/search");
      }
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
      setIsFocused(false);
      setSearchQuery(query);
      
      // 약간의 지연을 두어 리스트가 닫히는 중에 순서가 바뀌는 시각적 튐 방지
      setTimeout(() => {
        addMutation.mutate(query);
      }, 200);
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
      setQuery(search);
      setSearchQuery(search);
      setIsFocused(false);
      
      // 리스트가 사라지는 애니메이션 도중에 아이템 순서가 바뀌어 
      // UI가 꼬여 보이는 현상을 방지하기 위해 0.2초 지연 후 업데이트
      setTimeout(() => {
        addMutation.mutate(search);
      }, 200);
    }
  };

  const handleRemoveRecentSearch = (id: number) => {
    deleteMutation.mutate(id);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const renderRecentSearches = () => (
    <RecentSearchContainer
      ref={recentSearchesRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <RecentSearchesHeader>
        <span>최근 검색어</span>
        <ClearAllButton onClick={handleClearAll}>전체삭제</ClearAllButton>
      </RecentSearchesHeader>
      <AnimatePresence>
        {recentSearches.map((item) => (
          <RecentSearchItem
            key={item.id}
            variants={itemVariants}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <span onClick={() => handleRecentSearchClick(item.query)}>
              {item.query}
            </span>
            <svg
              onClick={() => handleRemoveRecentSearch(item.id)}
              width="18"
              viewBox="0 0 18 18"
            >
              <Icon id="remove-search" width="18" height="18" />
            </svg>
          </RecentSearchItem>
        ))}
      </AnimatePresence>
    </RecentSearchContainer>
  );

  const renderEmptyState = () => {
    const tabText =
      selectedTab === "전체"
        ? "검색 결과가 없어요."
        : `${selectedTab} 검색 결과가 없어요.`;
    return <EmptyState message={tabText} top="50%" />;
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <AnimatePresence>
          <BackIcon
            key="back-icon"
            className="back-icon-btn"
            initial={{ opacity: 1, x: 21 }}
            width="9"
            height="16"
            onClick={handleBackClick}
          >
            <Icon id="back-upload" width="9" height="16" />
          </BackIcon>
        </AnimatePresence>
        <Title>검색</Title>
        <div style={{ width: "9px", height: "16px" }} />
      </Header>
      <SearchInputContainer>
        <SearchInputWrapper>
          <SearchInput
            id={inputId}
            name={inputName}
            ref={inputRef}
            value={query}
            placeholder="콘티, 노래 또는 가사 등"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
          />
          {query && isFocused && (
            <ClearIcon
              width="18"
              height="18"
              viewBox="0 0 18 18"
              onClick={handleClearSearch}
              className="clear-icon"
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
      <Content>
        <FlexSpacer
          animate={{
            flexGrow: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
        <AnimatePresence mode="popLayout">
          {isFocused && recentSearches.length > 0 ? (
            <motion.div
              key="recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              {renderRecentSearches()}
            </motion.div>
          ) : isFocused ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: "100%" }}
            >
              <EmptyState message={"최근 검색한 기록이 없어요."} top="50%" />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
            >
              <SectionTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />
              <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {searchQuery.trim() === "" ? (
                  renderEmptyState()
                ) : selectedTab === "전체" ? (
                  <AllTab key={`all-${searchQuery}`} searchQuery={searchQuery} />
                ) : selectedTab === "곡" ? (
                  <SongsTab key={`songs-${searchQuery}`} searchQuery={searchQuery} />
                ) : selectedTab === "콘티" ? (
                  <ContiTab key={`conti-${searchQuery}`} searchQuery={searchQuery} />
                ) : selectedTab === "가사" ? (
                  <LyricsTab key={`lyrics-${searchQuery}`} searchQuery={searchQuery} />
                ) : (
                  renderEmptyState()
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <FlexSpacer
          animate={{
            flexGrow: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      </Content>
    </Container>
  );
};

export default Result;
