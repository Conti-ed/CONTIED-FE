import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SongList from "../SongList";
import { AnimatePresence, motion } from "framer-motion";
import { getAllSongs } from "../../utils/axios";
import { SongType } from "../../types";
import { useQuery } from "react-query";

const Container = styled(motion.div)`
  position: absolute;
  top: 23%;
  width: 100%;
  height: 70%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const SongSection = styled.div`
  margin: 0 auto;
  width: 100%;
`;

const EmptyStateContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmptyStateImage = styled.img`
  margin-bottom: 8px;
`;

const EmptyStateText1 = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #171a1f;
  text-align: center;
  margin-bottom: 9px;
`;

const EmptyStateText2 = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #828282;
  text-align: center;
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
  const [songsData, setSongsData] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);

  const { data: response } = useQuery("allSongs", () => getAllSongs(), {
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (response) {
      setSongsData(response.songData || []);
    }
  }, [response]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const filteredSongs = Array.isArray(songsData)
      ? songsData
          .map((song): FilteredSongItem | null => {
            const titleIndex = song.title
              ? song.title.toLowerCase().indexOf(lowerCaseQuery)
              : -1;
            const artistIndex = song.artist
              ? song.artist.toLowerCase().indexOf(lowerCaseQuery)
              : -1;
            const lyricsIndex = song.lyrics
              ? song.lyrics.toLowerCase().indexOf(lowerCaseQuery)
              : -1;

            if (titleIndex === -1 && artistIndex === -1 && lyricsIndex === -1) {
              return null;
            }

            return {
              song,
              titleIndex,
              artistIndex,
              lyricsIndex,
            };
          })
          .filter((item): item is FilteredSongItem => item !== null)
          .sort((a, b) => {
            // 제목 비교
            if (a.titleIndex !== -1 && b.titleIndex === -1) return -1;
            if (a.titleIndex === -1 && b.titleIndex !== -1) return 1;
            if (a.titleIndex !== -1 && b.titleIndex !== -1) {
              return a.titleIndex - b.titleIndex;
            }

            // 아티스트 비교
            if (a.artistIndex !== -1 && b.artistIndex === -1) return -1;
            if (a.artistIndex === -1 && b.artistIndex !== -1) return 1;
            if (a.artistIndex !== -1 && b.artistIndex !== -1) {
              return a.artistIndex - b.artistIndex;
            }

            // 가사 비교
            if (a.lyricsIndex !== -1 && b.lyricsIndex === -1) return -1;
            if (a.lyricsIndex === -1 && b.lyricsIndex !== -1) return 1;
            if (a.lyricsIndex !== -1 && b.lyricsIndex !== -1) {
              return a.lyricsIndex - b.lyricsIndex;
            }

            return 0;
          })
          .map((item) => item.song)
      : [];

    setFilteredSongs(filteredSongs);
  }, [searchQuery, songsData]);

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
        <EmptyStateContainer>
          <EmptyStateImage src="images/WhitePiano.png" alt="Empty state" />
          <EmptyStateText1>앗!</EmptyStateText1>
          <EmptyStateText2>곡 검색 결과가 없어요.</EmptyStateText2>
        </EmptyStateContainer>
      )}
    </AnimatePresence>
  );
};

export default SongsTab;
