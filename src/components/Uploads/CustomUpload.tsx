import React, { useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  width: 90%;
  margin-left: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #171a1f;
`;

const InputContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
`;

const Input = styled.input`
  width: 90%;
  border-radius: 10px;
  border: 2px solid #94b4ed;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 10px 10px;

  &:focus {
    outline: none;
    font-weight: 300;
  }

  &::placeholder {
    color: #8c8c8c;
    font-weight: 300;
  }
`;

const ClearIcon = styled.svg`
  position: absolute;
  right: 63px;
  cursor: pointer;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
`;

const NextButton = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #94b4ed;
  margin-left: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Bar = styled.div`
  margin-top: 6px;
  width: 100%;
  border-bottom: 2px solid #171a1f;
`;

const CustomUpload = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClearSearch = () => {
    if (inputRef.current) {
      setSearchQuery("");
      inputRef.current.focus();
    }
  };

  const handleSearch = () => {
    // 검색 로직
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <Title>제목만으로도 콘티가 생성되요!</Title>
      <InputContainer>
        <InputWrapper>
          <Input
            ref={inputRef}
            placeholder="타이틀을 입력해주세요!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && isFocused && (
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
          <NextButton>다음</NextButton>
        </InputWrapper>
        <Bar />
      </InputContainer>
    </Container>
  );
};

export default CustomUpload;
