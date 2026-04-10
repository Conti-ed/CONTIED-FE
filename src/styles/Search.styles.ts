import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #fff;
  overflow: hidden;
`;

export const Header = styled.div`
  width: 100%;
  margin-top: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const BackIcon = styled(motion.svg)`
  margin-right: 10px;
  width: 9px;
  height: 16px;
  cursor: pointer;
`;

export const Title = styled.h1<{ $isFocused?: boolean }>`
  font-size: 18px;
  font-weight: 500;
  color: #171A1F;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const SearchInputContainer = styled.div`
  width: 90%;
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  font-size: 13.7px;
  font-weight: 300;
  color: #171a1f;
  background-color: transparent;
  padding: 5px 0;

  &:focus {
    outline: none;
    font-weight: 300;
  }

  &::placeholder {
    color: #8c8c8c;
    font-weight: 300;
  }
`;

export const ClearIcon = styled.svg`
  margin-left: 10px;
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  z-index: 10; /* Ensure ClearIcon is clickable */
  background-color: rgba(
    255,
    255,
    255,
    0.8
  ); /* Optional: For testing the click area */
  border-radius: 50%; /* Optional: For better UI */
`;

export const SearchIcon = styled.svg`
  margin-right: 3px;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

export const SearchBar = styled.div`
  margin-top: 6px;
  width: 100%;
  border-bottom: 2px solid #171a1f;
`;

export const Content = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  margin-bottom: 53px; /* TabBar height */
  position: relative; /* popLayout을 위해 필수 */
`;

export const SearchPageText = styled.h2`
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #171a1f;
  justify-self: center;
`;

export const TabBarWrapper = styled.div<{ $isFocused: boolean }>`
  position: absolute;
  bottom: ${(props) => (props.$isFocused ? "210px" : "0px")};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: bottom 0.3s ease;
`;

export const RecentSearchContainer = styled(motion.div)`
  width: 90%;
  margin-top: 20px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  /* 스크롤바 숨기기 (선택사항, 깔끔한 UI를 위해) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const RecentSearchesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 300;
  color: #525252;
  background: #fff;
  position: sticky;
  top: 0;
  margin-bottom: 10px;
`;

export const ClearAllButton = styled.button`
  font-size: 12px;
  font-weight: 400;
  text-decoration: underline;
  color: #545f71;
  background: none;
  border: none;
  cursor: pointer;
`;

export const RecentSearchItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 3px;
  font-size: 14px;
  color: #171a1f;
  border-bottom: 1px solid #e0e0e0;

  span {
    cursor: pointer;
    flex: 1;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #545f71;
  }
`;

export const FlexSpacer = styled(motion.div)`
  width: 100%;
`;
