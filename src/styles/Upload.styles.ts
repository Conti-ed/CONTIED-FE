import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";

export const blink = keyframes`
  0%, 100% {
    border-color: #ea8c8c;
  }
  50% {
    border-color: #ffffff;
  }
`;

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AnimatedTitle = styled(motion.h2)`
  width: 90%;
  margin-left: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #171a1f;
`;

export const InputContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InputWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
  position: relative;
`;

export const InputGroup = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MotionInput = styled(motion.input)<{ $hasError: boolean }>`
  width: 90%;
  border-radius: 10px;
  border: 2px solid #94b4ed;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 10px 30px 10px 10px;
  transition: all 0.3s ease-in-out;

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

export const ClearIcon = styled(motion.svg)`
  position: absolute;
  cursor: pointer;
  z-index: 10;
`;

export const NextButton = styled.div`
  font-size: 13px;
  font-weight: 300;
  color: #94b4ed;
  margin-left: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
`;

export const ErrorMessage = styled(motion.div)`
  font-size: 11px;
  color: #ea8c8c;
  align-self: flex-start;
  padding-left: 10px;
  font-weight: 300;
`;

export const CompleteButton = styled(motion.div)`
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
