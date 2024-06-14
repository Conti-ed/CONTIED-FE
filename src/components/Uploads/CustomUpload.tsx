import React, { useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const blink = keyframes`
  0%, 100% {
    border-color: #ea8c8c;
  }
  50% {
    border-color: #ffffff;
  }
`;

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
  position: relative;
`;

const MotionInput = styled(motion.input)<{ $hasError: boolean }>`
  width: 90%;
  border-radius: 10px;
  border: 2px solid #94b4ed;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 10px 10px;
  ${(props) =>
    props.$hasError &&
    css`
      animation: ${blink} 0.2s step-end 2;
      border-color: #ea8c8c;
    `}

  &:focus {
    outline: none;
    background-color: rgba(148, 180, 237, 0.2);
    font-weight: 300;
  }

  &::placeholder {
    color: #8c8c8c;
    font-weight: 300;
  }
`;

const ClearIcon = styled.svg`
  position: absolute;
  right: 44px;
  cursor: pointer;
  z-index: 10;
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

const CompleteButton = styled(motion.div)`
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #4f8eec;
  border: 2px solid #94b4ed;
  border-radius: 10px;
  padding: 10px 10px;
  width: 100%;
`;

const CustomUpload = () => {
  const [contiTitle, setContiTitle] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleClearSearch = () => {
    setContiTitle("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = () => {
    if (contiTitle.trim() === "") {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 2000); // 애니메이션 지속 시간 조정
    } else {
      setShowCompleteButton(true);
    }
  };

  const handleComplete = () => {
    const contiData = {
      id: `${Date.now()}`,
      title: contiTitle,
      ownerName: "준석",
      createdDate: new Date().toISOString().split("T")[0],
      duration: 0,
      songs: [],
      thumbnail: "/images/WhitePiano.png",
    };
    localStorage.setItem(`conti_${contiData.id}`, JSON.stringify(contiData));
    navigate(`/conti-detail/${contiData.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <Title>제목만으로도 콘티가 생성되요!</Title>
      <InputContainer>
        <InputWrapper>
          <MotionInput
            ref={inputRef}
            placeholder="제목을 입력해주세요!"
            value={contiTitle}
            onChange={(e) => setContiTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            $hasError={hasError}
            animate={{
              borderColor: hasError ? "#ea8c8c" : "#94b4ed",
              transition: {
                duration: 0.2,
                repeat: hasError ? 2 : 0,
                repeatType: "reverse",
              },
            }}
          />
          {contiTitle && isFocused && (
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
          <NextButton onClick={handleSearch}>다음</NextButton>
        </InputWrapper>
        {showCompleteButton && (
          <CompleteButton
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleComplete}
          >
            완료!
          </CompleteButton>
        )}
      </InputContainer>
    </Container>
  );
};

export default CustomUpload;
