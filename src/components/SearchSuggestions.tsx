import React, { useEffect, useState } from "react";
import styled from "styled-components";

const SuggestionsWrapper = styled.div`
  padding: 20px;
`;

const Title = styled.div`
  color: #000;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: center;
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const Suggestion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 15px;
  background-color: #94b4ed;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 300;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #94b4ed;
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
    setRandomSuggestions(getRandomSuggestions(suggestions, 14));
  }, [suggestions]);

  return (
    <SuggestionsWrapper>
      <Title>랜덤 검색어</Title>
      <SuggestionsContainer>
        {randomSuggestions.map((suggestion, index) => (
          <Suggestion key={index} onClick={() => onSuggestionClick(suggestion)}>
            {suggestion}
          </Suggestion>
        ))}
      </SuggestionsContainer>
    </SuggestionsWrapper>
  );
};

export default SearchSuggestions;
