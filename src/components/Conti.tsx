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
    title: string;
    id: number;
  } | null;
}

function Conti({ contiData }: IConti) {
  const navigate = useNavigate();
  const onclick = async () => {
    navigate(`/conti/${contiData?.id}`);
  };

  const displayTitle =
    contiData && contiData.title.length > 6
      ? `${contiData.title.slice(0, 6)}...`
      : contiData?.title;

  return (
    <Container onClick={onclick}>
      <ContiImgAndKeywords>
        <ContiImage src={contiData?.thumbnail} alt="재생목록 썸네일" />
        {contiData && (
          <CenteredContainer>
            <CenteredKeyword>{displayTitle}</CenteredKeyword>
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
