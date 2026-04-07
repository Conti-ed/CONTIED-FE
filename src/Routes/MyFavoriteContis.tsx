import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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

import { styled } from "styled-components";
import { useQuery } from "react-query";
import { getConti, getUserNickname, getLikedContis } from "../utils/axios";
import { ContiType } from "../types";

const ContiList = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
`;

const MyFavoriteContis: React.FC = () => {
  const navigate = useNavigate();

  const { data: nickname } = useQuery("userProfile", getUserNickname, {
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const { data: favoriteContis, isLoading, isError } = useQuery(
    ["likedContis"],
    async () => {
      const response = await getLikedContis();
      const validContis = response
        .filter((data: ContiType) => data && data.state !== "DELETED")
        .sort(
          (a: ContiType, b: ContiType) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      return validContis;
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );

  const handleContiClick = useCallback(
    (id: number) => {
      navigate(`/conti-detail/${id}`);
    },
    [navigate]
  );

  if (isLoading) {
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
          <EmptyStateText2>잠시만요...</EmptyStateText2>
        </EmptyStateContainer>
      </Container>
    );
  }

  if (isError) {
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
          <EmptyStateText2>콘티를 불러오는 데 실패했어요.</EmptyStateText2>
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
      {favoriteContis && favoriteContis.length > 0 ? (
        <ContiList>
          {favoriteContis.map((data: ContiType, index: number) => (
            <AnimatePresence key={data.id}>
              <ContiItem
                onClick={() => handleContiClick(data.id)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
              >
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
                  <ContiTitle>{data.title}</ContiTitle>
                  <Subtitle>{nickname || "사용자"}</Subtitle>
                  <SongInfo>{`${formatRelativeTime(
                    parseLocalDateString(data.updatedAt)
                  )} • ${formatTotalDuration(data.duration)}`}</SongInfo>
                </InfoText>
              </ContiItem>
            </AnimatePresence>
          ))}
        </ContiList>
      ) : (
        <AnimatePresence>
          <EmptyStateContainer
            key="empty-state"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyStateImage src="/images/WhitePiano.png" alt="Empty state" />
            <EmptyStateText1>앗!</EmptyStateText1>
            <EmptyStateText2>'좋아요' 한 콘티가 없어요.</EmptyStateText2>
          </EmptyStateContainer>
        </AnimatePresence>
      )}
    </Container>
  );
};

export default MyFavoriteContis;
