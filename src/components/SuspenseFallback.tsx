import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.bgColor};
  z-index: 3000;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid ${(props) => props.theme.textColor}22;
  border-top-color: #4f8eec;
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;
`;

const SuspenseFallback: React.FC = () => (
  <Wrapper>
    <Spinner />
  </Wrapper>
);

export default SuspenseFallback;
