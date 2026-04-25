import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import styled from "styled-components";
import animationData from "./waitingAnimation.json";

const STEPS = [
  "말씀과 키워드를 묵상하는 중...",
  "어울리는 찬양을 찾는 중...",
  "콘티 제목을 짓는 중...",
  "예배자에게 전할 메시지를 다듬는 중...",
];

// 각 단계가 끝나는 시각(ms): 5초, 10초, 20초, 이후는 3번 인덱스 유지
const STEP_THRESHOLDS = [5000, 10000, 20000];
const LONG_WAIT_THRESHOLD = 60000;

const FullScreenWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 430px;
  bottom: 0;
  background-color: ${(props) => props.theme.bgColor || "#ffffff"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`;

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0 24px;
`;

const StepTextWrapper = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const StepText = styled(motion.p)`
  font-size: 15px;
  font-weight: 400;
  color: #323743;
  text-align: center;
  margin: 0;
`;

const HintText = styled.p`
  font-size: 12px;
  font-weight: 300;
  color: #9095a1;
  text-align: center;
  margin-top: 40px;
  line-height: 1.6;
`;

const ProgressDotsWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ProgressDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? "#94b4ed" : "#d7e4ff")};
  transition: background-color 0.4s ease;
`;

const LongWaitBox = styled(motion.div)`
  margin-top: 28px;
  padding: 16px 20px;
  background: #f0f5ff;
  border: 1px solid #c5d8f8;
  border-radius: 12px;
  text-align: center;
  width: 100%;
  max-width: 320px;
`;

const LongWaitTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #323743;
  margin: 0 0 6px;
`;

const LongWaitSubtitle = styled.p`
  font-size: 12px;
  font-weight: 300;
  color: #9095a1;
  margin: 0;
  line-height: 1.5;
`;

const AiContiGenerating: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showLongWait, setShowLongWait] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = STEP_THRESHOLDS.map(
      (threshold, idx) =>
        setTimeout(() => {
          setStepIndex(idx + 1);
        }, threshold)
    );

    const longWaitTimer = setTimeout(() => {
      setShowLongWait(true);
    }, LONG_WAIT_THRESHOLD);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(longWaitTimer);
    };
  }, []);

  return (
    <FullScreenWrapper>
      <InnerContent>
        <Player
          autoplay
          loop
          src={animationData}
          style={{ height: "150px", width: "150px" }}
        />

        <StepTextWrapper>
          <AnimatePresence mode="wait">
            <StepText
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {STEPS[stepIndex]}
            </StepText>
          </AnimatePresence>
        </StepTextWrapper>

        <ProgressDotsWrapper>
          {STEPS.map((_, idx) => (
            <ProgressDot key={idx} $active={idx <= stepIndex} />
          ))}
        </ProgressDotsWrapper>

        <HintText>
          AI가 콘티를 만들고 있어요.{"\n"}약 30초 정도 걸려요.
        </HintText>

        <AnimatePresence>
          {showLongWait && (
            <LongWaitBox
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.5 }}
            >
              <LongWaitTitle>조금 더 시간이 걸리고 있어요. 잠시만 기다려주세요 🙏</LongWaitTitle>
              <LongWaitSubtitle>AI가 정성껏 콘티를 만드는 중이에요.</LongWaitSubtitle>
            </LongWaitBox>
          )}
        </AnimatePresence>
      </InnerContent>
    </FullScreenWrapper>
  );
};

export default AiContiGenerating;
