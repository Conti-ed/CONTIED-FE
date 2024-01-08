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

function Home() {
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
          {Array.from({ length: 20 }).map((_, index) => (
            <Conti key={index} contiData={null}></Conti>
          ))}
        </SectionBody>
      </SectionContainer>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>최신 CCM</SectionTitle>
          <SectionMore>더보기</SectionMore>
        </SectionHeader>
        <SectionBody>
          {Array.from({ length: 20 }).map((_, index) => (
            <Conti key={index} contiData={null}></Conti>
          ))}
        </SectionBody>
      </SectionContainer>
    </Container>
  );
}

export default Home;
