import { useNavigate } from "react-router-dom";
import { Container, ContiImage, Contikeyword } from "../styles/Conti.styles";

interface IConti {
  contiData: {
    thumbnail: string;
    keywords: string[];
    id: number;
  } | null;
}

function Conti({ contiData }: IConti) {
  const navigate = useNavigate();

  const onclick = async () => {
    navigate(`/conti/${contiData?.id}`);
  };

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
