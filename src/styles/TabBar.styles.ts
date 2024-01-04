import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  background: ${(props) => props.theme.tabBgColor};
`;

export const Tab = styled.div<{ $isActive: boolean }>`
  font-size: 24px;
  color: ${(props) => (props.$isActive ? 'white' : 'gray')};
  cursor: pointer;
  margin: 0 35px;
`;
