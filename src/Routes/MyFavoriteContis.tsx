import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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

interface ContiData {
  id: string;
  title: string;
  thumbnail: string;
  ownerName: string;
  updated_at: string;
  duration: number;
}

const MyFavoriteContis: React.FC = () => {
  const [favoriteContis, setFavoriteContis] = useState<ContiData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavoriteContis = () => {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favoriteContis") || "{}"
      );
      const favoriteContiData: ContiData[] = Object.keys(storedFavorites)
        .map((contiId) => {
          const contiData = JSON.parse(
            localStorage.getItem(`conti_${contiId}`) || "{}"
          );
          return contiData.id ? contiData : null;
        })
        .filter((data): data is ContiData => data !== null)
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

      setFavoriteContis(favoriteContiData);
    };

    loadFavoriteContis();
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
      {favoriteContis.length > 0 ? (
        favoriteContis.map((data, index) => (
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
          </AnimatePresence>
        ))
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
