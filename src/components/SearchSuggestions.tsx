import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { SuggestionSkeletonList } from "./Skeleton";

const SuggestionsWrapper = styled.div`
  width: 100%;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.div)`
  color: #171A1F;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 24px;
  text-align: center;
  opacity: 0.8;
  letter-spacing: -0.02em;
`;

const SuggestionsContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 320px;
`;

const SuggestionChip = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  background-color: ${(props) => props.theme.brandColor};
  border: none;
  border-radius: 24px;
  font-size: 13.5px;
  font-weight: 500;
  color: ${(props) => 
    props.theme.bgColor === "#F0F0F0" ? "white" : props.theme.mainTextColor
  };
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(148, 180, 237, 0.3);
  
  &:active {
    scale: 0.96;
    opacity: 0.9;
  }
`;

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  loading?: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  loading = false,
}) => {
  const [randomSuggestions, setRandomSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const getRandomSuggestions = (words: string[], count: number) => {
      const shuffled = [...words];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    };
    if (suggestions && suggestions.length > 0) {
      setRandomSuggestions(getRandomSuggestions(suggestions, 14));
    }
  }, [suggestions]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <SuggestionsWrapper>
      <Title
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        추천 검색어
      </Title>
      
      {loading || (suggestions.length === 0 && randomSuggestions.length === 0) ? (
        <SuggestionSkeletonList count={14} />
      ) : (
        <SuggestionsContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {randomSuggestions.map((suggestion, index) => (
              <SuggestionChip
                key={`suggestion-${suggestion}-${index}`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </SuggestionChip>
            ))}
          </AnimatePresence>
        </SuggestionsContainer>
      )}
    </SuggestionsWrapper>
  );
};

export default SearchSuggestions;
