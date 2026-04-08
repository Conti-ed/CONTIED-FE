import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
  DeleteButtonContainer,
  DeleteButton,
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
import Notification from "../components/Notification";
import ConfirmModal from "../components/Modals/ConfirmModal";
import { useQuery, useQueryClient } from "react-query";
import { getAccessToken } from "../utils/auth";
import {
  getConti,
  getUserProfile,
  deleteContiById,
  patchConti,
  PatchContiDto,
  getLikedContis,
  likeConti,
  unlikeConti,
} from "../utils/axios";
import { ContiType } from "../types";
import styled from "styled-components";

const OptionIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 20px; /* HeartIcon과 동일한 너비 */
  height: 20px; /* 정렬을 위한 높이 설정 */
`;

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

  // 선택된 곡들을 추적하는 상태
  const [selectedSongs, setSelectedSongs] = useState<Set<number>>(new Set());

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: contiData, isLoading: isContiLoading } = useQuery<ContiType>(
    ["cid", contiId],
    () => (contiId ? getConti(Number(contiId)) : Promise.resolve(null)),
    {
      staleTime: 1000 * 60 * 5, // 5 mins cache
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

  const { data: userProfile } = useQuery(
    "userProfile",
    getUserProfile,
    { 
      retry: false, 
      staleTime: 1000 * 60 * 30,
      enabled: !!getAccessToken()
    }
  );

  const isOwner = useMemo(() => {
    if (!userProfile || !contiData?.User) {
      return false;
    }

    // 1. ID 기반 검증 (최우선)
    if (userProfile.id && contiData.User.id) {
      const matchId = userProfile.id === contiData.User.id;
      if (matchId) return true;
    }

    // 2. 이메일 기반 검증 (차선)
    const myEmail = userProfile.email?.toLowerCase().trim();
    const creatorEmail = contiData.User.email?.toLowerCase().trim();
    
    const matchEmail = myEmail && creatorEmail && myEmail === creatorEmail;

    return !!matchEmail;
  }, [userProfile, contiData]);

  const { data: likedContis } = useQuery<ContiType[]>("likedContis", getLikedContis, {
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (contiId && likedContis) {
      setIsFavorite(likedContis.some((c) => c.id === Number(contiId)));
    }
  }, [contiId, likedContis]);

  const handleHeartClick = async () => {
    if (!contiId) return;

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite); // Optimistic UI update

    // 캐시도 즉시 업데이트 (Optimistic Cache Update)
    queryClient.setQueryData<ContiType[] | undefined>("likedContis", (old) => {
      if (!old || !contiData) return old;
      if (newIsFavorite) {
        return [...old, contiData];
      } else {
        return old.filter((c) => c.id !== Number(contiId));
      }
    });

    try {
      if (newIsFavorite) {
        await likeConti(Number(contiId));
      } else {
        await unlikeConti(Number(contiId));
      }
      // 백그라운드 검증용 refetch
      queryClient.invalidateQueries("likedContis");
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setIsFavorite(!newIsFavorite); // Rollback on failure
      // 캐시도 롤백
      queryClient.invalidateQueries("likedContis");
    }
  };

  const handleEditConti = () => {
    setIsEditMode(true);
  };

  const handleDeleteConti = async () => {
    if (contiId) {
      try {
        await deleteContiById(Number(contiId));

        const allContis = JSON.parse(localStorage.getItem("allContis") || "[]");
        const updatedContis = allContis.filter(
          (conti: any) => conti.id !== Number(contiId)
        );
        localStorage.setItem("allContis", JSON.stringify(updatedContis));
        localStorage.removeItem(`conti_${contiId}`);

        const favoriteContis = JSON.parse(
          localStorage.getItem("favoriteContis") || "{}"
        );
        delete favoriteContis[contiId];
        localStorage.setItem("favoriteContis", JSON.stringify(favoriteContis));

        queryClient.removeQueries(["cid", contiId]);
        queryClient.invalidateQueries(["myContis"]);
        queryClient.invalidateQueries("likedContis");

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
    navigate("/search", {
      state: { isFocused: true, query: "", contiId: contiId },
    });
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
      setEditError("제목은 필수입니다!");
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

      const updatedContiData = await getConti(Number(contiId));
      localStorage.setItem(
        `conti_${contiId}`,
        JSON.stringify(updatedContiData)
      );

      setNotification({
        message: "콘티가 업데이트되었어요!",
        type: "success",
      });
      setIsEditMode(false);
    } catch (error: any) {
      console.error("콘티 수정 실패:", error);
      setEditError(
        error.response?.data?.message || "콘티 수정에 실패했습니다."
      );
      setNotification({ message: "콘티 수정에 실패했어요...", type: "error" }); // 에러 알림 설정
    }
  };

  const handleCancelEdit = () => {
    if (contiData) {
      setEditedTitle(contiData.title);
      setEditedDescription(contiData.description || "");
    }
    setEditError(null);
    setIsEditMode(false);
    setSelectedSongs(new Set());
  };

  const handleSongSelect = (id: number, selected: boolean) => {
    setSelectedSongs((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelectedSongs = async () => {
    if (selectedSongs.size === 0) return;

    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelectedSongs = async () => {
    if (!contiData) {
      alert("콘티 데이터를 불러오는 중입니다.");
      return;
    }

    try {
      const updatedSongIds = contiData.ContiToSong.filter(
        (item) => !selectedSongs.has(item.song.id)
      ).map((item) => item.song.id);

      const dto: PatchContiDto = {
        title: contiData.title,
        description: contiData.description,
        songs: updatedSongIds,
      };
      await patchConti(Number(contiId), dto);

      const updatedContiData = await getConti(Number(contiId));
      localStorage.setItem(
        `conti_${contiId}`,
        JSON.stringify(updatedContiData)
      );

      queryClient.setQueryData(["cid", contiId], updatedContiData);

      setSelectedSongs(new Set());

      setNotification({
        message: "선택한 곡들이 삭제되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("삭제 과정에서 오류가 있나봐요...", error);
      setNotification({
        message: "곡 삭제에 실패했습니다. 다시 시도해 주세요.",
        type: "error",
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDeleteSelectedSongs = () => {
    setIsDeleteModalOpen(false);
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
        </Container>
      </AnimatePresence>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
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
              {isOwner && (
                <DetailOptions
                  onEdit={handleEditConti}
                  onDelete={handleDeleteConti}
                >
                  <OptionIconWrapper style={{ width: '24px', height: '24px' }}>
                    <Icon id="more-vertical" width="24" height="24" />
                  </OptionIconWrapper>
                </DetailOptions>
              )}
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
                  <Subtitle>{contiData.User?.nickname || "사용자"}</Subtitle>
                  <SongInfo>{`${contiData.ContiToSong.length}곡 ${
                    formatTotalDuration(totalDuration) === "0분"
                      ? ""
                      : "• " + formatTotalDuration(totalDuration)
                  } • ${formatRelativeTime(
                    parseLocalDateString(contiData.updatedAt)
                  )}`}</SongInfo>
                </InfoText>
              </AlbumInfo>

              {isEditMode && (
                <EditActionsContainer>
                  <EditButton onClick={handleSaveEdit}>완료</EditButton>
                  <CancelEditButton onClick={handleCancelEdit}>
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
                isEditMode={isEditMode}
                selectedSongs={selectedSongs}
                onSongSelect={handleSongSelect}
              />
            )}
            {isEditMode && selectedSongs.size > 0 && (
              <DeleteButtonContainer>
                <DeleteButton onClick={handleDeleteSelectedSongs}>
                  선택한 곡 삭제하기
                </DeleteButton>
              </DeleteButtonContainer>
            )}
          </Content>
          <DescriptionModal
            isOpen={isDescriptionOpen}
            onClose={handleCloseModal}
            thumbnail={contiData.thumbnail}
            title={contiData.title}
            userNickname={(("by " + (contiData.User?.nickname || "사용자")) as string) || "사용자"}
            description={contiData.description}
          />
          {isAddSongLoading && (
            <LoadingOverlay>
              <Loading />
            </LoadingOverlay>
          )}
        </Container>
      </AnimatePresence>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmModal
          title={`선택한 ${selectedSongs.size}곡을 삭제할까요?`}
          onConfirm={confirmDeleteSelectedSongs}
          onCancel={cancelDeleteSelectedSongs}
        />
      )}
    </>
  );
};

export default ContiDetail;
