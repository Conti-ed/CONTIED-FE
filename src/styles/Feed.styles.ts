import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 15px;
  padding: 20px;
  justify-content: center;
  align-content: start;
  overflow: auto;
  margin-bottom: 30px;
`;
