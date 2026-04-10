import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

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
  padding: 8px 16px;
  background-color: ${(props) => props.theme.bgColor === "#F0F0F0" ? "rgba(75, 83, 188, 0.08)" : "rgba(255, 255, 255, 0.05)"};
  border: 1px solid ${(props) => props.theme.bgColor === "#F0F0F0" ? "rgba(75, 83, 188, 0.12)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 24px;
  font-size: 13.5px;
  font-weight: 500;
  color: ${(props) => props.theme.textColor === "#4B53BC" ? "#4B53BC" : "whitesmoke"};
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  
  &:active {
    background-color: ${(props) => props.theme.bgColor === "#F0F0F0" ? "rgba(75, 83, 188, 0.15)" : "rgba(255, 255, 255, 0.15)"};
  }
`;

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
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
    </SuggestionsWrapper>
  );
};

export default SearchSuggestions;
