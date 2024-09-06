import React, { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { SERVER_URL } from "../../api";
import Icon from "../Icon";
import BibleVerseSelector from "../BibleVerseSelector";
import {
  Container,
  AnimatedTitle,
  InputContainer,
  InputWrapper,
  InputGroup,
  MotionInput,
  ClearIcon,
  NextButton,
  CompleteButton,
} from "../../styles/Upload.styles";

const AIUpload = () => {
  const [contiKeyword, setContiKeyword] = useState("");
  const [contiBibleVerse, setContiBibleVerse] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState({
    keyword: false,
    bibleVerse: false,
  });
  const [step, setStep] = useState(1);
  const keywordRef = useRef<HTMLInputElement>(null);
  const bibleVerseRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClearSearch = (field: "keyword" | "bibleVerse") => {
    if (field === "keyword") {
      setContiKeyword("");
      keywordRef.current?.focus();
    } else {
      setContiBibleVerse("");
      bibleVerseRef.current?.focus();
    }
  };

  const validateKeyword = (keyword: string): boolean => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword === "") return false;
    if (!trimmedKeyword.includes(",")) return true;
    return trimmedKeyword.split(",").every((word) => word.trim() !== "");
  };

  const handleBibleVerseChange = (verse: string) => {
    setContiBibleVerse(verse);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateKeyword(contiKeyword)) {
        setHasError((prev) => ({ ...prev, keyword: true }));
        setTimeout(() => {
          setHasError((prev) => ({ ...prev, keyword: false }));
        }, 2000);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      if (contiBibleVerse.trim() === "") {
        setHasError((prev) => ({ ...prev, bibleVerse: true }));
        setTimeout(() => {
          setHasError((prev) => ({ ...prev, bibleVerse: false }));
        }, 2000);
      } else {
        setStep(3);
      }
    }
  };

  const handleComplete = async () => {
    if (!validateKeyword(contiKeyword)) {
      setHasError((prev) => ({ ...prev, keyword: true }));
      setTimeout(() => {
        setHasError((prev) => ({ ...prev, keyword: false }));
      }, 2000);
      return;
    }

    setIsLoading(true);
    try {
      const body = { keyword: contiKeyword, bibleVerse: contiBibleVerse };
      const response = await fetch(`${SERVER_URL}/api/conti`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to create conti");
      }

      const data = await response.json();
      console.log(data);

      const contiData = {
        id: data.id,
        title: data.title,
        description: data.description,
        ownerName: data.owner.name,
        updated_at: data.updated_at,
        lyrics: data.lyrics,
        duration: data.duration,
        songs: data.songs,
        thumbnail: "/images/WhitePiano.png",
      };
      localStorage.setItem(`conti_${contiData.id}`, JSON.stringify(contiData));

      navigate(`/conti-detail/${data.id}`);
    } catch (error) {
      console.error("Failed to create conti:", error);
      alert("콘티를 생성할 수 없습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const inputVariants = {
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
            variants={inputVariants}
          >
            어떤 주제를 담아낼 콘티인가요?
          </AnimatedTitle>
        ) : (
          <AnimatedTitle
            key="title2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={inputVariants}
          >
            콘티의 주제가 될 성경 구절을 선택해주세요!
          </AnimatedTitle>
        )}
      </AnimatePresence>
      <InputContainer>
        <InputGroup>
          <InputWrapper>
            <MotionInput
              ref={keywordRef}
              placeholder="예) 사랑, 생명, 삶의 예배"
              value={contiKeyword}
              onChange={(e) => setContiKeyword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              $hasError={hasError.keyword}
              initial={{ width: "90%" }}
              animate={{
                width: step > 1 ? "100%" : "90%",
                borderColor: hasError.keyword ? "#ea8c8c" : "#94b4ed",
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
            <AnimatePresence>
              {contiKeyword && isFocused && (
                <ClearIcon
                  width="18"
                  height="18"
                  onClick={() => handleClearSearch("keyword")}
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

          <AnimatePresence>
            {step >= 2 && (
              <InputWrapper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <BibleVerseSelector
                  onChange={handleBibleVerseChange}
                  $hasError={hasError.bibleVerse}
                />
                {step === 2 && (
                  <NextButton onClick={handleNext}>다음</NextButton>
                )}
              </InputWrapper>
            )}
          </AnimatePresence>
        </InputGroup>

        <AnimatePresence>
          {step === 3 && (
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

export default AIUpload;
