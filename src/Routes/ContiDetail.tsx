import { useQuery, useQueryClient } from "react-query";
import { SERVER_URL, getConti } from "../api";
import { ContiType } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { MdKeyboardArrowLeft } from "react-icons/md";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { setFontStyle } from "../styles/UploadDrawer.styles";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import useContiDetailState from "../hooks/useContiDetailState";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { LoadingSpinner } from "../styles/LoadingSpinner";
import {
  formatTotalDuration,
  parseLocalDateString,
} from "../utils/formatDuration";
import ConfirmModal from "../components/ConfirmModal";
import SongItem from "../components/SongItem";

const PageContainer = styled(motion.div)`
  padding-top: 35px;
  padding: 10px;
  padding-bottom: 100px;
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TitleHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

export const EditIconContainer = styled.div`
  position: absolute;
  right: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BackButtonContainer = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  gap: 5px;
  border-radius: 10px;
  border: none;
`;

const BackButton = styled.span`
  text-decoration: "underline";
  font-weight: "bold";
  font-size: "18px";
  color: "#8ab1e8";
`;

const OwnerInfoPanel = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const OwnerName = styled.div`
  font-weight: bold;
  margin-bottom: 4px;
`;

const CreatedAt = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  line-height: 1;
`;

const InfoContainer = styled.div`
  text-align: right;
  margin-top: 5px;
  margin-right: 10px;
`;

const TitleEditInput = styled.input`
  ${setFontStyle}
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  width: 100%;
  box-sizing: border-box;
  color: black;
  font-weight: bold;
  font-size: 14px;
`;

const TitleEditButton = styled.button`
  margin-top: 20px;
  padding: 8px 12px;
  background-color: #388ee9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const KeywordEditorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 13px;
`;

const KeywordDisplay = styled.span`
  font-size: 16px;
  color: black;
  font-weight: bold;
`;

const KeyEditButton = styled.button`
  ${setFontStyle}
  background-color: #10769b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: 10px;
`;

const KeyEditInput = styled.input`
  ${setFontStyle}
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px 12px;
  width: 90%;
  box-sizing: border-box;
  color: black;
  font-weight: bold;
  font-size: 14px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #6c757d;
`;

export const SongList = styled.div`
  text-align: left;
  font-size: 15px;
  margin-left: 10px;
`;

export const OverlayModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const EditModalContainer = styled(motion.div)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  max-width: 500px;
  text-align: center;
`;

const ModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TitleEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ModalTitle = styled.p`
  color: black;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 20px;
`;

export const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #388ee9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:nth-child(2) {
    background-color: #b6434f;
  }
`;

export const ArtistAndDuration = styled(DetailItem)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const TotalDurationContainer = styled(DetailItem)`
  justify-content: center;
  margin-top: 25px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #c1c8ce;
`;

const OptionsMenu = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  white-space: nowrap;
`;

const OptionItem = styled.div`
  padding: 5px 10px;
  &:hover {
    border: 1px solid #ccc;
  }
`;

const OptionPlay = styled(Link)`
  padding: 5px 10px;
  &:hover {
    border: 1px solid #ccc;
  }
`;

export const IconContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  align-items: center;
  justify-content: center;
`;

const KeywordItem = styled.div`
  font-weight: bold;
  color: #c1c8ce;
  padding: 5px;
  border-radius: 5px;
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;

const SheetButton = styled.button`
  ${setFontStyle}
  font-weight: bold;
  border-radius: 10px;
  background-color: transparent;
  padding: 5px;
  color: #c1c8ce;
  margin: 0 auto;
