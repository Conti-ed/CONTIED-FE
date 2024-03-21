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
  HomeVariants,
} from "../styles/Home.styles";
import { SERVER_URL, getKeywords, getMyConties } from "../api";
import ContiPlaceholder from "../components/ContiPlaceholder";
import { ContiType, KeywordType } from "../types";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { isLoginAtom } from "../atoms";
import { useNavigate } from "react-router-dom";

function Home() {
  const [contiesByKey, setContiesByKey] = useState<ContiType[]>([]);
  const [randomKeyword, setRandomKeyword] = useState("");
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
  const navigate = useNavigate();

  const { data: myConti, isLoading: myContiIsLoading } = useQuery<ContiType[]>(
    ["myConti"],
    {
      queryFn: getMyConties,
    }
  );

  const { data: keywords, isLoading: keywordsLoading } = useQuery<
    KeywordType[]
  >(["keywords"], {
    queryFn: getKeywords,
    onSuccess: async (data) => {
      if (data.length === 0) return;
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomKeyword = data[randomIndex].name;
      const res = await fetch(
        `${SERVER_URL}/api/conti?keyword=${randomKeyword}`
      );
      const conties = await res.json();
      if (res.ok) {
        setContiesByKey(conties);
        setRandomKeyword(randomKeyword);
      }
    },
  });

  useEffect(() => {
    localStorage.getItem("user_info") &&
      JSON.parse(localStorage.getItem("user_info")!).id &&
      setIsLogin(true);
  }, [setIsLogin]);

  return (
    <Container
      variants={HomeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <KeywordContainer>
        {!keywordsLoading &&
          keywords?.slice(0, 10).map((k) => (
            <Keyword
              key={k.id}
              onClick={() => navigate(`/search?query=${k.name}`)}
            >
              {k.name}
            </Keyword>
          ))}
      </KeywordContainer>
      {isLogin && (
        <SectionContainer>
          <SectionHeader>
            <SectionTitle>My Conti</SectionTitle>
            <SectionMore onClick={() => navigate(`/myconti`)}>
              더보기
            </SectionMore>
          </SectionHeader>
          <SectionBody>
            {myContiIsLoading
              ? Array.from({ length: 20 }).map((_, index) => (
                  <ContiPlaceholder key={index} size={115} />
                ))
              : myConti &&
                myConti
                  .slice(0, 20)
                  .map((conti, index) => (
                    <Conti key={index} contiData={conti} />
                  ))}
          </SectionBody>
        </SectionContainer>
      )}
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>{randomKeyword}</SectionTitle>
          <SectionMore
            onClick={() => navigate(`/search?query=${randomKeyword}`)}
          >
            더보기
          </SectionMore>
        </SectionHeader>
        <SectionBody>
          {keywordsLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <ContiPlaceholder key={index} size={115} />
              ))
            : contiesByKey
                .slice(0, 20)
                .map((conti, index) => <Conti key={index} contiData={conti} />)}
        </SectionBody>
      </SectionContainer>
    </Container>
  );
}

export default Home;
