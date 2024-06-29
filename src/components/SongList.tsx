import React, { useState } from "react";
import styled from "styled-components";
import SongItem from "./SongItem";
import LyricsOnlySongItem from "./LyricsOnlySongItem";

const Container = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

interface Song {
  id: string; // 고유 ID 추가
  title: string;
  artist: string;
  thumbnail: string;
  lyrics: string;
}

interface SongListProps {
  songs: Song[];
  showLyricsOnly?: boolean;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  showLyricsOnly = false,
}) => {
  const [openSongId, setOpenSongId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenSongId((prevId) => (prevId === id ? null : id));
  };

  return (
    <Container>
      {songs.map((song) =>
        showLyricsOnly ? (
          <LyricsOnlySongItem key={song.id} song={song} />
        ) : (
          <SongItem
            key={song.id}
            song={song}
            isOpen={song.id === openSongId}
            onToggle={handleToggle}
          />
        )
      )}
    </Container>
  );
};

export default SongList;
