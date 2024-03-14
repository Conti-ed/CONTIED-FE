import { useQuery, useQueryClient } from "react-query";
import { SERVER_URL, getConti } from "../api";
import { ContiType, SongType } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { MdKeyboardArrowLeft } from "react-icons/md";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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

const Container = styled(motion.div)`
  padding-top: 35px;
  padding: 10px;
  padding-bottom: 100px;
`;

const Spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${Spin} 2s linear infinite;
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

const HeaderContainer = styled.div`
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

const OwnerInfoContainer = styled.div`
  text-align: right;
  margin-right: 10px;
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

export const ModalOverlay = styled.div`
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

export const ModalContainer = styled(motion.div)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  max-width: 500px;
  text-align: center;
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

interface OptionsPosition {
  x: number;
  y: number;
}

function ContiDetail() {
  const [activeOptions, setActiveOptions] = useState<number | null>(null);
  const [optionsPosition, setOptionsPosition] = useState<OptionsPosition>({
    x: 0,
    y: 0,
  });
  const [contiData, setContiData] = useState<ContiType | undefined>(undefined);
  const [isOwner, setIsOwner] = useState(false);
  const [songs, setSongs] = useState<SongType[]>([]);

  const optionsMenuRef = useRef<HTMLDivElement | null>(null);
  const { id: cid } = useParams();
  const uid = JSON.parse(localStorage["user_info"]).id;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.refetchQueries(["conties", "conti", cid]);
  }, [cid, queryClient]);

  const { isLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti", cid],
    queryFn: () => getConti(Number(cid)),
    onSuccess: (data) => {
      setContiData(data);
      if (data) {
        setSongs(data.songs.sort((a, b) => a.order - b.order) || []);
        setIsOwner(data.owner.id === JSON.parse(localStorage["user_info"]).id);
      }
    },
    refetchOnWindowFocus: true,
  });

  // When a Song is Dragged and Dropped
  const onDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination) return;
    if (destination.index === source.index) return;

    const items = [...songs];
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setSongs(items);

    const res = fetch(
      `${SERVER_URL}/api/conti/${cid}?uid=${uid}&start=${source.index}&end=${destination.index}`,
      { method: "PUT" }
    );
    const data = await (await res).json();
    console.log((await res).status, data);
  };

  // When the More Button is Pressed
  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setOptionsPosition({ x: rect.left - 88, y: rect.top + 10 });
    setActiveOptions(
      activeOptions === parseInt(event.currentTarget.id)
        ? null
        : parseInt(event.currentTarget.id)
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setActiveOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeOptions]);

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

  // Delete Confirmation Modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingSongId, setDeletingSongId] = useState<number | null>(null);

  const deleteSong = async (sid: number | undefined) => {
    // console.log("Attempting to delete song with ID:", sid);
    const token = localStorage["accessToken"];
    setActiveOptions(null);
    const res = await fetch(
      `${SERVER_URL}/api/song/${sid}?cid=${cid}&uid=${uid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    if (res.ok) {
      setSongs(songs.filter((song) => song.id !== sid));
      setContiData(data);
    }
  };

  // When the Delete Button is Pressed
  const handleDeleteClick = (songId: number) => {
    setShowDeleteConfirmModal(true);
    setDeletingSongId(songId);
  };

  // Confirm Delete Song
  const handleConfirmDelete = async () => {
    if (deletingSongId !== null) {
      await deleteSong(deletingSongId);
      setDeletingSongId(null);
    }
    setShowDeleteConfirmModal(false);
  };

  // Cancel Delete Song
  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setDeletingSongId(null);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} key={cid}>
      <Container
        variants={detailVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {isLoading ? (
          <CenteredContainer>
            <div>잠시만요...</div>
            <Spinner />
          </CenteredContainer>
        ) : (
          <div>
            <HeaderContainer>
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
              <OwnerInfoContainer>
                <OwnerName>{contiData?.owner.name}</OwnerName>
                <CreatedAt>
                  {contiData?.created_at
                    ? parseLocalDateString(contiData.created_at)
                    : "Loading..."}
                </CreatedAt>
              </OwnerInfoContainer>
            </HeaderContainer>
            <Droppable droppableId={`songs-${cid}`} key={`droppable-${cid}`}>
              {(provided: DroppableProvided) => (
                <SongList
                  className={`songs-${cid}`}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {songs.map((song, index) => (
                    <Draggable
                      key={song.id}
                      draggableId={song.id.toString()}
                      index={index}
                      isDragDisabled={!isOwner}
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
                              !isOwner && !snapshot.isDragging
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
                              handleMoreClick(event);
                              setActiveOptions(
                                song.id !== undefined ? song.id : null
                              );
                            }}
                          >
                            <MoreVertIcon />
                          </IconContainer>
                          {activeOptions === song.id && (
                            <OptionsMenu
                              ref={optionsMenuRef}
                              style={{
                                position: "fixed",
                                left: `${optionsPosition.x}px`,
                                top: `${optionsPosition.y}px`,
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
                              {isOwner && (
                                <OptionItem
                                  onClick={() => handleDeleteClick(song.id)}
                                >
                                  삭제하기
                                </OptionItem>
                              )}
                              <OptionItem
                                onClick={() => console.log("기타옵션")}
                              >
                                기타 옵션
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
              <span>총 {contiData?.songs.length}개의 곡</span>
              <span>•</span>
              <span>
                {contiData?.duration
                  ? formatTotalDuration(contiData.duration)
                  : "0분"}
              </span>
            </TotalDurationContainer>
            <Keywords>
              {contiData?.keywords.map((k, i) => (
                <KeywordItem key={i}>#{k}</KeywordItem>
              ))}
            </Keywords>
          </div>
        )}
        {contiData?.sheet && (
          <StyledLink to={`${SERVER_URL}/api/sheet/${contiData.sheet.id}`}>
            <SheetButton>
              {contiData.sheet.filename}{" "}
              {Math.floor((contiData.sheet.size / 1024 / 1024) * 10) / 10}MB
            </SheetButton>
          </StyledLink>
        )}
        {showDeleteConfirmModal && (
          <ModalOverlay>
            <ModalContainer
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <ModalTitle>삭제하시겠습니까?</ModalTitle>
              <div>
                <ModalButton onClick={handleConfirmDelete}>네</ModalButton>
                <ModalButton onClick={handleCancelDelete}>아니오</ModalButton>
              </div>
            </ModalContainer>
          </ModalOverlay>
        )}
      </Container>
    </DragDropContext>
  );
}

export default ContiDetail;
