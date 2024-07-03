import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SongList from "../SongList";
import { AnimatePresence, motion } from "framer-motion";

const Container = styled(motion.div)`
  position: absolute;
  top: 25%;
  width: 100%;
  height: 60%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 30px;
`;

const SongSection = styled.div`
  margin: 0 auto;
  width: 100%;
`;

const EmptyStateContainer = styled.div`
  margin-bottom: 74px;
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

const SongsTab: React.FC<SongsTabProps> = ({ searchQuery }) => {
  const [contiData, setContiData] = useState<any[]>([]);
  const [filteredTitles, setFilteredTitles] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);

  useEffect(() => {
    const storedContiData: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("conti_")) {
        const data = JSON.parse(localStorage.getItem(key)!);
        storedContiData.push(data);
      }
    }
    storedContiData.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
    setContiData(storedContiData);
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const songs: any[] = [];
    const filteredTitles = contiData.filter((data) => {
      const isTitleMatched = data.title.toLowerCase().includes(lowerCaseQuery);
      const matchedSongs = data.songs.filter(
        (song: { title: string; artist: string; lyrics: string }) =>
          (song.title && song.title.toLowerCase().includes(lowerCaseQuery)) ||
          (song.artist && song.artist.toLowerCase().includes(lowerCaseQuery)) ||
          (song.lyrics && song.lyrics.toLowerCase().includes(lowerCaseQuery))
      );
      if (matchedSongs.length > 0) {
        songs.push(...matchedSongs);
      }
      return isTitleMatched || matchedSongs.length > 0;
    });
    setFilteredSongs(songs);
    setFilteredTitles(filteredTitles);
  }, [searchQuery, contiData]);

  return (
    <AnimatePresence mode="wait">
      {filteredTitles.length > 0 && filteredSongs.length > 0 ? (
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredSongs.length > 0 && (
            <SongSection>
              <SongList songs={filteredSongs} />
            </SongSection>
          )}
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
