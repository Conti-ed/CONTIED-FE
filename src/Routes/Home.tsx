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
import { SERVER_URL, getKeywords, getMyConties } from "../api";
import ContiPlaceholder from "../components/ContiPlaceholder";
import { ContiType, KeywordType } from "../types";
import { useState } from "react";

function Home() {
  const [contiesByKey, setContiesByKey] = useState<ContiType[]>([]);
  const [randomKeyword, setRandomKeyword] = useState("");
  const { data: myConti, isLoading: myContiIsLoading } = useQuery<ContiType[]>(
    ["myConti"],
    { queryFn: getMyConties }
  );

  const { data: keywords, isLoading: keywordsLoading } = useQuery<
    KeywordType[]
  >(["keywords"], {
    queryFn: getKeywords,
    onSuccess: async (data) => {
      const randomIndex = Math.floor(Math.random() * data.length);
      const kid = data[randomIndex].id;
      console.log(kid);
      const res = await fetch(`${SERVER_URL}/api/conti?keyword=${kid}`);
      const conties = await res.json();
      console.log(res.status, conties);
      if (res.ok) {
        setContiesByKey(conties);
        setRandomKeyword(data[randomIndex].name);
      }
    },
  });

  return (
    <Container>
      <KeywordContainer>
        {keywords?.slice(0, 10).map((k) => (
          <Keyword key={k.id}>{k.name}</Keyword>
        ))}
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
          <SectionTitle>{randomKeyword}</SectionTitle>
          <SectionMore>더보기</SectionMore>
        </SectionHeader>
        <SectionBody>
          {contiesByKey.slice(0, 20).map((conti, index) => (
            <Conti key={index} contiData={conti} />
          ))}
        </SectionBody>
      </SectionContainer>
    </Container>
  );
}

export default Home;
