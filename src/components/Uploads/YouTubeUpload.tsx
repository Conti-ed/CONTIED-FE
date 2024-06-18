import React, { useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../api";
import { Oval } from "react-loader-spinner";

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
  padding: 10px 30px 10px 10px;
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

const YouTubeUpload = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClearSearch = () => {
    setPlaylistUrl("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = () => {
    if (playlistUrl.trim() === "") {
      setHasError(true);
      setTimeout(() => {
        setHasError(false);
      }, 2000);
    } else {
      setShowCompleteButton(true);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await fetch(`${SERVER_URL}/api/conti`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          playlist_url: playlistUrl,
          // user_id: JSON.parse(localStorage.getItem("user_info")!).id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create conti");
      }

      const data = await response.json();
      console.log(data);

      // localStorage에 contiData 저장
      const contiData = {
        id: data.id,
        title: data.title,
        ownerName: data.owner.name,
        updated_at: data.updated_at,
        lyrics: data.lyrics,
        duration: data.duration,
        songs: data.songs,
        thumbnail: data.thumbnail || "/images/WhitePiano.png",
      };
      localStorage.setItem(`conti_${contiData.id}`, JSON.stringify(contiData));

      navigate(`/conti-detail/${data.id}`);
    } catch (error) {
      console.error("Failed to fetch playlist title:", error);
      alert("재생목록을 가져올 수 없습니다. URL을 확인해주세요.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <Title>링크만으로도 콘티가 생성돼요!</Title>
      <InputContainer>
        <InputWrapper>
          <MotionInput
            ref={inputRef}
            placeholder="유튜브 재생목록 URL를 복사해서 넣어주세요!"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
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
          {playlistUrl && isFocused && (
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
            {isLoading ? (
              <Oval
                height={15}
                width={15}
                color="#ffffff"
                secondaryColor="#94b4ed"
                strokeWidth={5}
                strokeWidthSecondary={5}
              />
            ) : (
              "완료!"
            )}
          </CompleteButton>
        )}
      </InputContainer>
    </Container>
  );
};

export default YouTubeUpload;
