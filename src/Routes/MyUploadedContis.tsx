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

// 새로운 스타일 컴포넌트 추가
const ContiList = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface ContiData {
  id: string;
  title: string;
  thumbnail: string;
  ownerName: string;
  updated_at: string;
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
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      setUploadedContis(storedContiData);
    };

    loadUploadedContis();
  }, []);

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
                  src={data.thumbnail}
                  alt="Album Image"
                  style={{
                    height:
                      data.thumbnail === "/images/WhitePiano.png"
                        ? "62px"
                        : "100px",
                  }}
                />
              </ContiImageWrapper>
              <InfoText>
                <ContiTitle>{data.title}</ContiTitle>
                <Subtitle>{data.ownerName}</Subtitle>
                <SongInfo>{`${formatRelativeTime(
                  parseLocalDateString(data.updated_at)
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
