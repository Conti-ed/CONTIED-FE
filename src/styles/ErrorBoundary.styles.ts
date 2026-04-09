import styled from "styled-components";

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 0 40px;
  text-align: center;
`;

export const IllustrationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: ${(props) => props.theme.accentColor};
  border-radius: 24px;
  margin-bottom: 32px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.3;
`;

export const Description = styled.p`
  font-size: 15px;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 40px;
  word-break: keep-all;
`;

export const ActionButton = styled.button`
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  border: none;
  padding: 16px 36px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:active {
    transform: scale(0.95);
    opacity: 0.9;
  }
`;
