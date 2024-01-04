import {
  Container,
  ContiImage,
  ContiTitle,
  Contikeyword,
} from '../styles/Conti.styles';

function Conti() {
  const onclick = async () => {};

  return (
    <Container onClick={onclick}>
      <ContiImage src="/images/placeholder.jpg" />
      <ContiTitle>타이틀</ContiTitle>
      <Contikeyword>키워드</Contikeyword>
    </Container>
  );
}

export default Conti;
