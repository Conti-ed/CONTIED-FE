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
import SongItem from "../components/SongItem";
import Modal from "../components/Modal";
import { useRecoilState } from "recoil";
import { modalAtom } from "../atoms";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const optionsMenuRef = useRef<HTMLDivElement | null>(null);
  const ownerMenuRef = useRef<HTMLDivElement | null>(null);
  const { id: cid } = useParams();
  const uid = JSON.parse(localStorage["user_info"]).id;
  const { state, updateState, onDragEnd, songOptionsClick } =
    useContiDetailState(Number(cid), uid);
  const [modal, setModal] = useRecoilState(modalAtom);

  // fetch conti data
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
        editTitleValue: data!.title,
      });
    },
    refetchOnWindowFocus: true,
  });

  // Refetch conti data
  useEffect(() => {
    queryClient.refetchQueries(["conties", "conti", cid]);
  }, [cid, queryClient]);

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
            <div style={{ marginBottom: "10px" }}>잠시만요...</div>
            <LoadingSpinner />
          </CenteredContainer>
        ) : (
          <div>
            <TitleHeader>
              <Title>{state.contiData?.title}</Title>
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
                    <OptionItem
                      onClick={() =>
                        setModal({
                          isShow: true,
                          modalType: "ModifyTitle",
                          id: Number(cid),
                        })
                      }
                    >
                      타이틀 수정
                    </OptionItem>
                  )}
                  <OptionItem
                    onClick={() =>
                      setModal({
                        isShow: true,
                        modalType: "ConfirmDeleteConti",
                        id: Number(cid),
                      })
                    }
                  >
                    콘티 삭제
                  </OptionItem>
                  {state.isOwner && (
                    <OptionItem
                      onClick={() =>
                        setModal({
                          isShow: true,
                          modalType: "ModifyKeywords",
                          id: Number(cid),
                        })
                      }
                    >
                      키워드 수정
                    </OptionItem>
                  )}
                </OptionsMenu>
              )}
            </TitleHeader>
            <PageHeader>
              <BackButtonContainer onClick={() => navigate("/feed")}>
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
                      key={index}
                      draggableId={index + ""}
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
                                  onClick={() =>
                                    setModal({
                                      isShow: true,
                                      modalType: "ConfirmDeleteSong",
                                      id: song.id,
                                    })
                                  }
                                >
                                  삭제하기
                                </OptionItem>
                              )}
                              {!state.isOwner && (
                                <OptionItem
                                  onClick={() =>
                                    setModal({
                                      isShow: true,
                                      modalType: "AddToMyConti",
                                      id: song.id,
                                    })
                                  }
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
      </PageContainer>
      {modal.isShow && <Modal state={state} updateState={updateState} />}
    </DragDropContext>
  );
}

export default ContiDetail;
