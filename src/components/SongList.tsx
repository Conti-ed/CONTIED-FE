import styled from "styled-components";
import SongItem from "./SongItem";

const Container = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

interface Song {
  title: string;
  artist: string;
  image: string;
}

const SongList = ({ songs }: { songs: Song[] }) => (
  <Container>
    {songs.map((song, index) => (
      <SongItem key={index} song={song} />
    ))}
  </Container>
);

export default SongList;