`;

const detailVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const optionsVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

function ContiDetail() {
  const optionsMenuRef = useRef<HTMLDivElement | null>(null);
  const ownerMenuRef = useRef<HTMLDivElement | null>(null);
  const { id: cid } = useParams();
  const uid = JSON.parse(localStorage["user_info"]).id;
  const { state, updateState, onDragEnd, songOptionsClick, deleteSong } =
    useContiDetailState(Number(cid), uid);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.refetchQueries(["conties", "conti", cid]);
  }, [cid, queryClient]);

  // When the Conti was First Uploaded
  const { isLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti", cid],
    queryFn: () => getConti(Number(cid)),
    onSuccess: (data) => {
      updateState({
        contiData: data,
        songs: data ? data.songs.sort((a, b) => a.order - b.order) : [],
        isOwner: data
          ? data.owner.id === JSON.parse(localStorage["user_info"]).id
          : false,
        editTitleValue: data?.title,
      });
    },
    refetchOnWindowFocus: true,
  });

  // When the More Button is Pressed
  const handleOptionsClick = (
    event: React.MouseEvent<HTMLElement>,
    isOwnerMenu: boolean,
    optionsGetter: (event: React.MouseEvent<HTMLElement>) => {
      x: number;
      y: number;
    }
  ) => {
    event.stopPropagation();
    const { x, y } = optionsGetter(event);

    if (isOwnerMenu) {
      updateState({
        ownerPosition: { x, y },
        showOwnerMenu: !state.showOwnerMenu,
      });
    } else {
      const activeOptionId = parseInt(event.currentTarget.id, 10);
      updateState({
        optionsPosition: { x, y },
        activeOptions: isNaN(activeOptionId) ? null : activeOptionId,
      });
    }
  };

  const ownerOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    handleOptionsClick(event, true, (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      return { x: rect.left - 100, y: rect.top + 10 };
    });
  };

  type ModalNames =
    | "showTitleModal"
    | "showKeywordModal"
    | "showDeleteConfirmModal"
    | "showOwnerMenu";

  const toggleModal = (modalName: ModalNames, isVisible: boolean) => {
    updateState({ [modalName]: isVisible });
  };

  const openTitleModal = () => {
    toggleModal("showTitleModal", true);
    updateState({
      editTitleValue: state.contiData?.title || "",
    });
  };

  const closeTitleModal = async () => {
    toggleModal("showTitleModal", false);

    const formData = new FormData();
    formData.append("title", state.editTitleValue);
    const token = localStorage["accessToken"];

    try {
      const response = await fetch(`${SERVER_URL}/api/conti/${cid}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedConti: ContiType | null = await response.json();
        if (updatedConti !== null) {
          updateState({
            contiData: {
              ...(state.contiData ?? {}),
              title: updatedConti.title,
            } as ContiType,
          });
          // console.log("Updated title", updatedConti);
        } else {
          console.error(
            "Failed to update title: updatedConti is null or state.contiData is undefined"
          );
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to update title", errorData);
      }
    } catch (error) {
      console.error("Error updating title", error);
    }
  };

  // Open Keyword Modal
  const openKeywordModal = () => {
    toggleModal("showKeywordModal", true);
    updateState({
      editKeywordIndex: null,
    });
  };

  // Close Keyword Modal
  const closeKeywordModal = async () => {
    toggleModal("showKeywordModal", false);
    updateState({
      editKeywordIndex: null,
    });

    const formData = new FormData();
    formData.append("keywords", JSON.stringify(state.contiData?.keywords));
    const token = localStorage["accessToken"];

    try {
      const response = await fetch(`${SERVER_URL}/api/conti/${cid}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        // console.log("Keywords updated successfully", data);
      } else {
        console.error("Failed to update keywords", data);
      }
    } catch (error) {
      console.error("Error updating keywords", error);
    }
  };

  // When Clicking Outside the Options Modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        state.showOwnerMenu &&
        ownerMenuRef.current &&
        !ownerMenuRef.current.contains(event.target as Node)
      ) {
        updateState({ showOwnerMenu: false });
      }
      if (
        state.activeOptions !== null &&
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        updateState({ activeOptions: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.showOwnerMenu, state.activeOptions, updateState]);

  // Setting Keyword Default Values ​​in Edit Modal
  const startKeywordEditing = (index: number, keyword: string) => {
    updateState({
      editKeywordIndex: index,
      editValue: keyword,
    });
  };

  // Edit Keywords in Edit Modal
  const changeKeywordEditing = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState({
      editValue: event.target.value,
    });
  };

  // Press Enter in the Edit Modal
  const submitKeywordEdit = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter" && state.contiData) {
      const newKeywords = [...state.contiData.keywords];
      newKeywords[index] = state.editValue;
      updateState({
        contiData: { ...state.contiData, keywords: newKeywords },
        editKeywordIndex: null,
        editValue: "",
      });
    }
  };

  // Delete Keyword from Edit Modal
  const removeKeyword = (index: number) => {
    if (state.contiData) {
      const newKeywords = state.contiData.keywords.filter(
        (_, idx) => idx !== index
      );
      updateState({
        contiData: { ...state.contiData, keywords: newKeywords },
      });
    }
  };

  // Add Keyword from Edit Modal
  const addNewKeyword = (keyword: string) => {
    if (
      keyword.trim() !== "" &&
      state.contiData &&
      state.contiData.keywords.length < 3
    ) {
      const newKeywords = [...state.contiData.keywords, keyword];
      updateState({
        contiData: { ...state.contiData, keywords: newKeywords },
        editKeywordIndex: null,
      });
    }
  };

  // Delete Conti
  const deleteConti = async () => {
    const token = localStorage["accessToken"];
    const res = await fetch(`${SERVER_URL}/api/conti/${cid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      navigate(-1);
    }
  };

  // When the Delete Conti Button is Pressed
  const deleteContiClick = () => {
    toggleModal("showDeleteConfirmModal", true);
    updateState({
      mode: "conti",
    });
  };

  // When the Delete Song Button is Pressed
  const deleteSongClick = (songId: number) => {
    toggleModal("showDeleteConfirmModal", true);
    updateState({
      deletingSongId: songId,
      mode: "song",
    });
  };

  const titlePrefix =
    state.mode === "conti" ? "콘티를" : state.mode === "song" ? "곡을" : "";
  const modalTitle = `해당 ${titlePrefix} 삭제할까요?`;

  // Confirm Delete Song & Conti
  const handleConfirmDelete = async (mode: string) => {
    if (mode === "song" && state.deletingSongId !== null) {
      await deleteSong(state.deletingSongId);
    }
    if (mode === "conti") {
      deleteConti();
    }
    updateState({ showDeleteConfirmModal: false });
  };

  // Cancel Delete Song & Conti
  const handleCancelDelete = () => {
    updateState({ showDeleteConfirmModal: false });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <PageContainer
        variants={detailVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {isLoading ? (
          <CenteredContainer>
            <div>잠시만요...</div>
            <LoadingSpinner />
          </CenteredContainer>
        ) : (
          <div>
            <TitleHeader>
              <Title>{state.editTitleValue}</Title>
              <EditIconContainer
                onClick={(event) => {
                  ownerOptionsClick(event);
                }}
              >
                <BorderColorIcon />
              </EditIconContainer>
              {state.showOwnerMenu && (
                <OptionsMenu
                  ref={ownerMenuRef}
                  style={{
                    position: "fixed",
                    left: `${state.ownerPosition.x}px`,
                    top: `${state.ownerPosition.y}px`,
                  }}
                  variants={optionsVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {state.isOwner && (
                    <OptionItem onClick={openTitleModal}>
                      타이틀 수정
                    </OptionItem>
                  )}
                  <OptionItem onClick={deleteContiClick}>콘티 삭제</OptionItem>
                  {state.isOwner && (
                    <OptionItem onClick={openKeywordModal}>
                      키워드 수정
                    </OptionItem>
                  )}
                </OptionsMenu>
              )}
            </TitleHeader>
            <PageHeader>
              <BackButtonContainer onClick={() => navigate(-1)}>
                <MdKeyboardArrowLeft size="25" color="#8ab1e8" />
                <BackButton
                  style={{
                    textDecoration: "underline",
                    fontWeight: "bold",
                    color: "#8ab1e8",
                    fontSize: "18px",
                  }}
                >
                  이전
                </BackButton>
              </BackButtonContainer>
              <OwnerInfoPanel>
                <InfoContainer>
                  <OwnerName>{state.contiData?.owner.name}</OwnerName>
                  <CreatedAt>
                    {state.contiData?.created_at
                      ? parseLocalDateString(state.contiData.created_at)
                      : "Loading..."}
                  </CreatedAt>
                </InfoContainer>
              </OwnerInfoPanel>
            </PageHeader>
            <Droppable droppableId={cid!.toString()}>
              {(provided: DroppableProvided) => (
                <SongList {...provided.droppableProps} ref={provided.innerRef}>
                  {state.songs.map((song, index) => (
                    <Draggable
                      key={song.id}
                      draggableId={song.id.toString()}
                      index={index}
                      isDragDisabled={!state.isOwner}
                    >
                      {(
                        provided: DraggableProvided,
                        snapshot: DraggableStateSnapshot
                      ) => (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={{
                            ...provided.draggableProps.style,
                            cursor:
                              !state.isOwner && !snapshot.isDragging
                                ? "default"
                                : "grab",
                          }}
                        >
                          <SongItem
                            song={song}
                            index={index}
                            onOptionsClick={(songId, event) =>
                              songOptionsClick(songId, event)
                            }
                            dragHandleProps={provided.dragHandleProps}
                          />
                          {state.activeOptions === song.id && (
                            <OptionsMenu
                              ref={optionsMenuRef}
                              style={{
                                position: "fixed",
                                left: `${state.optionsPosition.x}px`,
                                top: `${state.optionsPosition.y}px`,
                              }}
                              variants={optionsVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                            >
                              <OptionPlay
                                to={`https://www.youtube.com/results?search_query=${song.title.replace(
                                  " ",
                                  "+"
                                )}`}
                                target="_blank"
                              >
                                들어보기
                              </OptionPlay>
                              {state.isOwner && (
                                <OptionItem
                                  onClick={() => deleteSongClick(song.id)}
                                >
                                  삭제하기
                                </OptionItem>
                              )}
                              {!state.isOwner && (
                                <OptionItem
                                  onClick={() => console.log("가져오기")}
                                >
                                  가져오기
                                </OptionItem>
                              )}
                            </OptionsMenu>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </SongList>
              )}
            </Droppable>
            <TotalDurationContainer>
              <span>총 {state.contiData?.songs.length}개의 곡</span>
              <span>•</span>
              <span>
                {state.contiData?.duration
                  ? formatTotalDuration(state.contiData.duration)
                  : "0분"}
              </span>
            </TotalDurationContainer>
            <Keywords>
              {state.contiData?.keywords.map((k, i) => (
                <KeywordItem key={i}>#{k}</KeywordItem>
              ))}
            </Keywords>
          </div>
        )}
        {state.contiData?.sheet && (
          <StyledLink
            to={`${SERVER_URL}/api/sheet/${state.contiData.sheet.id}`}
          >
            <SheetButton>
              {state.contiData.sheet.filename}{" "}
              {Math.floor((state.contiData.sheet.size / 1024 / 1024) * 10) / 10}
              MB
            </SheetButton>
          </StyledLink>
        )}
        {state.showTitleModal && (
          <OverlayModal onClick={closeTitleModal}>
            <EditModalContainer
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>어떤 타이틀을 원하시나요?</ModalTitle>
              <TitleEditContainer>
                <TitleEditInput
                  value={state.editTitleValue}
                  onChange={(e) =>
                    updateState({ editTitleValue: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      closeTitleModal();
                    }
                  }}
                  autoFocus
                />
                <TitleEditButton onClick={closeTitleModal}>
                  수정하기
                </TitleEditButton>
              </TitleEditContainer>
            </EditModalContainer>
          </OverlayModal>
        )}
        {state.showKeywordModal && (
          <OverlayModal onClick={closeKeywordModal}>
            <EditModalContainer
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>선택해서 수정해주세요!</ModalTitle>
              <ModalContentContainer>
                {state.contiData?.keywords?.map((keyword, index) => (
                  <KeywordEditorContainer key={index}>
                    {index === state.editKeywordIndex ? (
                      <KeyEditInput
                        value={state.editValue}
                        onChange={changeKeywordEditing}
                        onKeyDown={(event) => submitKeywordEdit(event, index)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <KeywordDisplay>{keyword}</KeywordDisplay>
                        <KeyEditButton
                          onClick={() => startKeywordEditing(index, keyword)}
                        >
                          수정
                        </KeyEditButton>
                        <KeyEditButton
                          onClick={() => removeKeyword(index)}
                          style={{ marginLeft: "10px" }}
                        >
                          X
                        </KeyEditButton>
                      </>
                    )}
                  </KeywordEditorContainer>
                ))}
                {state.contiData && state.contiData.keywords.length < 3 && (
                  <KeywordEditorContainer>
                    {state.showNewKeywordInput ? (
                      <KeyEditInput
                        value={state.editValue}
                        onChange={(e) =>
                          updateState({ editValue: e.target.value })
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            state.editValue.trim() !== ""
                          ) {
                            addNewKeyword(state.editValue);
                            updateState({
                              editValue: "",
                              showNewKeywordInput: false,
                            });
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <KeyEditButton
                        onClick={() =>
                          updateState({ showNewKeywordInput: true })
                        }
                      >
                        +
                      </KeyEditButton>
                    )}
                  </KeywordEditorContainer>
                )}
              </ModalContentContainer>
            </EditModalContainer>
          </OverlayModal>
        )}
        <ConfirmModal
          title={modalTitle}
          onConfirm={() => handleConfirmDelete(state.mode)}
          onCancel={handleCancelDelete}
          isVisible={state.showDeleteConfirmModal}
        />
      </PageContainer>
    </DragDropContext>
  );
}

export default ContiDetail;
