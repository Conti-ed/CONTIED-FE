import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
  EditButton,
  CancelEditButton,
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
  ToggleButton,
  ToggleDescriptionContainer,
  DescriptionText,
  EmptyStateContainer,
  EmptyStateImage,
  EmptyStateText1,
  EmptyStateText2,
  AddSongButton,
  DescriptionTextWrapper,
  EditActionsContainer,
  UnderlinedInput,
  UnderlinedTextarea,
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
import {
  getConti,
  getUserNickname,
  deleteContiById,
  patchConti,
  PatchContiDto,
} from "../utils/axios";
import { ContiType } from "../types";

const ContiDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromUpload = location.state?.fromUpload || false;
  const { contiId } = useParams<{ contiId: string }>();
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddSongLoading, setIsAddSongLoading] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정할 제목과 설명 상태
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // 에러 메시지 상태
  const [editError, setEditError] = useState<string | null>(null);

  const { data: contiData, isLoading: isContiLoading } = useQuery<ContiType>(
    ["cid", contiId],
    () => (contiId ? getConti(Number(contiId)) : Promise.resolve(null)),
    {
      retry: false,
      onSuccess: (data) => {
        setEditedTitle(data.title);
        setEditedDescription(data.description || "");
      },
      onError: (error) => {
        console.error("Failed to fetch conti data:", error);
      },
    }
  );

  const { data: nickname, isLoading: isNicknameLoading } = useQuery(
    "nickname",
    getUserNickname,
    { retry: false }
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

  const handleEditConti = () => {
    setIsEditMode(true);
  };

  const handleDeleteConti = async () => {
    if (contiId) {
      try {
        const response = await deleteContiById(Number(contiId));
        console.log(response);

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
    if (isFromUpload) {
      navigate("/home");
    } else {
      navigate(-1);
    }
  };

  const totalDuration = useMemo(() => {
    if (!contiData || !contiData.ContiToSong) return 0;
    return contiData.ContiToSong.reduce((sum, item) => {
      return sum + (item.song.duration || 0);
    }, 0);
  }, [contiData]);

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

  const handleSaveEdit = async () => {
    if (!contiId) return;

    if (!editedTitle.trim()) {
      setEditError("제목은 필수 항목입니다.");
      return;
    }

    setEditError(null);

    const dto: PatchContiDto = {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      songs: contiData?.ContiToSong.map((cts) => cts.songId) || [],
    };

    try {
      await patchConti(Number(contiId), dto);
      queryClient.invalidateQueries(["cid", contiId]);
      alert("콘티가 성공적으로 수정되었습니다.");
      setIsEditMode(false);
    } catch (error: any) {
      console.error("콘티 수정 실패:", error);
      setEditError(
        error.response?.data?.message || "콘티 수정에 실패했습니다."
      );
    }
  };

  const handleCancelEdit = () => {
    if (contiData) {
      setEditedTitle(contiData.title);
      setEditedDescription(contiData.description || "");
    }
    setEditError(null);
    setIsEditMode(false);
  };

  if (isContiLoading || isNicknameLoading) {
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
            <DetailOptions
              onEdit={handleEditConti}
              onDelete={handleDeleteConti}
            >
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
              </AlbumImageWrapper>
              <InfoText>
                <Title>
                  {isEditMode ? (
                    <UnderlinedInput
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      placeholder="제목을 입력해주세요!"
                      aria-label="콘티 제목"
                    />
                  ) : (
                    contiData.title
                  )}
                </Title>
                <Subtitle>{nickname || "사용자"}</Subtitle>
                <SongInfo>{`${
                  contiData.ContiToSong.length
                }곡 • ${formatTotalDuration(
                  totalDuration
                )} • ${formatRelativeTime(
                  parseLocalDateString(contiData.updatedAt)
                )}`}</SongInfo>
              </InfoText>
            </AlbumInfo>

            {isEditMode && (
              <EditActionsContainer>
                <EditButton onClick={handleSaveEdit} disabled={false}>
                  완료
                </EditButton>
                <CancelEditButton onClick={handleCancelEdit} disabled={false}>
                  취소
                </CancelEditButton>
              </EditActionsContainer>
            )}

            <ToggleDescriptionContainer>
              <DescriptionTextWrapper>
                {isEditMode ? (
                  <UnderlinedTextarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="콘티의 설명을 입력해주세요!"
                    aria-label="콘티 설명"
                  />
                ) : (
                  <DescriptionText>
                    {contiData.description.slice(0, 60)}
                  </DescriptionText>
                )}
              </DescriptionTextWrapper>
              {!isEditMode && (
                <ToggleButton onClick={handleDescriptionClick}>
                  더보기
                </ToggleButton>
              )}
            </ToggleDescriptionContainer>
            {editError && !isEditMode && (
              <span
                style={{
                  color: "#dc3545",
                  fontSize: "12px",
                  marginTop: "5px",
                  marginLeft: "20px",
                }}
              >
                {editError}
              </span>
            )}
          </AlbumDetailContainer>
          {contiData.ContiToSong.length === 0 ? (
            renderEmptyState()
          ) : (
            <SongList
              songs={contiData.ContiToSong.map((item) => ({
                ...item.song,
                id: Number(item.song.id),
              }))}
            />
          )}
        </Content>
        <SafariSpace $isFocused={false} />
        <DescriptionModal
          isOpen={isDescriptionOpen}
          onClose={handleCloseModal}
          thumbnail={contiData.thumbnail}
          title={contiData.title}
          userNickname={(("by " + nickname) as string) || "사용자"}
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
