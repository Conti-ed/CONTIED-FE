import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";
import ContiPlaceholder from "../components/ContiPlaceholder";
import SongList from "../components/SongList";
import {
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
  NewIcon,
  IconWrapper,
  ToggleButton,
  ToggleDescriptionContainer,
  DescriptionText,
  EmptyStateContainer,
  EmptyStateImage,
  EmptyStateText1,
  EmptyStateText2,
  AddSongButton,
  DescriptionTextWrapper,
} from "../styles/ContiDetail.styles";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../utils/formatDuration";
import AlbumPlaceholder from "../components/AlbumPlaceholder";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import DetailOptions from "../components/DetailOptions";
import DescriptionModal from "../components/Modals/DescriptionModal";
import { useQuery, useQueryClient } from "react-query";
import { getConti } from "../utils/axios";

const ContiDetail: React.FC = () => {
  const navigate = useNavigate();
  const { contiId } = useParams<{ contiId: string }>();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddSongLoading, setIsAddSongLoading] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const { data: contiData, isLoading: isContiLoading } = useQuery(
    ["cid", contiId],
    () => (contiId ? getConti(Number(contiId)) : Promise.resolve(null)), // contiId가 있으면 API 호출
    {
      retry: false,
      onSuccess: (data) => {
        console.log("Conti Data fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Failed to fetch conti data:", error);
      },
    }
  );

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

  const handleDeleteConti = () => {
    if (contiId) {
      try {
        const allContis = JSON.parse(localStorage.getItem("allContis") || "[]");
        const updatedContis = allContis.filter(
          (conti: any) => conti.id !== Number(contiId)
        );
        localStorage.setItem("allContis", JSON.stringify(updatedContis));
        localStorage.removeItem(`conti_${contiId}`);
        queryClient.removeQueries(["cid", contiId]);
        navigate(-1);
      } catch (error) {
        console.error("Failed to delete conti:", error);
        alert("콘티 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddSongClick = () => {
    setIsAddSongLoading(true);
    setTimeout(() => {
      setIsAddSongLoading(false);
      navigate("/search", { state: { isFocused: true, query: "" } });
    }, 1000);
  };

  const renderEmptyState = () => (
    <EmptyStateContainer>
      <EmptyStateImage src="/images/WhitePiano.png" alt="Empty state" />
      <EmptyStateText1>앗!</EmptyStateText1>
      <EmptyStateText2>콘티에 곡이 없어요.</EmptyStateText2>
      <AddSongButton onClick={handleAddSongClick}>
        콘티를 채우러 가볼까요?
      </AddSongButton>
    </EmptyStateContainer>
  );

  const handleDescriptionClick = () => {
    setIsDescriptionOpen(true);
  };

  const handleCloseModal = () => {
    setIsDescriptionOpen(false);
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
            <DetailOptions onDelete={handleDeleteConti}>
              <Icon id="option-detail" width="15" height="3" />
            </DetailOptions>
          </IconContainer>
        </Header>
        <Content>
          <AlbumDetailContainer>
            <AlbumInfo>
              <AlbumImageWrapper>
                {contiData.thumbnail ? (
                  <>
                    <ContiPlaceholder size={129} />
                    <AlbumImage
                      src={contiData.thumbnail}
                      alt="../images/WhitePiano.png"
                    />
                  </>
                ) : (
                  <AlbumPlaceholder />
                )}
                <IconWrapper>
                  <NewIcon id="edit-detail" />
                </IconWrapper>
              </AlbumImageWrapper>
              <InfoText>
                <Title>{contiData.title}</Title>
                <Subtitle>{contiData.userId}</Subtitle>
                <SongInfo>{`${
                  contiData.ContiToSong.length
                }곡 • ${formatTotalDuration(
                  contiData.duration
                )} • ${formatRelativeTime(
                  parseLocalDateString(contiData.updatedAt)
                )}`}</SongInfo>
              </InfoText>
            </AlbumInfo>
            <ToggleDescriptionContainer>
              <DescriptionTextWrapper>
                <DescriptionText>
                  {contiData.description.slice(0, 60)}
                </DescriptionText>
              </DescriptionTextWrapper>
              <ToggleButton onClick={handleDescriptionClick}>
                더보기
              </ToggleButton>
            </ToggleDescriptionContainer>
          </AlbumDetailContainer>
          {contiData.ContiToSong.length === 0 ? (
            renderEmptyState()
          ) : (
            <SongList songs={contiData.ContiToSong} />
          )}
        </Content>
        <SafariSpace $isFocused={false} />
        <DescriptionModal
          isOpen={isDescriptionOpen}
          onClose={handleCloseModal}
          thumbnail={contiData.thumbnail}
          title={contiData.title}
          userId={contiData.userId}
          description={contiData.description}
        />
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
