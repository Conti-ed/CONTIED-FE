import React, { useEffect, useState, useCallback } from "react";
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
import { getUserNickname } from "../utils/axios";

const ContiList = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
`;

interface ContiData {
  id: string;
  title: string;
  thumbnail: string;
  userId: string;
  updatedAt: string;
  duration: number;
}

const MyUploadedContis: React.FC = () => {
  const [uploadedContis, setUploadedContis] = useState<ContiData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUploadedContis = () => {
      const storedContiData = Object.keys(localStorage)
        .filter((key) => key.startsWith("conti_"))
        .map((key) => JSON.parse(localStorage.getItem(key)!))
        .sort(
          (a: ContiData, b: ContiData) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      setUploadedContis(storedContiData);
    };

    loadUploadedContis();
  }, []);

  const { data: nickname } = useQuery("nickname", getUserNickname, {
    retry: false,
  });

  const handleContiClick = useCallback(
    (id: string) => {
      navigate(`/conti-detail/${id}`);
    },
    [navigate]
  );

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {uploadedContis.length > 0 ? (
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
