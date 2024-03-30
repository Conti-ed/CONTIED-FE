import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { ContiType, SongType } from "../types";
import { getContiesByKeyword, getSongsByKeyword } from "../api";
import ContiPlaceholder from "../components/ContiPlaceholder";
import Conti from "../components/Conti";
import {
  Container,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionBody,
  HomeVariants,
} from "../styles/Home.styles";
import { SongList } from "./ContiDetail";
import { SongItem } from "../components/SongItem";
import { styled } from "styled-components";

const SectionSubTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const { data: conties, isLoading: contiesLoading } = useQuery<ContiType[]>(
    ["conties", query],
    {
      queryFn: () => getContiesByKeyword(query!),
    }
  );
  const { data: songs } = useQuery<SongType[]>(["songs", query], {
    queryFn: () => getSongsByKeyword(query!),
  });

  return (
    <Container
      variants={HomeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>검색어: {query}</SectionTitle>
        </SectionHeader>
        {query ? (
          <SectionSubTitle>" {query} 관련 콘티들 "</SectionSubTitle>
        ) : null}
        <SectionBody>
          {contiesLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <ContiPlaceholder key={index} size={115} />
              ))
            : conties!
                .slice(0, 20)
                .map((conti, index) => <Conti key={index} contiData={conti} />)}
        </SectionBody>
      </SectionContainer>
      {query ? <SectionSubTitle>" {query} 관련 곡들 "</SectionSubTitle> : null}
      <SongList>
        {songs &&
          songs.map((s, i) => (
            <div key={i}>
              <SongItem
                song={s}
                index={i}
                onOptionsClick={() => null}
              ></SongItem>
            </div>
          ))}
      </SongList>
    </Container>
  );
}

export default Search;
