import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SafariSpace from "../components/SafariSpace";
import TabBar from "../components/TabBar";
import StatusBar from "../components/StatusBar";
import ContiPlaceholder from "../components/ContiPlaceholder";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../utils/formatDuration";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
`;

const Header = styled.div`
  width: 100%;
  margin-top: 23px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 23px;
  font-weight: 500;
  color: #171a1f;
  text-align: center;
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 165px;
`;

const Conties = styled(motion.div)`
  height: 93%;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContiItem = styled(motion.div)`
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

const ContiTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 7px;
  color: rgba(23, 26, 31, 0.8);
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

const EmptyStateContainer = styled(motion.div)`
  margin-bottom: 170px;
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

interface ContiData {
  id: string;
  title: string;
  thumbnail: string;
  ownerName: string;
  updated_at: string;
  duration: number;
}

const MyPage: React.FC = () => {
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
      <StatusBar />
      <Header>
        <Title>내가 좋아하는 콘티</Title>
      </Header>
      <Content>
        <AnimatePresence mode="wait">
          {favoriteContis.length > 0 ? (
            <Conties
              key="conties"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {favoriteContis.map((data, index) => (
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
            </Conties>
          ) : (
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
          )}
        </AnimatePresence>
      </Content>
      <TabBar />
      <SafariSpace $isFocused={false} />
    </Container>
  );
};

export default MyPage;
