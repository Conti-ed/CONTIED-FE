import { styled } from "styled-components";
import Conti from "../components/Conti";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
`;

function Feed() {
  return (
    <Container>
      {Array.from({ length: 100 }).map((_, index) => (
        <Conti key={index}></Conti>
      ))}
    </Container>
  );
}

export default Feed;
