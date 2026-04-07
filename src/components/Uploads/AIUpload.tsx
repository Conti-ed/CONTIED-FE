import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
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
  Select,
  VisibilityInputWrapper,
  KeywordErrorMessage,
} from "../../styles/Upload.styles";
import { postContiByAi } from "../../utils/axios";
import { useQueryClient } from "react-query";

const AIUpload = () => {
  const [contiKeyword, setContiKeyword] = useState("");
  const [contiBibleVerseFrom, setContiBibleVerseFrom] = useState("");
  const [contiBibleVerseTo, setContiBibleVerseTo] = useState("");
  const [visibility, setVisibility] = useState("공개");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keywordError, setKeywordError] = useState("");
  const [step, setStep] = useState(1);
  const [expandedFrom, setExpandedFrom] = useState(false);
  const [expandedTo, setExpandedTo] = useState(false);
  const keywordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleClearSearch = (
    field: "keyword" | "bibleVerseFrom" | "bibleVerseTo"
  ) => {
    if (field === "keyword") {
      setContiKeyword("");
      keywordRef.current?.focus();
      setKeywordError("");
    } else if (field === "bibleVerseFrom") {
      setContiBibleVerseFrom("");
    } else {
      setContiBibleVerseTo("");
    }
  };

  const validateKeyword = (keyword: string): boolean => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword === "") return false;
    if (!trimmedKeyword.includes(",")) return true;
    return trimmedKeyword.split(",").every((word) => word.trim() !== "");
  };

  const handleBibleVerseFromChange = (verse: string, abbreviation: string) => {
    if (!verse.startsWith(abbreviation)) {
      setContiBibleVerseFrom(`${abbreviation}${verse}`);
    } else {
      setContiBibleVerseFrom(verse);
    }
  };

  const handleBibleVerseToChange = (verse: string, abbreviation: string) => {
    if (!verse.startsWith(abbreviation)) {
      setContiBibleVerseTo(`${abbreviation}${verse}`);
    } else {
      setContiBibleVerseTo(verse);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateKeyword(contiKeyword)) {
        setKeywordError("키워드를 하나 이상 적어주세요!");
        setTimeout(() => {
          setKeywordError("");
        }, 2000);
      } else {
        setStep((prevStep) => prevStep + 1);
      }
    } else if (step === 2) {
      setStep((prevStep) => prevStep + 1);
      setExpandedFrom(true);
    } else if (step === 3) {
      setStep((prevStep) => prevStep + 1);
      setExpandedTo(true);
    } else if (step === 4) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleComplete = async () => {
    if (!validateKeyword(contiKeyword)) {
      setKeywordError("키워드를 하나 이상 적어주세요!");
      setTimeout(() => {
        setKeywordError("");
      }, 2000);
      return;
    }

    const keywordsArray = contiKeyword
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword !== "");

    let bibleVerseRange = null;
    if (contiBibleVerseFrom && contiBibleVerseTo) {
      const fromVerseMatch = contiBibleVerseFrom.match(/\d+:\d+/);
      const toVerseMatch = contiBibleVerseTo.match(/\d+:\d+/);

      const fromVerse = fromVerseMatch
        ? contiBibleVerseFrom.replace(/^(\D+)(.*)/, "$1") + fromVerseMatch[0]
        : contiBibleVerseFrom;

      const toVerse = toVerseMatch
        ? contiBibleVerseTo.replace(/^(\D+)(.*)/, "$1") + toVerseMatch[0]
        : contiBibleVerseTo;

      bibleVerseRange = `${fromVerse}~${toVerse}`;
    } else if (contiBibleVerseFrom) {
      const fromVerseMatch = contiBibleVerseFrom.match(/\d+:\d+/);
      bibleVerseRange = fromVerseMatch
        ? contiBibleVerseFrom.replace(/^(\D+)(.*)/, "$1") + fromVerseMatch[0]
        : contiBibleVerseFrom;
    } else if (contiBibleVerseTo) {
      const toVerseMatch = contiBibleVerseTo.match(/\d+:\d+/);
      bibleVerseRange = toVerseMatch
        ? contiBibleVerseTo.replace(/^(\D+)(.*)/, "$1") + toVerseMatch[0]
        : contiBibleVerseTo;
    }

    setIsLoading(true);
    try {
      const data = await postContiByAi(keywordsArray, bibleVerseRange);
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

      queryClient.invalidateQueries(["myContis"]);

      navigate(`/conti-detail/${data.id}`, { state: { fromUpload: true } });
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
        ) : step === 2 || step === 3 ? (
          <AnimatedTitle
            key="title2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={inputVariants}
          >
            콘티의 주제가 될 성경 구절을 선택해주세요!
          </AnimatedTitle>
        ) : step === 4 ? (
          <AnimatedTitle
            key="title3"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={inputVariants}
          >
            공개 여부를 선택해주세요!
          </AnimatedTitle>
        ) : step === 5 ? (
          <AnimatedTitle
            key="title4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={inputVariants}
          >
            완성된 콘티를 확인해볼까요?
          </AnimatedTitle>
        ) : null}
      </AnimatePresence>
      <InputContainer>
        <InputGroup>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InputWrapper>
              <MotionInput
                ref={keywordRef}
                placeholder="예) 사랑, 생명, 삶의 예배 (필수)"
                value={contiKeyword}
                onChange={(e) => setContiKeyword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                $hasError={keywordError !== ""}
                initial={{ width: "90%" }}
                animate={{
                  width: step > 1 ? "100%" : "90%",
                  borderColor: keywordError ? "#ea8c8c" : "#94b4ed",
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
            {keywordError && (
              <KeywordErrorMessage
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {keywordError}
              </KeywordErrorMessage>
            )}
          </motion.div>

          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                key="bibleVerseFrom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InputWrapper>
                  <BibleVerseSelector
                    onChange={handleBibleVerseFromChange}
                    $hasError={false}
                    expanded={expandedFrom}
                    placeholder="성경 (선택)"
                  />
                  {step === 2 && (
                    <NextButton onClick={handleNext}>부터</NextButton>
                  )}
                </InputWrapper>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                key="bibleVerseTo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <InputWrapper>
                  <BibleVerseSelector
                    onChange={handleBibleVerseToChange}
                    $hasError={false}
                    expanded={expandedTo}
                    placeholder="성경 (선택)"
                  />
                  {step === 3 && (
                    <NextButton onClick={handleNext}>까지</NextButton>
                  )}
                </InputWrapper>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {step >= 4 && (
              <VisibilityInputWrapper
                key="visibility"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  initial={{ width: "90%" }}
                  animate={{
                    width: step > 4 ? "100%" : "90%",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <option value="공개">공개</option>
                  <option value="비공개">비공개</option>
                </Select>
                {step === 4 && (
                  <NextButton onClick={handleNext}>다음</NextButton>
                )}
              </VisibilityInputWrapper>
            )}
          </AnimatePresence>
        </InputGroup>

        <AnimatePresence>
          {step === 5 && (
            <CompleteButton
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
