import { useQuery } from "react-query";
import Conti from "../components/Conti";
import {
  Container,
  KeywordContainer,
  Keyword,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionMore,
  SectionBody,
} from "../styles/Home.styles";
import { getMyConties } from "../api";
import ContiPlaceholder from "../components/ContiPlaceholder";
import { ContiType } from "../types";

function Home() {
  const { data: myConti, isLoading: myContiIsLoading } = useQuery<ContiType[]>(
    ["myConti"],
    { queryFn: getMyConties }
  );

  return (
    <Container>
      <KeywordContainer>
        <Keyword>사랑</Keyword>
        <Keyword>시편</Keyword>
        <Keyword>구원</Keyword>
        <Keyword>희망</Keyword>
        <Keyword>고난</Keyword>
        <Keyword>성탄절</Keyword>
        <Keyword>기쁘다 구주 오셨네</Keyword>
        <Keyword>감사</Keyword>
        <Keyword>찬양</Keyword>
      </KeywordContainer>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>My Conti</SectionTitle>
          <SectionMore>더보기</SectionMore>
        </SectionHeader>
        <SectionBody>
          {myContiIsLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <ContiPlaceholder key={index} size={115} />
              ))
            : myConti!
                .slice(0, 20)
                .map((conti, index) => <Conti key={index} contiData={conti} />)}
        </SectionBody>
      </SectionContainer>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>최신 CCM</SectionTitle>
          <SectionMore>더보기</SectionMore>
        </SectionHeader>
        <SectionBody>
          {Array.from({ length: 20 }).map((_, index) => (
            <ContiPlaceholder key={index} size={115} />
          ))}
        </SectionBody>
      </SectionContainer>
    </Container>
  );
}

export default Home;
