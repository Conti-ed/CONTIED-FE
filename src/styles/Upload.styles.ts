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

export const SelectorContainer = styled(motion.div)`
  display: flex;
  gap: 10px;
  width: 100%;
`;

export const Select = styled(motion.select)`
  width: 90%;
  border-radius: 10px;
  border: 2px solid #94b4ed;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 10px;
  padding-right: 10px;
  transition: all 0.3s ease-in-out;
  font-family: inherit;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%2394b4ed" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;

  &:focus {
    outline: none;
    background-color: rgba(148, 180, 237, 0.2);
    font-weight: 300;
  }

  option {
    font-size: 12px;
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
  margin-top: -5px;
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

export const VisibilityInputWrapper = styled(InputWrapper)`
  flex-direction: row;
  align-items: center;

  ${Select} {
    width: 90%;
  }

  ${NextButton} {
    flex: 1;
    text-align: center;
  }
`;
