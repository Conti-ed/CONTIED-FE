import { Container, ContiImage, Contikeyword } from "../styles/Conti.styles";

interface IConti {
  contiData: {
    thumbnail: string;
    keywords: string[];
    id: number;
  } | null;
}

function Conti({ contiData }: IConti) {
  const onclick = async () => {};

  return (
    <Container onClick={onclick}>
      <ContiImage src={contiData?.thumbnail} />
      {contiData?.keywords.map((keyword, i) => (
        <Contikeyword key={i}>{keyword}</Contikeyword>
      ))}
    </Container>
  );
}

export default Conti;
