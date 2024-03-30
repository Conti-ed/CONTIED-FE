import { useQuery, useQueryClient } from "react-query";
import { SERVER_URL, getConti } from "../api";
import { ContiType, SongType } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { MdKeyboardArrowLeft } from "react-icons/md";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { setFontStyle } from "../styles/UploadDrawer.styles";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import Modal from "../components/Modal";
import { useRecoilState } from "recoil";
import { modalAtom } from "../atoms";

const PageContainer = styled(motion.div)`
  padding-top: 35px;
  padding: 10px;
  padding-bottom: 100px;
`;

const LoadingAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${LoadingAnimation} 2s linear infinite;
  margin-top: 10px;
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  gap: 5px;
  border-radius: 10px;
  border: none;
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

export const SongItem = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 10px 20px 0px;
`;

export const SongNumber = styled.span`
  min-width: 20px;
  margin-right: 8px;
`;

export const SongInfo = styled.span`
  padding: 0px 30px 0px 0px;
`;

export const SongTitle = styled.span`
  font-weight: 700;
  flex: 1;
`;

export const SongArtist = styled.span``;

export const SongDuration = styled.span``;

export const SongDetails = styled.div`
  color: #6c757d;
  font-size: 13px;
  margin-top: 5px;
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

interface OptionsPosition {
  x: number;
  y: number;
}

export interface ContiDetailState {
  activeOptions: number | null;
  optionsPosition: OptionsPosition;
  contiData: ContiType | undefined;
  isOwner: boolean;
  songs: SongType[];
  editKeywordIndex: number | null;
  editValue: string;
  showOwnerMenu: boolean;
  ownerPosition: OptionsPosition;
  showNewKeywordInput: boolean;
}

const initialState: ContiDetailState = {
  activeOptions: null,
  optionsPosition: { x: 0, y: 0 },
  contiData: undefined,
  isOwner: false,
  songs: [],
  editKeywordIndex: null,
  editValue: "",
  showOwnerMenu: false,
  ownerPosition: { x: 0, y: 0 },
  showNewKeywordInput: false,
};

function ContiDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [state, setState] = useState<ContiDetailState>(initialState);
  const optionsMenuRef = useRef<HTMLDivElement | null>(null);
  const ownerMenuRef = useRef<HTMLDivElement | null>(null);
  const { id: cid } = useParams();
  const uid = JSON.parse(localStorage["user_info"]).id;
  const [modal, setModal] = useRecoilState(modalAtom);

  // When the Conti was First Uploaded
  const { isLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti", cid],
    queryFn: () => getConti(Number(cid)),
    onSuccess: (data) => {
      setState((prevState) => ({
        ...prevState,
        ...{
          contiData: data,
          songs: data ? data.songs.sort((a, b) => a.order - b.order) : [],
          isOwner: data
            ? data.owner.id === JSON.parse(localStorage["user_info"]).id
            : false,
        },
      }));
    },
    refetchOnWindowFocus: true,
  });

  // Refetch conti data
  useEffect(() => {
    queryClient.refetchQueries(["conties", "conti", cid]);
  }, [cid, queryClient]);

  // When a Song is Dragged and Dropped
  const onDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination || destination.index === source.index) return;

    setState((prevState) => {
      const newSongs = Array.from(prevState.songs);
      const [reorderedItem] = newSongs.splice(source.index, 1);
      newSongs.splice(destination.index, 0, reorderedItem);

      return { ...prevState, songs: newSongs };
    });

    try {
      const response = await fetch(
        `${SERVER_URL}/api/order?cid=${cid}&uid=${uid}&start=${source.index}&end=${destination.index}`,
        {
          method: "PUT",
        }
      );
      const data = await response.json();
      console.log(response.status, data);
    } catch (error) {
      console.error("Failed to update song order", error);
    }
  };

  // When the More Button is Pressed
  const songOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const newActiveOptions = parseInt(event.currentTarget.id);

    setState((prevState) => ({
      ...prevState,
      ...{
        optionsPosition: { x: rect.left - 88, y: rect.top + 10 },
        activeOptions:
          state.activeOptions === newActiveOptions ? null : newActiveOptions,
      },
    }));
  };

  // When the Owner Button is Pressed
  const ownerOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setState((prevState) => ({
      ...prevState,
      ...{
        ownerPosition: { x: rect.left - 100, y: rect.top + 10 },
        showOwnerMenu: true,
      },
    }));
  };

  // When Clicking Outside the Options Modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        state.showOwnerMenu &&
        ownerMenuRef.current &&
        !ownerMenuRef.current.contains(event.target as Node)
      ) {
        setState((prevState) => ({
          ...prevState,
          ...{ showOwnerMenu: false },
        }));
      }
      if (
        state.activeOptions !== null &&
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setState((prevState) => ({ ...prevState, ...{ activeOptions: null } }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.showOwnerMenu, state.activeOptions, ownerMenuRef, optionsMenuRef]);

  // Set Duration
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${minutes}:${formattedSeconds}`;
    }
  };

  // Set Overall Duration
  const formatTotalDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else {
      return `${minutes}분`;
    }
  };

  // Adjust Date by Region upon Registration
  const parseLocalDateString = (dateString: string): string => {
    const [datePart, timePart] = dateString.split(" ");
    const [month, day, year] = datePart.split("/").map(Number);
    const [hourString, minuteString] = timePart.slice(0, -2).split(":");
    const ampm = timePart.slice(-2).toLowerCase();

    let hour = parseInt(hourString);
    const minute = parseInt(minuteString);

    if (ampm === "pm" && hour !== 12) {
      hour += 12;
    } else if (ampm === "am" && hour === 12) {
      hour = 0;
    }

    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

    return utcDate.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} key={cid}>
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
              <BackButton onClick={() => navigate(-1)}>
                <MdKeyboardArrowLeft size="25" color="#8ab1e8" />
                <span
                  style={{
                    textDecoration: "underline",
                    fontWeight: "bold",
                    color: "#8ab1e8",
                    fontSize: "18px",
                  }}
                >
                  이전
                </span>
              </BackButton>
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
            <Droppable droppableId={`songs-${cid}`} key={`droppable-${cid}`}>
              {(provided: DroppableProvided) => (
                <SongList
                  className={`songs-${cid}`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
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
                        <SongItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            cursor:
                              !state.isOwner && !snapshot.isDragging
                                ? "default"
                                : "grab",
                          }}
                        >
                          <SongNumber>{index + 1}.</SongNumber>
                          <SongInfo>
                            <SongTitle>{song.title}</SongTitle>
                            <SongDetails>
                              <ArtistAndDuration>
                                <SongArtist>{song.artist}</SongArtist>
                                <span>•</span>
                                <SongDuration>
                                  {song.duration
                                    ? formatDuration(song.duration)
                                    : "0:00"}
                                </SongDuration>
                              </ArtistAndDuration>
                            </SongDetails>
                          </SongInfo>
                          <IconContainer
                            onClick={(event) => {
                              songOptionsClick(event);
                              setState((prevState) => ({
                                ...prevState,
                                activeOptions:
                                  song.id !== undefined ? song.id : null,
                              }));
                            }}
                          >
                            <MoreVertIcon />
                          </IconContainer>
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
                            </OptionsMenu>
                          )}
                        </SongItem>
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
      {modal.isShow && <Modal state={state} setState={setState} />}
    </DragDropContext>
  );
}

export default ContiDetail;
