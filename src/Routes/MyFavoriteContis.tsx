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
import { getConti, getUserNickname } from "../utils/axios";
import { ContiType } from "../types";

const ContiList = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
`;

const MyFavoriteContis: React.FC = () => {
  const [favoriteContis, setFavoriteContis] = useState<ContiType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavoriteContis = async () => {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favoriteContis") || "{}"
      );
      const favoriteContiIds = Object.keys(storedFavorites);

      try {
        const favoriteContiData: ContiType[] = await Promise.all(
          favoriteContiIds.map(async (contiId) => {
            try {
              const contiData = await getConti(Number(contiId));
              return contiData;
            } catch (error) {
              console.error(`Failed to fetch conti with ID ${contiId}:`, error);
              return null;
            }
          })
        );

        const validContis = favoriteContiData
          .filter(
            (data): data is ContiType =>
              data !== null && data.state !== "DELETED"
          )
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );

        setFavoriteContis(validContis);
      } catch (error) {
        console.error("Failed to load favorite contis:", error);
      }
    };

    loadFavoriteContis();
  }, []);

  const { data: nickname } = useQuery("nickname", getUserNickname, {
    retry: false,
  });

  const handleContiClick = useCallback(
    (id: number) => {
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
        <ContiList>
          {favoriteContis.map((data, index) => (
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
