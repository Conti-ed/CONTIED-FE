import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import Icon from "../Icon";
import {
  Container,
  AnimatedTitle,
  InputContainer,
  InputWrapper,
  InputGroup,
  MotionInput,
  ClearIcon,
  NextButton,
  ErrorMessage,
  CompleteButton,
  Select,
  VisibilityInputWrapper,
} from "../../styles/Upload.styles";
import { postContiByYouTube } from "../../utils/axios";

const YouTubeUpload = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [visibility, setVisibility] = useState("공개");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError /* setHasError */] = useState({
    url: false,
    description: false,
  });
  const [urlError, setUrlError] = useState(false);
  const [step, setStep] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateYouTubePlaylistUrl = (url: string) => {
    const youtubePlaylistRegex =
      /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+&si=[a-zA-Z0-9_-]+$/;
    return youtubePlaylistRegex.test(url);
  };

  const handleClearSearch = (field: "url" | "description") => {
    if (field === "url") {
      setPlaylistUrl("");
      inputRef.current?.focus();
    } else {
      setPlaylistDescription("");
      descriptionRef.current?.focus();
    }
  };

  const handleNext = () => {
    if (
      step === 1 &&
      (playlistUrl.trim() === "" || !validateYouTubePlaylistUrl(playlistUrl))
    ) {
      setUrlError(true);
      setTimeout(() => {
        setUrlError(false);
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    if (playlistUrl.trim() === "" || !validateYouTubePlaylistUrl(playlistUrl)) {
      setUrlError(true);
      setTimeout(() => setUrlError(false), 2000);
      return;
    }
    setIsLoading(true);
    try {
      const data = await postContiByYouTube(playlistUrl, playlistDescription);
      console.log(data);

      const contiData = {
        id: data.id,
        title: data.title,
        description: data.description,
        userId: data.userId,
        updatedAt: data.updatedAt,
        duration: data.duration,
        thumbnail: data.thumbnail || "/images/WhitePiano.png",
      };
      localStorage.setItem(`conti_${contiData.id}`, JSON.stringify(contiData));

      navigate(`/conti-detail/${data.id}`, { state: { fromUpload: true } });
    } catch (error) {
      console.error("Failed to create conti:", error);
      setUrlError(true);
      setTimeout(() => setUrlError(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && step < 3) {
      handleNext();
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <Container>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <AnimatedTitle
            key="title1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={titleVariants}
          >
            링크만으로도 콘티가 생성돼요!
          </AnimatedTitle>
        ) : step === 2 ? (
          <AnimatedTitle
            key="title2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={titleVariants}
          >
            콘티에 대한 설명을 추가해주세요!
          </AnimatedTitle>
        ) : step === 3 ? (
          <AnimatedTitle
            key="title3"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={titleVariants}
          >
            공개 여부를 선택해주세요!
          </AnimatedTitle>
        ) : step === 4 ? (
          <AnimatedTitle
            key="title4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={titleVariants}
          >
            완성된 콘티를 확인해볼까요?
          </AnimatedTitle>
        ) : null}
      </AnimatePresence>
      <InputContainer>
        <InputGroup>
          <InputWrapper>
            <MotionInput
              ref={inputRef}
              placeholder="유튜브 재생목록 URL를 복사해서 넣어주세요!"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              $hasError={urlError}
              initial={{ width: "90%" }}
              animate={{
                width: step > 1 ? "100%" : "90%",
                borderColor: urlError ? "#ea8c8c" : "#94b4ed",
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
            <AnimatePresence>
              {playlistUrl && isFocused && (
                <ClearIcon
                  width="18"
                  height="18"
                  onClick={() => handleClearSearch("url")}
                  initial={{ opacity: 0, right: step > 1 ? "10px" : "44px" }}
                  animate={{ opacity: 1, right: step > 1 ? "10px" : "44px" }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: "easeInOut",
                  }}
                >
                  <Icon id="clear-search" width="18" height="18" />
                </ClearIcon>
              )}
            </AnimatePresence>
            {step === 1 && <NextButton onClick={handleNext}>다음</NextButton>}
          </InputWrapper>
          {urlError && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              올바른 유튜브 재생목록 URL을 입력해주세요!
            </ErrorMessage>
          )}
          <AnimatePresence>
            {step >= 2 && (
              <InputWrapper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <MotionInput
                  ref={descriptionRef}
                  placeholder="설명을 입력해주세요! (선택)"
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  $hasError={hasError.description}
                  initial={{ width: "90%" }}
                  animate={{
                    width: step > 2 ? "100%" : "90%",
                    borderColor: hasError.description ? "#ea8c8c" : "#94b4ed",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                />
                <AnimatePresence>
                  {playlistDescription && isFocused && (
                    <ClearIcon
                      width="18"
                      height="18"
                      onClick={() => handleClearSearch("description")}
                      initial={{
                        opacity: 0,
                        right: step > 2 ? "10px" : "44px",
                      }}
                      animate={{
                        opacity: 1,
                        right: step > 2 ? "10px" : "44px",
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.9,
                        ease: "easeInOut",
                      }}
                    >
                      <Icon id="clear-search" width="18" height="18" />
                    </ClearIcon>
                  )}
                </AnimatePresence>
                {step === 2 && (
                  <NextButton onClick={handleNext}>다음</NextButton>
                )}
              </InputWrapper>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step >= 3 && (
              <VisibilityInputWrapper
                key="visibility"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  initial={{ width: "90%" }}
                  animate={{
                    width: step > 3 ? "100%" : "90%",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <option value="공개">공개</option>
                  <option value="비공개">비공개</option>
                </Select>
                {step === 3 && (
                  <NextButton onClick={handleNext}>다음</NextButton>
                )}
              </VisibilityInputWrapper>
            )}
          </AnimatePresence>
        </InputGroup>

        <AnimatePresence>
          {step === 4 && (
            <CompleteButton
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
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
        </AnimatePresence>
      </InputContainer>
    </Container>
  );
};

export default YouTubeUpload;
