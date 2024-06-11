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

export const Header = styled.div<{ $isFocused: boolean }>`
  width: 100%;
  margin-top: 23px;
  margin-left: 35px;
  display: flex;
  justify-content: ${({ $isFocused }) =>
    $isFocused ? "space-between" : "flex-start"};
  align-items: center;
`;

export const Title = styled.h1<{ $isFocused: boolean }>`
  font-size: 23px;
  font-weight: 500;
  color: #171a1f;
  transform: ${({ $isFocused }) =>
    $isFocused ? "translateX(-50%)" : "translateX(0)"};
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

export const SearchIcon = styled.svg`
  margin-right: 3px;
`;

export const ClearIcon = styled.svg`
  margin-right: 10px;
  cursor: pointer;
`;

export const BackIcon = styled.svg`
  margin-right: 10px;
  cursor: pointer;
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

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmptyStateImage = styled.img`
  width: 86px;
  height: 110px;
  margin-bottom: 20px;
`;

export const EmptyStateText = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #171a1f;
  text-align: center;
`;

export const TabBarWrapper = styled.div<{ $isFocused: boolean }>`
  position: absolute;
  bottom: ${(props) => (props.$isFocused ? "150px" : "0px")};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: bottom 0.3s ease;
`;
