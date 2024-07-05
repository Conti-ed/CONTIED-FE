import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";
import ContiPlaceholder from "../components/ContiPlaceholder";
import SongList from "../components/SongList";
import {
  AddIcon,
  AddSongContainer,
  AlbumDetailContainer,
  AlbumImage,
  AlbumImageWrapper,
  AlbumInfo,
  BackButton,
  Container,
  Content,
  Header,
  HeartIcon,
  IconContainer,
  InfoText,
  LoadingOverlay,
  SongInfo,
  Subtitle,
  Title,
  DEContiData,
  DEContiDataText,
  DEImage,
} from "../styles/ContiDetail.styles";
import { useQuery } from "react-query";
import { getConti } from "../api";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../utils/formatDuration";
import AlbumPlaceholder from "../components/AlbumPlaceholder";
import Icon from "../components/Icon";
import Loading from "../components/Loading";

const ContiDetail: React.FC = () => {
  const navigate = useNavigate();
  const { contiId } = useParams<{ contiId: string }>();
  const { data: contiData, isLoading: isContiLoading } = useQuery(
    ["cid", contiId],
    () => (contiId ? getConti(Number(contiId)) : Promise.resolve(null))
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddSongLoading, setIsAddSongLoading] = useState(false);

  useEffect(() => {
    if (contiId) {
      const favoriteContis = JSON.parse(
        localStorage.getItem("favoriteContis") || "{}"
      );
      setIsFavorite(!!favoriteContis[contiId]);
    }
  }, [contiId]);

  const handleHeartClick = () => {
    if (!contiId) return;

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    const favoriteContis = JSON.parse(
      localStorage.getItem("favoriteContis") || "{}"
    );
    if (newIsFavorite) {
      favoriteContis[contiId] = true;
    } else {
      delete favoriteContis[contiId];
    }
    localStorage.setItem("favoriteContis", JSON.stringify(favoriteContis));
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddSongClick = () => {
    setIsAddSongLoading(true);
    setTimeout(() => {
      setIsAddSongLoading(false);
      navigate("/searchadd", { state: { isFocused: true, query: "" } });
    }, 1000);
  };

  if (isContiLoading) {
    return <Loading />;
  }

  if (!contiId || !contiData) {
    return (
      <AnimatePresence mode="wait">
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatusBar />
          <Header>
            <BackButton onClick={handleBackClick}>
              <Icon id="back-detail" width="24" height="24" />
            </BackButton>
          </Header>
          <DEContiData>
            <DEImage src="../images/WhitePiano.png" alt="Album Image" />
            <DEContiDataText>
              콘티가 잘못 생성되었거나, 삭제된 것 같아요...
            </DEContiDataText>
          </DEContiData>
          <SafariSpace $isFocused={false} />
        </Container>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatusBar />
        <Header>
          <BackButton onClick={handleBackClick}>
            <Icon id="back-detail" width="24" height="24" />
          </BackButton>
          <IconContainer>
            <HeartIcon
              $isFavorite={isFavorite}
              onClick={handleHeartClick}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F8EEC"
            >
              <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path>
            </HeartIcon>
            <Icon id="option-detail" width="15" height="3" />
          </IconContainer>
        </Header>
        <Content>
          <AlbumDetailContainer>
            <AlbumInfo>
              <AlbumImageWrapper>
                {contiData.thumbnail ? (
                  <>
                    <ContiPlaceholder size={129} />
                    <AlbumImage src={contiData.thumbnail} alt="Album Image" />
                  </>
                ) : (
                  <AlbumPlaceholder />
                )}
              </AlbumImageWrapper>
              <InfoText>
                <Title>{contiData.title}</Title>
                <Subtitle>{contiData.owner.name}</Subtitle>
                <SongInfo>{`${contiData.songs.length}곡 • ${formatTotalDuration(
                  contiData.duration
                )} • ${formatRelativeTime(
                  parseLocalDateString(contiData.updated_at)
                )}`}</SongInfo>
              </InfoText>
            </AlbumInfo>
            <SongList songs={contiData.songs} />
            <AddSongContainer onClick={handleAddSongClick}>
              <AddIcon width="10" height="10">
                <Icon id="add-song-detail" width="10" height="10" />
              </AddIcon>
              곡 추가
            </AddSongContainer>
          </AlbumDetailContainer>
        </Content>
        <SafariSpace $isFocused={false} />
        {isAddSongLoading && (
          <LoadingOverlay>
            <Loading />
          </LoadingOverlay>
        )}
      </Container>
    </AnimatePresence>
  );
};

export default ContiDetail;
