import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ContiPlaceholder from "../ContiPlaceholder";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";
import SongList from "../SongList";
import { AnimatePresence, motion } from "framer-motion";

const Container = styled(motion.div)`
  position: absolute;
  top: 25%;
  height: 60%;
  overflow-y: auto;
  padding-bottom: 60px;
`;

const SongSection = styled.div`
  margin: 0px -20px 43px -20px;
`;

const ContiSection = styled.div``;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #171a1f;
  margin: 22px 0 20px 10px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 90vw;
  margin-bottom: 15px;
  border: 2px solid #9dbbe9;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  position: relative;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

const Image = styled.img`
  position: absolute;
  height: 100px;
  border-radius: 20px;
  width: auto;
  align-items: center;
  justify-content: center;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 7px;
  color: rgba(23, 26, 31, 0.8);
`;

const Subtitle = styled.div`
  font-size: 13px;
  margin-bottom: 7px;
  color: rgba(23, 26, 31, 0.5);
`;

const SongInfo = styled.div`
  font-size: 11px;
  color: rgba(23, 26, 31, 0.5);
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

interface AllTabProps {
  searchQuery: string;
}

const AllTab: React.FC<AllTabProps> = ({ searchQuery }) => {
  const [contiData, setContiData] = useState<any[]>([]);
  const [filteredTitles, setFilteredTitles] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const navigate = useNavigate();

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
    setFilteredSongs(songs.slice(0, 5));
    setFilteredTitles(filteredTitles);
  }, [searchQuery, contiData]);

  const handleContiClick = (id: string) => {
    navigate(`/conti-detail/${id}`);
  };

  return (
    <AnimatePresence mode="wait">
      {filteredTitles.length > 0 || filteredSongs.length > 0 ? (
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionTitle>곡</SectionTitle>
          {filteredSongs.length > 0 && (
            <SongSection>
              <SongList songs={filteredSongs} />
            </SongSection>
          )}
          <SectionTitle>콘티</SectionTitle>
          {filteredTitles.length > 0 && (
            <ContiSection>
              {filteredTitles.map((data, index) => (
                <Item key={index} onClick={() => handleContiClick(data.id)}>
                  <ImageWrapper>
                    <ContiPlaceholder size={100} />
                    <Image
                      src={data.thumbnail}
                      alt="Album Image"
                      style={{
                        height:
                          data.thumbnail === "/images/WhitePiano.png"
                            ? "62px"
                            : "100px",
                      }}
                    />
                  </ImageWrapper>
                  <InfoText>
                    <Title>{data.title}</Title>
                    <Subtitle>{data.ownerName}</Subtitle>
                    <SongInfo>{`${formatRelativeTime(
                      parseLocalDateString(data.updated_at)
                    )} • ${formatTotalDuration(data.duration)}`}</SongInfo>
                  </InfoText>
                </Item>
              ))}
            </ContiSection>
          )}
        </Container>
      ) : (
        <EmptyStateContainer>
          <EmptyStateImage src="images/WhitePiano.png" alt="Empty state" />
          <EmptyStateText1>앗!</EmptyStateText1>
          <EmptyStateText2>검색 결과가 없어요.</EmptyStateText2>
        </EmptyStateContainer>
      )}
    </AnimatePresence>
  );
};

export default AllTab;
