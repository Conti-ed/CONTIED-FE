import { Container } from '../styles/Feed.styles';
import Conti from '../components/Conti';

function Feed() {
  return (
    <Container>
      {Array.from({ length: 100 }).map((_, index) => (
        <Conti key={index} />
      ))}
    </Container>
  );
}

export default Feed;
