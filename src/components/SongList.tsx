import React, { useState, useMemo } from "react";
import styled from "styled-components";
import SongItem from "./SongItem";
import LyricsOnlySongItem from "./LyricsOnlySongItem";
import { SongType } from "../types";

const Container = styled.ul<{ $width?: string }>`
  list-style: none;
  padding: 0;
  width: ${(props) => props.$width || "100%"};
  margin: 0 auto;
`;

interface SongListProps {
  songs: SongType[];
  showLyricsOnly?: boolean;
  width?: string;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  showLyricsOnly = false,
  width,
}) => {
  const [openSongId, setOpenSongId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenSongId((prevId) => (prevId === id ? null : id));
  };

  // 중복 ID를 제거한 노래 목록을 생성
  const uniqueSongs = useMemo(() => {
    const uniqueSongsMap = new Map<string, SongType>();
    songs.forEach((song) => {
      if (!uniqueSongsMap.has(song.id.toString())) {
        uniqueSongsMap.set(song.id.toString(), song);
      }
    });
    return Array.from(uniqueSongsMap.values());
  }, [songs]);

  return (
    <Container $width={width}>
      {uniqueSongs.map((song) =>
        showLyricsOnly ? (
          <LyricsOnlySongItem
            key={song.id.toString()}
            song={{
              title: song.title,
              artist: song.artist,
              thumbnail: song.thumbnail || "",
              lyrics: song.lyrics || "가사가 아직 제공되지 않았어요.",
            }}
          />
        ) : (
          <SongItem
            key={song.id}
            song={{
              ...song,
              id: song.id.toString(),
              thumbnail: song.thumbnail || "",
              lyrics: song.lyrics || "",
            }}
            isOpen={song.id.toString() === openSongId}
            onToggle={handleToggle}
          />
        )
      )}
    </Container>
  );
};

export default SongList;
