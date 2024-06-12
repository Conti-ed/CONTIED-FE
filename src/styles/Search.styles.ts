import { motion } from "framer-motion";
import styled from "styled-components";

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
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
  cursor: pointer;
`;

export const Title = styled.h1<{ $isFocused: boolean }>`
  font-size: ${(props) => (props.$isFocused ? "18px" : "23px")};
  font-weight: 500;
  color: #171a1f;
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
  margin-right: 10px;
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
`;

export const SearchBar = styled.div`
  margin-top: 6px;
  width: 100%;
  border-bottom: 2px solid #171a1f;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SearchPageText = styled.h2`
  font-size: 30px;
  font-weight: 500;
  text-align: center;
  color: #171a1f;
  margin-bottom: 40px;
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

export const RecentSearchContainer = styled.div`
  position: absolute;
  top: 18%; /* 위치를 조금 더 아래로 조정합니다 */
  width: 90%;
  max-height: 30%; /* 최대 높이를 설정하여 스크롤 가능하게 합니다 */
  overflow-y: auto; /* 스크롤 가능하게 설정 */
`;

export const RecentSearchesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 300;
  color: #525252;
  background: #fff;
  position: sticky; /* 컨테이너 내에서 고정 */
  top: 0;
  z-index: 10;
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

export const RecentSearchItem = styled.div`
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
