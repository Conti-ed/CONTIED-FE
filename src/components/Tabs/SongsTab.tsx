import React from "react";
import styled from "styled-components";
import SongList from "../SongList";
import { AnimatePresence, motion } from "framer-motion";
import { getAllSongs } from "../../utils/axios";
import { SongType } from "../../types";
import { useQuery } from "react-query";
import { SongSkeletonList } from "../Skeleton";
import EmptyState from "../EmptyState";

const Container = styled(motion.div)`
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 20px;
`;

const SongSection = styled.div`
  margin: 0 auto;
  width: 100%;
`;

interface SongsTabProps {
  searchQuery: string;
}

interface FilteredSongItem {
  song: SongType;
  titleIndex: number;
  artistIndex: number;
  lyricsIndex: number;
}

const SongsTab: React.FC<SongsTabProps> = ({ searchQuery }) => {
  const { data: response, isLoading: isSongsLoading } = useQuery("allSongs", () => getAllSongs(), {
    staleTime: 1000 * 60 * 5,
  });
  const songsData = Array.isArray(response) ? response : [];

  const filteredSongs = React.useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!Array.isArray(songsData)) return [];

    return songsData
      .map((song): FilteredSongItem | null => {
        const titleIndex = song.title ? song.title.toLowerCase().indexOf(lowerCaseQuery) : -1;
        const artistIndex = song.artist ? song.artist.toLowerCase().indexOf(lowerCaseQuery) : -1;
        const lyricsIndex = song.lyrics ? song.lyrics.toLowerCase().indexOf(lowerCaseQuery) : -1;
        if (titleIndex === -1 && artistIndex === -1 && lyricsIndex === -1) return null;
        return { song, titleIndex, artistIndex, lyricsIndex };
      })
      .filter((item): item is FilteredSongItem => item !== null)
      .sort((a, b) => {
        if (a.titleIndex !== -1 && b.titleIndex === -1) return -1;
        if (a.titleIndex === -1 && b.titleIndex !== -1) return 1;
        if (a.titleIndex !== -1 && b.titleIndex !== -1) return a.titleIndex - b.titleIndex;
        if (a.artistIndex !== -1 && b.artistIndex === -1) return -1;
        if (a.artistIndex === -1 && b.artistIndex !== -1) return 1;
        if (a.artistIndex !== -1 && b.artistIndex !== -1) return a.artistIndex - b.artistIndex;
        return 0;
      })
      .map((item) => item.song);
  }, [searchQuery, songsData]);

  if (isSongsLoading) {
    return (
      <Container>
        <SongSkeletonList count={8} />
      </Container>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {filteredSongs.length > 0 ? (
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SongSection>
            <SongList songs={filteredSongs} />
          </SongSection>
        </Container>
      ) : (
        <EmptyState message="곡 검색 결과가 없어요." />
      )}
    </AnimatePresence>
  );
};

export default SongsTab;
