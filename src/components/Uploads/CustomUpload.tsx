import React, { useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { SERVER_URL } from "../../api";
import Icon from "../Icon";

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

const AnimatedTitle = styled(motion.h2)`
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

const InputWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 90%;
  flex-direction: row;
  position: relative;
`;

const InputGroup = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MotionInput = styled(motion.input)<{ $hasError: boolean }>`
  width: 100%;
  border-radius: 10px;
  border: 2px solid #94b4ed;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 10px 30px 10px 10px;

  transition: border-color 0.3s ease-in-out;
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
  white-space: nowrap;
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
    if (step === 1) {
      if (contiTitle.trim() === "") {
        setHasError((prev) => ({ ...prev, title: true }));
        setTimeout(() => {
          setHasError((prev) => ({ ...prev, title: false }));
        }, 2000);
      } else {
        setStep(2);
      }
    } else if (step === 2) {
      if (contiDescription.trim() === "") {
        setHasError((prev) => ({ ...prev, description: true }));
        setTimeout(() => {
          setHasError((prev) => ({ ...prev, description: false }));
        }, 2000);
      } else {
        setStep(3);
      }
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
      const body = { title: contiTitle, description: contiDescription };
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
            제목만으로도 콘티가 생성돼요!
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
          <InputWrapper
            animate={{
              width: step > 1 ? "100%" : "90%",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <MotionInput
              ref={inputRef}
              placeholder="제목을 입력해주세요!"
              value={contiTitle}
              onChange={(e) => setContiTitle(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              $hasError={hasError.title}
              animate={{
                borderColor: hasError.title ? "#ea8c8c" : "#94b4ed",
              }}
              transition={{
                duration: 0.2,
                repeat: hasError.title ? 2 : 0,
                repeatType: "reverse",
              }}
            />
            {contiTitle && isFocused && (
              <ClearIcon
                width="18"
                height="18"
                onClick={() => handleClearSearch("title")}
              >
                <Icon id="clear-search" width="18" height="18" />
              </ClearIcon>
            )}
            {step === 1 && <NextButton onClick={handleNext}>다음</NextButton>}
          </InputWrapper>

          <AnimatePresence>
            {step >= 2 && (
              <InputWrapper
                initial={{ opacity: 0, y: 20, width: "90%" }}
                animate={{ opacity: 1, y: 0, width: step > 2 ? "100%" : "90%" }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <MotionInput
                  ref={descriptionRef}
                  placeholder="설명을 입력해주세요!"
                  value={contiDescription}
                  onChange={(e) => setContiDescription(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onKeyDown={handleKeyDown}
                  $hasError={hasError.description}
                  animate={{
                    borderColor: hasError.description ? "#ea8c8c" : "#94b4ed",
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: hasError.description ? 2 : 0,
                    repeatType: "reverse",
                  }}
                />
                {contiDescription && isFocused && (
                  <ClearIcon
                    width="18"
                    height="18"
                    onClick={() => handleClearSearch("description")}
                  >
                    <Icon id="clear-search" width="18" height="18" />
                  </ClearIcon>
                )}
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
