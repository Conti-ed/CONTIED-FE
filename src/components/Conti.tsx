import { useNavigate } from "react-router-dom";
import {
  Container,
  ContiImgAndKeywords,
  ContiImage,
  CenteredContainer,
  CenteredKeyword,
  Contikeyword,
  KeywordsContainer,
} from "../styles/Conti.styles";

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
      <ContiImgAndKeywords>
        <ContiImage src={contiData?.thumbnail} alt="재생목록 썸네일" />
        {contiData?.keywords[0] && (
          <CenteredContainer>
            <CenteredKeyword>{contiData.keywords[0]}</CenteredKeyword>
          </CenteredContainer>
        )}
      </ContiImgAndKeywords>
      <KeywordsContainer>
        {contiData?.keywords.map((keyword, i) => (
          <Contikeyword key={i}>#{keyword}</Contikeyword>
        ))}
      </KeywordsContainer>
    </Container>
  );
}

export default Conti;
