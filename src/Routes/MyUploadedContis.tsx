import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useQuery } from "react-query";
import ContiPlaceholder from "../components/ContiPlaceholder";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../utils/formatDuration";
import {
  Container,
  ContiItem,
  ContiImageWrapper,
  ContiImage,
  InfoText,
  ContiTitle,
  Subtitle,
  SongInfo,
  EmptyStateContainer,
  EmptyStateImage,
  EmptyStateText1,
  EmptyStateText2,
} from "./MyPage";
import { getUserNickname, getAllMyConties } from "../utils/axios";
import { getAccessToken } from "../utils/auth";
import { ContiType } from "../types";

const ContiList = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
`;

const MyUploadedContis: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(
    ["myContis"],
    async () => {
      const [conties, userNickname] = await Promise.all([
        getAllMyConties(),
        getUserNickname(),
      ]);

      return { filteredContis: conties, userNickname };
    },
    {
      staleTime: 1000 * 60, // 1분 동안 데이터 유지
      cacheTime: 1000 * 60 * 5,
      enabled: !!getAccessToken(), // 토큰이 있을 때만 실행
    }
  );

  const uploadedContis = data?.filteredContis || null;
  const nickname = data?.userNickname || null;

  const handleContiClick = useCallback(
    (id: number) => {
      navigate(`/conti/${id}`);
    },
    [navigate]
  );

  if (isLoading) {
    return (
      <Container>
        <EmptyStateContainer>
          <EmptyStateImage src="/images/WhitePiano.png" alt="Loading..." />
          <EmptyStateText1>로딩 중입니다...</EmptyStateText1>
          <EmptyStateText2>잠시만요...</EmptyStateText2>
        </EmptyStateContainer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <EmptyStateContainer>
          <EmptyStateImage src="/images/WhitePiano.png" alt="Error" />
          <EmptyStateText1>에러가 발생했어요!</EmptyStateText1>
          <EmptyStateText2>콘티를 불러오는 데 실패했어요.</EmptyStateText2>
        </EmptyStateContainer>
      </Container>
    );
  }

  return (
    <Container>
      {uploadedContis && uploadedContis.length > 0 ? (
        <ContiList>
          {uploadedContis.map((data: ContiType, index: number) => (
            <ContiItem
              key={data.id}
              onClick={() => handleContiClick(data.id)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ContiImageWrapper>
                <ContiPlaceholder size={100} />
                <ContiImage
                  src={data.thumbnail || "/images/WhitePiano.png"}
                  alt="Album Image"
                  style={{
                    height:
                      !data.thumbnail ||
                      data.thumbnail === "/images/WhitePiano.png"
                        ? "62px"
                        : "100px",
                  }}
                />
              </ContiImageWrapper>
              <InfoText>
                <ContiTitle>{data.title}</ContiTitle>
                <Subtitle>{nickname || "사용자"}</Subtitle>
                <SongInfo>{`${formatRelativeTime(
                  parseLocalDateString(data.updatedAt)
                )} • ${formatTotalDuration(
                  data.duration || 
                  (Array.isArray(data.ContiToSong) ? data.ContiToSong.reduce((acc: number, cts: any) => acc + (cts.song?.duration || 0), 0) : 0)
                )}`}</SongInfo>
              </InfoText>
            </ContiItem>
          ))}
        </ContiList>
      ) : (
        <EmptyStateContainer>
          <EmptyStateImage src="/images/WhitePiano.png" alt="Empty state" />
          <EmptyStateText1>앗!</EmptyStateText1>
          <EmptyStateText2>아직 업로드한 콘티가 없어요.</EmptyStateText2>
        </EmptyStateContainer>
      )}
    </Container>
  );
};

export default MyUploadedContis;
