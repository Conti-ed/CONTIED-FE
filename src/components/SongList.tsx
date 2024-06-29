import React, { useState, useMemo } from "react";
import styled from "styled-components";
import SongItem from "./SongItem";
import LyricsOnlySongItem from "./LyricsOnlySongItem";

const Container = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

interface Song {
  id: string;
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

  // 중복 ID를 제거한 노래 목록을 생성
  const uniqueSongs = useMemo(() => {
    const uniqueSongsMap = new Map<string, Song>();
    songs.forEach((song) => {
      if (!uniqueSongsMap.has(song.id)) {
        uniqueSongsMap.set(song.id, song);
      }
    });
    return Array.from(uniqueSongsMap.values());
  }, [songs]);

  return (
    <Container>
      {uniqueSongs.map((song) =>
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
