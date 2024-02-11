import { styled } from "styled-components";

export const Container = styled.div`
  width: 115px;
  height: 158px;
  margin-bottom: 9px;
  cursor: pointer;
`;

export const ContiImgAndKeywords = styled.div`
  position: relative;
  width: 115px;
  height: 115px;
  border-radius: 10px;
  margin-bottom: 8px;
`;

export const ContiImage = styled.img`
  width: 115px;
  height: 115px;
  border-radius: 10px;
  filter: blur(1px);
`;

export const CenteredContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
`;

export const CenteredKeyword = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: whitesmoke;
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
  height: 20px;
  font-size: 10px;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 1px;
  padding: 0 6px;
`;
