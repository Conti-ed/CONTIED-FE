import { styled } from "styled-components";

export const Container = styled.div`
  width: 115px;
  height: 158px;
  margin-bottom: 9px;
  cursor: pointer;
`;

export const ContiImage = styled.img`
  width: 115px;
  height: 115px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

export const ContiTitle = styled.div`
  margin-bottom: 5px;
`;

export const KeywordsContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  gap: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const Contikeyword = styled.div`
  background-color: ${(props) => props.theme.keywordColor};
  display: grid;
  place-content: center;
  width: auto;
  height: 18px;
  font-size: 6px;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 1px;
  padding: 0 6px;
`;
