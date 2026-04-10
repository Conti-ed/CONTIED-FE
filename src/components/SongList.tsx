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
  margin-bottom: 10px;
`;

interface SongListProps {
  songs: SongType[];
  showLyricsOnly?: boolean;
  width?: string;
  isEditMode?: boolean;
  selectedSongs?: Set<number>;
  onSongSelect?: (id: number, selected: boolean) => void;
  searchQuery?: string;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  showLyricsOnly = false,
  width,
  isEditMode = false,
  selectedSongs = new Set(),
  onSongSelect = () => {},
  searchQuery = "",
}) => {
  const [openSongId, setOpenSongId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setOpenSongId((prevId) => (prevId === id ? null : id));
  };

  const uniqueSongs = useMemo(() => {
    const uniqueSongsMap = new Map<string, SongType>();
    songs.forEach((song) => {
      const key = `${song.title.toLowerCase()}|${song.artist.toLowerCase()}`;
      if (!uniqueSongsMap.has(key)) {
        uniqueSongsMap.set(key, song);
      }
    });
    const unique = Array.from(uniqueSongsMap.values());
    return unique;
  }, [songs]);

  return (
    <Container $width={width}>
      {uniqueSongs.map((song, index) =>
        showLyricsOnly ? (
          <LyricsOnlySongItem
            key={song.id.toString()}
            song={{
              title: song.title,
              artist: song.artist,
              thumbnail: song.thumbnail || "",
              lyrics: song.lyrics || "가사가 아직 제공되지 않았어요.",
            }}
            searchQuery={searchQuery}
            isOpen={song.id === openSongId}
            onToggle={() => handleToggle(song.id)}
          />
        ) : (
          <SongItem
            key={song.id}
            song={{
              ...song,
              id: song.id,
              thumbnail: song.thumbnail || "",
              lyrics: song.lyrics || "",
            }}
            isOpen={song.id === openSongId}
            onToggle={handleToggle}
            isEditMode={isEditMode}
            isSelected={selectedSongs.has(song.id)}
            onSelect={onSongSelect}
          />
        )
      )}
    </Container>
  );
};

export default SongList;
