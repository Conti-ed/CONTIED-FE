import styled from 'styled-components';

export const Drawer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 400px; // 이 값을 조절하여 Drawer의 크기를 설정하세요
  background-color: white;
  border-top: 1px solid #ddd;
  padding: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const Button = styled.button`
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  margin: 8px 0;
  cursor: pointer;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
`;

export const ListItem = styled.li`
  margin: 8px 0;
`;
