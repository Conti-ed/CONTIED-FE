import styled from "styled-components";

const Container = styled.div<{ $size: number }>`
  width: ${(props) => `${props.$size}px`};
  height: ${(props) => `${props.$size}px`};
  border-radius: 10px;
  background-color: #83838363;
`;

interface IContiPlaceholder {
  size: number;
}

function ContiPlaceholder({ size }: IContiPlaceholder) {
  return <Container $size={size} />;
}

export default ContiPlaceholder;
