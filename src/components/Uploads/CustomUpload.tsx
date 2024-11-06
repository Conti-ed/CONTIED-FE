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
} from "../../styles/Upload.styles";
import api from "../../utils/axios";

const CustomUpload = () => {
  const [contiTitle, setContiTitle] = useState("");
  const [contiDescription, setContiDescription] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState({
    title: false,
    description: false,
  });
  const [step, setStep] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleClearSearch = (field: "title" | "description") => {
    if (field === "title") {
      setContiTitle("");
      inputRef.current?.focus();
    } else {
      setContiDescription("");
      descriptionRef.current?.focus();
    }
  };

  const handleNext = () => {
    if (step === 1 && contiTitle.trim() === "") {
      setHasError((prev) => ({ ...prev, title: true }));
      setTimeout(() => {
        setHasError((prev) => ({ ...prev, title: false }));
      }, 2000);
    } else {
      setStep(step + 1);
    }
  };

  const handleComplete = async () => {
    if (contiTitle.trim() === "") {
      setHasError((prev) => ({ ...prev, title: true }));
      setTimeout(() => {
        setHasError((prev) => ({ ...prev, title: false }));
      }, 2000);
      return;
    }

    setIsLoading(true);
    try {
      const body = { title: contiTitle, description: contiDescription || "" }; // description이 비어 있을 때 빈 문자열로 설정
      const response = await api.post("/conti/myconti/custom", body);
      const data = await response.data;
      localStorage.setItem(`conti_${data.id}`, JSON.stringify(data));

      if (!data.id) {
        throw new Error("Invalid response data: ID not found");
      }

      navigate(`/conti-detail/${data.id}`);
    } catch (error) {
      console.error("Failed to create conti:", error);
      alert("콘티를 생성할 수 없습니다. 다시 시도해주세요.");
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
            제목은 간결할수록 좋아요!
          </AnimatedTitle>
        ) : (
          <AnimatedTitle
            key="title2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={titleVariants}
          >
            콘티에 대한 설명을 추가해주세요!
          </AnimatedTitle>
        )}
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
              $hasError={hasError.title}
              initial={{ width: "90%" }}
              animate={{
                width: step > 1 ? "100%" : "90%",
                borderColor: hasError.title ? "#ea8c8c" : "#94b4ed",
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

export default CustomUpload;
