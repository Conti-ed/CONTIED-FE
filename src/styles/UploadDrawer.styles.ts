import styled from "styled-components";

interface DrawerProps {
  open: boolean;
}

export const setFontStyle = {
  fontFamily: "'Nunito Sans', 'Noto Sans KR', sans-serif",
};

export const StyledDrawer = styled.div<DrawerProps>`
  position: fixed;
  left: 0;
  width: 100%;
  height: 105vh;
  background-color: ${(props) => props.theme.bgColor};
  transform: ${(props) =>
    props.open ? "translateY(-6%)" : "translateY(100%)"};
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  border-radius: 30px;
`;

export const DrawerBackdrop = styled.div<DrawerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${(props) => (props.open ? "block" : "none")};
`;

export const Form = styled.form`
  ${setFontStyle}
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: ${(props) => props.theme.bgColor};
  padding: 20px;
  border-radius: 30px;
`;

export const WarningMessage = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

export const Input = styled.input`
  ${setFontStyle}
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const KeywordInput = styled(Input)<{ $isExceeding?: boolean }>`
  border: 1px solid ${({ $isExceeding }) => ($isExceeding ? "red" : "#ced4da")};
  &:focus {
    border: ${({ $isExceeding }) =>
      $isExceeding ? "1px solid red" : "1px solid #80bdff"};
  }
`;

export const List = styled.div`
  // margin-bottom: 10px;
`;

export const ListSubheader = styled.div`
  ${setFontStyle}
  color: white;
  margin-bottom: 8px;
`;

export const ListItem = styled.div`
  margin-bottom: 20px;
`;

export const Button = styled.button`
  ${setFontStyle}
  background-color: #ffffff;
  color: #2f69c4;
  border: none;
  font-weight: 700;
  font-size: 16px;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 520px;
`;

export const HashtagContainer = styled.div<{ $hashTags?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-top: ${({ $hashTags }) => ($hashTags ? "10px" : "0px")};
`;

export const Hashtag = styled.span`
  ${setFontStyle}
  background-color: #e1ecf4;
  color: #3178c6;
  padding: 4px 0px 4px 8px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0px;
  font-weight: 700;

  & > *:last-child {
    margin-left: 0;
  }
`;

export const DeleteButton = styled.button`
  padding: 0px 4px 0px 2px;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #d1d5db;
`;
