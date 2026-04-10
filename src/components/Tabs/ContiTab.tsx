import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ContiPlaceholder from "../ContiPlaceholder";
import { getUserProfile, getConties } from "../../utils/axios";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { ContiSkeletonList } from "../Skeleton";
import { ContiType } from "../../types";
import EmptyState from "../EmptyState";

const Conties = styled(motion.div)`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const ContiItem = styled.div`
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

const ContiImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

const ContiImage = styled.img`
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

interface ContiTabProps {
  searchQuery: string;
}

const ContiTab: React.FC<ContiTabProps> = ({ searchQuery }) => {
  const navigate = useNavigate();

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

  const filteredTitles = React.useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!Array.isArray(sortedContiData)) return [];

    return sortedContiData
      .map((data) => {
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
      .filter((item): item is { data: ContiType; titleIndex: number; matchedSongsLength: number } => item !== null)
      .sort((a, b) => {
        if (a.titleIndex !== -1 && b.titleIndex === -1) return -1;
        if (a.titleIndex === -1 && b.titleIndex !== -1) return 1;
        if (a.titleIndex !== -1 && b.titleIndex !== -1) return a.titleIndex - b.titleIndex;
        return b.matchedSongsLength - a.matchedSongsLength;
      })
      .map((item) => item.data);
  }, [searchQuery, sortedContiData]);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/images/WhitePiano.png";
    e.currentTarget.style.height = "52px";
  };

  const handleContiClick = (id: number) => {
    navigate(`/conti/${id}`);
  };

  if (isContiesLoading) {
    return (
      <Conties>
        <ContiSkeletonList count={5} />
      </Conties>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {filteredTitles.length > 0 ? (
        <Conties
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredTitles.map((data, index) => (
            <ContiItem key={index} onClick={() => handleContiClick(data.id)}>
              <ContiImageWrapper>
                <ContiPlaceholder size={100} />
                <ContiImage
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
              </ContiImageWrapper>
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
            </ContiItem>
          ))}
        </Conties>
      ) : (
        <EmptyState message="콘티 검색 결과가 없어요." />
      )}
    </AnimatePresence>
  );
};

export default ContiTab;
