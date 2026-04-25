import React, { useRef } from "react";
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
import ContiDetailSkeleton from "../components/ContiDetailSkeleton";
import DetailOptions from "../components/DetailOptions";
import DescriptionModal from "../components/Modals/DescriptionModal";
import Notification from "../components/Notification";
import ConfirmModal from "../components/Modals/ConfirmModal";
import styled from "styled-components";
import useContiDetailLogic from "../hooks/useContiDetailLogic";
import RegenerateButton from "../components/RegenerateButton";
import ShareButton from "../components/ShareButton";
import ExportButton from "../components/ExportButton";
import ContiDescription from "../components/ContiDescription";

const OptionIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 20px; /* HeartIcon과 동일한 너비 */
  height: 20px; /* 정렬을 위한 높이 설정 */
`;

const RegenerateButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 0 23px 16px;
`;

const ContiDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromUpload = location.state?.fromUpload || false;
  const { contiId } = useParams<{ contiId: string }>();
  const exportRef = useRef<HTMLDivElement>(null);

  const {
    contiData,
    isContiLoading,
    isOwner,
    isFavorite,
    isAddSongLoading,
    isDescriptionOpen,
    isEditMode,
    editedTitle,
    setEditedTitle,
    editedDescription,
    setEditedDescription,
    editError,
    selectedSongs,
    notification,
    setNotification,
    isDeleteModalOpen,
    totalDuration,
    handleHeartClick,
    handleEditConti,
    handleDeleteConti,
    handleBackClick,
    handleAddSongClick,
    handleDescriptionClick,
    handleCloseModal,
    handleSaveEdit,
    handleCancelEdit,
    handleSongSelect,
    handleDeleteSelectedSongs,
    confirmDeleteSelectedSongs,
    cancelDeleteSelectedSongs,
  } = useContiDetailLogic({ contiId, navigate, isFromUpload });

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

  if (isContiLoading && !contiData) {
    return <ContiDetailSkeleton songCount={5} />;
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
                  <OptionIconWrapper style={{ width: "24px", height: "24px" }}>
                    <Icon id="more-vertical" width="24" height="24" />
                  </OptionIconWrapper>
                </DetailOptions>
              )}
            </IconContainer>
          </Header>
          <Content ref={exportRef}>
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
                    <ContiDescription
                      description={contiData.description}
                      previewMode
                    />
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
              {!isEditMode && contiId && (
                <RegenerateButtonWrapper data-export-hide="true">
                  <ExportButton
                    exportRef={exportRef}
                    fileName={`conti-${contiData.title}`}
                  />
                  <ShareButton contiId={contiData.id} title={contiData.title} />
                  <RegenerateButton contiId={contiId} isOwner={isOwner} />
                </RegenerateButtonWrapper>
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
            userNickname={
              (("by " + (contiData.User?.nickname || "사용자")) as string) ||
              "사용자"
            }
            description={contiData.description}
            songTitles={contiData.ContiToSong.map((item) => item.song.title)}
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
