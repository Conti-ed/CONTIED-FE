import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ContiPlaceholder from "../ContiPlaceholder";
import { getUserProfile, getAllSongs, getConties } from "../../utils/axios";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";
import SongList from "../SongList";
import { AnimatePresence, motion } from "framer-motion";
import { ContiType, SongType } from "../../types";
import { useQuery } from "react-query";
import { SongSkeletonList, ContiSkeletonList } from "../Skeleton";
import EmptyState from "../EmptyState";

const Container = styled(motion.div)`
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  padding-bottom: 20px;
`;

const SongSection = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ContiSection = styled.div`
  width: calc(100% - 40px);
  margin: 0 auto;
`;

const SectionTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #171a1f;
  margin: 15px 0 10px 22px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 90vw;
  margin: 0 auto 15px auto;
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
  max-width: 210px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  const navigate = useNavigate();

  const { data: songsDataRaw, isLoading: isSongsLoading } = useQuery("allSongs", () => getAllSongs(), {
    staleTime: 1000 * 60 * 5,
  });
  const songsData = Array.isArray(songsDataRaw) ? songsDataRaw : [];

  const { data: contiesResponse, isLoading: isContiesLoading } = useQuery("allConties", () => getConties(), {
    staleTime: 1000 * 60 * 5,
  });

  const sortedContiData = React.useMemo(() => {
    if (!contiesResponse || !Array.isArray(contiesResponse)) return [];
    return [...contiesResponse].sort(
      (a: any, b: any) =>
        parseLocalDateString(b.updatedAt).getTime() -
        parseLocalDateString(a.updatedAt).getTime()
    );
  }, [contiesResponse]);

  const lowerCaseQuery = searchQuery.toLowerCase();

  const filteredSongs = React.useMemo(() => {
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
      .map((item) => item.song)
      .slice(0, 5);
  }, [lowerCaseQuery, songsData]);

  const filteredTitles = React.useMemo(() => {
    if (!Array.isArray(sortedContiData)) return [];
    return sortedContiData
      .map((data): FilteredTitleItem | null => {
        const titleIndex = data.title ? data.title.toLowerCase().indexOf(lowerCaseQuery) : -1;
        const descriptionIndex = data.description ? data.description.toLowerCase().indexOf(lowerCaseQuery) : -1;
        const matchedSongs = Array.isArray(data.ContiToSong)
          ? data.ContiToSong.filter((cts: any) => {
              const song = cts.song;
              if (!song) return false;
              const songTitleIndex = song.title ? song.title.toLowerCase().indexOf(lowerCaseQuery) : -1;
              const songArtistIndex = song.artist ? song.artist.toLowerCase().indexOf(lowerCaseQuery) : -1;
              const songLyricsIndex = song.lyrics ? song.lyrics.toLowerCase().indexOf(lowerCaseQuery) : -1;
              return songTitleIndex !== -1 || songArtistIndex !== -1 || songLyricsIndex !== -1;
            })
          : [];
        if (titleIndex === -1 && descriptionIndex === -1 && matchedSongs.length === 0) return null;
        return { data, titleIndex: titleIndex !== -1 ? titleIndex : descriptionIndex, matchedSongsLength: matchedSongs.length };
      })
      .filter((item): item is FilteredTitleItem => item !== null)
      .sort((a, b) => {
        if (a.titleIndex !== -1 && b.titleIndex === -1) return -1;
        if (a.titleIndex === -1 && b.titleIndex !== -1) return 1;
        if (a.titleIndex !== -1 && b.titleIndex !== -1 && a.titleIndex !== b.titleIndex) {
          return a.titleIndex - b.titleIndex;
        }
        
        // 검색 매칭 위치가 같거나 둘 다 없는 경우, 최신 수정순으로 정렬
        const dateA = parseLocalDateString(a.data.updatedAt).getTime();
        const dateB = parseLocalDateString(b.data.updatedAt).getTime();
        if (dateA !== dateB) return dateB - dateA;

        return b.matchedSongsLength - a.matchedSongsLength;
      })
      .map((item) => item.data)
      .slice(0, 10);
  }, [lowerCaseQuery, sortedContiData]);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/images/WhitePiano.png";
    e.currentTarget.style.height = "52px";
  };

  const handleContiClick = (id: number) => {
    navigate(`/conti/${id}`);
  };

  if (isSongsLoading || isContiesLoading) {
    return (
      <Container>
        <SectionTitle>곡</SectionTitle>
        <SongSkeletonList count={3} />
        <SectionTitle>콘티</SectionTitle>
        <ContiSkeletonList count={3} />
      </Container>
    );
  }

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
                      loading="lazy"
                      onError={handleImgError}
                      style={{
                        height:
                          data.thumbnail === null ||
                          data.thumbnail === "/images/WhitePiano.png"
                            ? "52px"
                            : "100px",
                      }}
                    />
                  </ImageWrapper>
                  <InfoText>
                    <Title>{data.title}</Title>
                    <Subtitle>{data.User?.nickname || "사용자"}</Subtitle>
                    <SongInfo>{`${formatRelativeTime(
                      parseLocalDateString(data.updatedAt)
                    )} • ${formatTotalDuration(
                      data.duration || 
                      (Array.isArray(data.ContiToSong) ? data.ContiToSong.reduce((acc: number, cts: any) => acc + (cts.song?.duration || 0), 0) : 0)
                    )}`}</SongInfo>
                  </InfoText>
                </Item>
              ))}
            </ContiSection>
          )}
        </Container>
      ) : (
        <EmptyState message="검색 결과가 없어요." />
      )}
    </AnimatePresence>
  );
};

export default AllTab;
