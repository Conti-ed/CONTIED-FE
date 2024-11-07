import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ContiPlaceholder from "../ContiPlaceholder";
import { getUserNickname, getConties } from "../../utils/axios";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";

const Conties = styled(motion.div)`
  position: absolute;
  top: 25%;
  height: 60%;
  overflow-y: auto;
  padding-bottom: 60px;
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
interface ContiTabProps {
  searchQuery: string;
}

const ContiTab: React.FC<ContiTabProps> = ({ searchQuery }) => {
  const [contiData, setContiData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConties = async () => {
      try {
        const response = await getConties();
        const conties = Array.isArray(response)
          ? response
          : response.contiData || [];

        const sortedConties = conties.sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        setContiData(sortedConties);
      } catch (error) {
        console.error("Failed to fetch conties:", error);
      }
    };
    fetchConties();
  }, []);

  const filteredTitles = contiData.filter((data) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      data.title.toLowerCase().includes(lowerCaseQuery) ||
      (Array.isArray(data.songs) &&
        data.songs.some(
          (song: { title: string; artist: string; lyrics: string }) =>
            (song.title && song.title.toLowerCase().includes(lowerCaseQuery)) ||
            (song.artist &&
              song.artist.toLowerCase().includes(lowerCaseQuery)) ||
            (song.lyrics && song.lyrics.toLowerCase().includes(lowerCaseQuery))
        ))
    );
  });

  const { data: nickname } = useQuery("nickname", getUserNickname, {
    retry: false,
  });

  const handleContiClick = (id: string) => {
    navigate(`/conti-detail/${id}`);
  };

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
                  style={{
                    height:
                      data.thumbnail === null ||
                      data.thumbnail === "/images/WhitePiano.png"
                        ? "62px"
                        : "100px",
                  }}
                />
              </ContiImageWrapper>
              <InfoText>
                <Title>{data.title}</Title>
                <Subtitle>{nickname || "사용자"}</Subtitle>
                <SongInfo>{`${formatRelativeTime(
                  parseLocalDateString(data.updatedAt)
                )} • ${formatTotalDuration(data.duration)}`}</SongInfo>
              </InfoText>
            </ContiItem>
          ))}
        </Conties>
      ) : (
        <EmptyStateContainer>
          <EmptyStateImage src="images/WhitePiano.png" alt="Empty state" />
          <EmptyStateText1>앗!</EmptyStateText1>
          <EmptyStateText2>콘티 검색 결과가 없어요.</EmptyStateText2>
        </EmptyStateContainer>
      )}
    </AnimatePresence>
  );
};

export default ContiTab;
