import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

export const KeywordContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow: auto;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Keyword = styled.div`
  background-color: ${(props) => props.theme.keywordColor};
  padding: 6px 16px;
  display: grid;
  place-content: center;
  height: 32px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 1px;
`;

export const SectionContainer = styled.div`
  margin-bottom: 30px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
`;

export const SectionTitle = styled.span`
  font-size: 28px;
`;

export const SectionMore = styled.div`
  background-color: ${(props) => props.theme.keywordColor};
  display: grid;
  place-content: center;
  width: 48px;
  height: 18px;
  font-size: 9px;
  font-weight: 400;
  border-radius: 8px;
  white-space: nowrap;
  cursor: pointer;
  letter-spacing: 1px;
`;

export const SectionBody = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;
  grid-auto-flow: column;
  overflow: auto;
  margin-bottom: 30px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// export const CCMContainer = styled.div``;
// export const CCMHeader = styled.div``;
