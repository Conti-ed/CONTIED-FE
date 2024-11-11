import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
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
import { useQuery } from "react-query";
import { getUserNickname, getAllMyConties } from "../utils/axios";
import { ContiType } from "../types";

const ContiList = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
`;

const MyUploadedContis: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: uploadedContis,
    isLoading,
    isError,
  } = useQuery<ContiType[], Error>("uploadedContis", getAllMyConties, {
    staleTime: 1000,
    retry: 1,
    select: (data: ContiType[]) =>
      data.filter((conti) => conti.state !== "DELETED"),
  });

  const {
    data: nickname,
    isLoading: isNicknameLoading,
    isError: isNicknameError,
  } = useQuery<string, Error>("nickname", getUserNickname, {
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const handleContiClick = useCallback(
    (id: number) => {
      navigate(`/conti-detail/${id}`);
    },
    [navigate]
  );

  if (isLoading || isNicknameLoading) {
    return (
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EmptyStateContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyStateImage src="/images/WhitePiano.png" alt="Loading..." />
          <EmptyStateText1>로딩 중입니다...</EmptyStateText1>
          <EmptyStateText2>잠시만 기다려주세요.</EmptyStateText2>
        </EmptyStateContainer>
      </Container>
    );
  }

  if (isError || isNicknameError) {
    return (
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EmptyStateContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyStateImage src="/images/WhitePiano.png" alt="Error" />
          <EmptyStateText1>에러가 발생했어요!</EmptyStateText1>
          <EmptyStateText2>콘티를 불러오는 데 실패했습니다.</EmptyStateText2>
        </EmptyStateContainer>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {uploadedContis && uploadedContis.length > 0 ? (
        <ContiList>
          {uploadedContis.map((data, index) => (
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
                )} • ${formatTotalDuration(data.duration)}`}</SongInfo>
              </InfoText>
            </ContiItem>
          ))}
        </ContiList>
      ) : (
        <EmptyStateContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyStateImage src="/images/WhitePiano.png" alt="Empty state" />
          <EmptyStateText1>앗!</EmptyStateText1>
          <EmptyStateText2>아직 업로드한 콘티가 없어요.</EmptyStateText2>
        </EmptyStateContainer>
      )}
    </Container>
  );
};

export default MyUploadedContis;
