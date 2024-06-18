import styled from "styled-components";
import SongItem from "./SongItem";
import LyricsOnlySongItem from "./LyricsOnlySongItem"; // 추가

const Container = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

interface Song {
  title: string;
  artist: string;
  thumbnail: string;
  lyrics: string;
}

interface SongListProps {
  songs: Song[];
  showLyricsOnly?: boolean;
}

const SongList = ({ songs, showLyricsOnly = false }: SongListProps) => (
  <Container>
    {songs.map((song, index) =>
      showLyricsOnly ? (
        <LyricsOnlySongItem key={index} song={song} />
      ) : (
        <SongItem key={index} song={song} />
      )
    )}
  </Container>
);

export default SongList;
