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
import {
  ArtistAndDuration,
  SongArtist,
  SongDetails,
  SongDuration,
  SongInfo,
  SongItem,
  SongList,
  SongNumber,
  SongTitle,
  IconContainer,
} from "./ContiDetail";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
  const { data: songs, isLoading: songsLoading } = useQuery<SongType[]>(
    ["songs", query],
    {
      queryFn: () => getSongsByKeyword(query!),
    }
  );

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${minutes}:${formattedSeconds}`;
    }
  };

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
            <SongItem key={i}>
              <SongNumber>{i + 1}.</SongNumber>
              <SongInfo>
                <SongTitle>{s.title}</SongTitle>
                <SongDetails>
                  <ArtistAndDuration>
                    <SongArtist>{s.artist}</SongArtist>
                    <span>•</span>
                    <SongDuration>
                      {s?.duration ? formatDuration(s.duration) : "0:00"}
                    </SongDuration>
                  </ArtistAndDuration>
                </SongDetails>
              </SongInfo>
              <IconContainer>
                <MoreVertIcon />
              </IconContainer>
            </SongItem>
          ))}
      </SongList>
    </Container>
  );
}

export default Search;
