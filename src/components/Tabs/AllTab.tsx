import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ContiPlaceholder from "../ContiPlaceholder";
import { getAllSongs, getConties } from "../../utils/axios";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";
import SongList from "../SongList";
import { AnimatePresence, motion } from "framer-motion";
import { ContiType, SongType } from "../../types";

const Container = styled(motion.div)`
  height: 60%;
  width: 100%;
  padding-bottom: 60px;
  position: absolute;
  top: 25%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const SongSection = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ContiSection = styled.div`
  width: calc(100% - 40px); // 좌우 20px씩 여백
  margin: 0 auto;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #171a1f;
  margin: 22px 0 20px 22px;
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
  overflow: hidden;
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

interface FilteredSongItem {
  song: SongType;
  titleIndex: number;
  artistIndex: number;
  lyricsIndex: number;
}

interface FilteredTitleItem {
  data: ContiType;
  titleIndex: number;
  matchedSongsLength: number;
}

const AllTab: React.FC<AllTabProps> = ({ searchQuery }) => {
  const [contiData, setContiData] = useState<any[]>([]);
  const [songsData, setSongsData] = useState<any[]>([]);
  const [filteredTitles, setFilteredTitles] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContiAndSongData = async () => {
      try {
        const songsResponse = await getAllSongs(0, 50);
        const contiesResponse = await getConties();
        const songs = songsResponse.songData || [];
        const conties = Array.isArray(contiesResponse)
          ? contiesResponse
          : contiesResponse.contiData || [];

        const sortedConties = conties.sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        setContiData(sortedConties);
        setSongsData(songs);
      } catch (error) {
        console.error("Failed to fetch song and conti data:", error);
      }
    };
    fetchContiAndSongData();
  }, []);

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

    setFilteredSongs(filteredSongs.slice(0, 5));

    // contiData에 대한 동일한 로직 적용
    const filteredTitles = Array.isArray(contiData)
      ? contiData
          .map((data): FilteredTitleItem | null => {
            const titleIndex = data.title
              ? data.title.toLowerCase().indexOf(lowerCaseQuery)
              : -1;

            const matchedSongs = Array.isArray(data.songs)
              ? data.songs.filter((song: SongType) => {
                  const songTitleIndex = song.title
                    ? song.title.toLowerCase().indexOf(lowerCaseQuery)
                    : -1;
                  const songArtistIndex = song.artist
                    ? song.artist.toLowerCase().indexOf(lowerCaseQuery)
                    : -1;
                  const songLyricsIndex = song.lyrics
                    ? song.lyrics.toLowerCase().indexOf(lowerCaseQuery)
                    : -1;

                  return (
                    songTitleIndex !== -1 ||
                    songArtistIndex !== -1 ||
                    songLyricsIndex !== -1
                  );
                })
              : [];

            if (titleIndex === -1 && matchedSongs.length === 0) {
              return null;
            }

            return {
              data,
              titleIndex,
              matchedSongsLength: matchedSongs.length,
            };
          })
          .filter((item): item is FilteredTitleItem => item !== null)
          .sort((a, b) => {
            // 제목 비교
            if (a.titleIndex !== -1 && b.titleIndex === -1) return -1;
            if (a.titleIndex === -1 && b.titleIndex !== -1) return 1;
            if (a.titleIndex !== -1 && b.titleIndex !== -1) {
              return a.titleIndex - b.titleIndex;
            }

            // 매칭된 노래 수로 비교
            return b.matchedSongsLength - a.matchedSongsLength;
          })
          .map((item) => item.data)
      : [];

    setFilteredTitles(filteredTitles);
  }, [searchQuery, contiData, songsData]);

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
              <SongList songs={filteredSongs} width="100%" />
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
                      src={data.thumbnail || "/images/WhitePiano.png"}
                      alt="Album Image"
                      style={{
                        height:
                          data.thumbnail === null ||
                          data.thumbnail === "/images/WhitePiano.png"
                            ? "62px"
                            : "100px",
                      }}
                    />
                  </ImageWrapper>
                  <InfoText>
                    <Title>{data.title}</Title>
                    <Subtitle>{data.userId}</Subtitle>
                    <SongInfo>{`${formatRelativeTime(
                      parseLocalDateString(data.updatedAt)
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
