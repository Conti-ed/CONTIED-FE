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
  CompleteButton,
  Select,
  VisibilityInputWrapper,
  ErrorMessage,
} from "../../styles/Upload.styles";
import api from "../../utils/axios";

const CustomUpload = () => {
  const [contiTitle, setContiTitle] = useState("");
  const [contiDescription, setContiDescription] = useState("");
  const [visibility, setVisibility] = useState("공개");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState({
    title: false,
    description: false,
    visibility: false,
  });
  const [titleError, setTitleError] = useState("");
  const [step, setStep] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClearSearch = (field: "title" | "description") => {
    if (field === "title") {
      setContiTitle("");
      inputRef.current?.focus();
      setTitleError("");
    } else {
      setContiDescription("");
      descriptionRef.current?.focus();
    }
  };

  const validateTitle = () => {
    if (!contiTitle.trim()) {
      setTitleError("제목을 입력해주세요!");
      setTimeout(() => setTitleError(""), 2000);
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateTitle()) {
        setHasError((prev) => ({ ...prev, title: true }));
        setTimeout(() => {
          setHasError((prev) => ({ ...prev, title: false }));
        }, 2000);
      } else {
        setStep(step + 1);
      }
    } else if (step === 2) {
      if (!contiDescription.trim() && contiDescription.length > 0) {
        setHasError((prev) => ({ ...prev, description: true }));
        setTimeout(() => {
          setHasError((prev) => ({ ...prev, description: false }));
        }, 2000);
      } else {
        setStep(step + 1);
      }
    } else if (step === 3) {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    if (!validateTitle()) return;

    setIsLoading(true);
    try {
      const body = {
        title: contiTitle,
        description: contiDescription || "",
        visibility,
      };
      const response = await api.post("/conti/myconti/custom", body);
      const data = await response.data;
      localStorage.setItem(`conti_${data.id}`, JSON.stringify(data));

      if (!data.id) {
        throw new Error("Invalid response data: ID not found");
      }

      navigate(`/conti-detail/${data.id}`, { state: { fromUpload: true } });
    } catch (error) {
      console.error("Failed to create conti:", error);
      alert("콘티를 생성할 수 없습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && step < 4) {
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
            제목은 간결할수록 좋아요!
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
            key="title3"
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
              placeholder="제목을 입력해주세요! (필수)"
              value={contiTitle}
              onChange={(e) => setContiTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              $hasError={!!titleError}
              initial={{ width: "90%" }}
              animate={{
                width: step > 1 ? "100%" : "90%",
                borderColor: titleError ? "#ea8c8c" : "#94b4ed",
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            />
            <AnimatePresence>
              {contiTitle && isFocused && (
                <ClearIcon
                  width="18"
                  height="18"
                  onClick={() => handleClearSearch("title")}
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
          {titleError && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {titleError}
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
                  value={contiDescription}
                  onChange={(e) => setContiDescription(e.target.value)}
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
                  {contiDescription && isFocused && (
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
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  initial={{ width: "90%" }}
                  animate={{
                    width: step > 3 ? "100%" : "90%",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <option value="공개">공개</option>
                  <option value="비공개">비공개</option>
                </Select>
                {step < 4 && <NextButton onClick={handleNext}>다음</NextButton>}
              </VisibilityInputWrapper>
            )}
          </AnimatePresence>
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
        </InputGroup>
      </InputContainer>
    </Container>
  );
};

export default CustomUpload;
