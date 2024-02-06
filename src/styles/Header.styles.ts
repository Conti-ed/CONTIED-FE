import { styled } from "styled-components";

export const TopIconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 20px 0px 20px;
  width: 100%;
  height: 45px;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: ${(props) => props.theme.bgColor};
`;

export const Clock = styled.div`
  font-size: 18px;
  margin-left: 20px;
`;

export const Icon = styled.div`
  margin-right: 8px;
`;

export const RightIconGroup = styled.div`
  margin-right: 3px;
  display: flex;
  align-items: center;
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px 0px 20px;
  position: sticky;
  width: 100%;
  height: 70px;
  top: 44px;
  background-color: ${(props) => props.theme.bgColor};
`;

export const LogoContainer = styled.div``;
export const Logo = styled.img`
  height: 32px;
`;

export const HeaderRight = styled.div`
  display: flex;
  gap: 15px;
`;

export const HeaderRightIcons = styled.div`
  font-size: 20px;
  cursor: pointer;
`;

export const SearchInput = styled.input`
  border-radius: 10px;
  padding-left: 7px;
`;
