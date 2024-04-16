import { useQuery, useQueryClient } from "react-query";
import { SERVER_URL, getConti, getSavedConties } from "../api";
import { ContiType, SongType } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { MdKeyboardArrowLeft } from "react-icons/md";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { setFontStyle } from "../styles/UploadDrawer.styles";
import { motion } from "framer-motion";
import { useEffect } from "react";
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
import OptionsMenu, { IMenuItem } from "../components/OptionsMenu";

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

const Spacer = styled.div`
  width: 32px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  flex-grow: 1;
  text-align: center;
`;

export const EditIconContainer = styled.div`
  width: 32px;
  margin-left: auto;
`;

const fillHeart = keyframes`
  from {
    transform: scale(0.7);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const HeartIcon = styled.svg<{ $isFavorite: boolean }>`
  width: 24px;
  height: 24px;
  fill: ${({ $isFavorite }) => ($isFavorite ? "lightcoral" : "transparent")};
  stroke: lightcoral;
  stroke-width: 2px;
  transition: fill 0.3s ease-in-out, stroke 0.3s ease-in-out;
  ${({ $isFavorite }) =>
    $isFavorite &&
    css`
      animation: ${fillHeart} 0.6s ease forwards;
    `}
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

function ContiDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id: cid } = useParams();
  const uid = localStorage["user_info"]
    ? JSON.parse(localStorage["user_info"]).id
    : null;
  const { state, updateState, onDragEnd, toggleFavorite, songOptionsClick } =
    useContiDetailState(Number(cid), uid);
  const [modal, setModal] = useRecoilState(modalAtom);

  // fetch conti data
  const { isLoading: contiLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti", cid],
    queryFn: () => getConti(Number(cid)),
    onSuccess: (data) => {
      updateState({
        contiData: data,
        songs: data ? data.songs.sort((a, b) => a.order - b.order) : [],
        isOwner: data ? data.owner.id === uid : false,
        editTitleValue: data!.title,
      });
    },
    refetchOnWindowFocus: true,
  });

  const { isLoading: savedLoading } = useQuery<ContiType[]>({
    queryKey: ["saved"],
    queryFn: () => getSavedConties(uid),
    onSuccess: (data) => {
      if (data && data.find((c) => c?.id === Number(cid))) {
        updateState({ isFavorite: true });
      }
    },
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

  const ownerMenuItems = [
    {
      label: "타이틀 수정",
      onClick: () =>
        setModal({ isShow: true, modalType: "ModifyTitle", id: Number(cid) }),
    },
    {
      label: "콘티 삭제",
      onClick: () =>
        setModal({
          isShow: true,
          modalType: "ConfirmDeleteConti",
          id: Number(cid),
        }),
    },
    {
      label: "키워드 수정",
      onClick: () =>
        setModal({
          isShow: true,
          modalType: "ModifyKeywords",
          id: Number(cid),
        }),
    },
  ];

  const getMenuItems = (song: SongType) => {
    const items: IMenuItem[] = [
      {
        label: "들어보기",
        link: `https://www.youtube.com/results?search_query=${song.title.replace(
          " ",
          "+"
        )}`,
      },
    ];
    if (state.isOwner) {
      items.push({
        label: "삭제하기",
        onClick: () =>
          setModal({
            isShow: true,
            modalType: "ConfirmDeleteSong",
            id: song.id,
          }),
      });
    } else if (!state.isOwner) {
      items.push({
        label: "추가하기",
        onClick: () =>
          setModal({ isShow: true, modalType: "AddToMyConti", id: song.id }),
      });
    }

    return items;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <PageContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {contiLoading || savedLoading ? (
          <CenteredContainer>
            <div style={{ marginBottom: "10px" }}>잠시만요...</div>
            <LoadingSpinner />
          </CenteredContainer>
        ) : (
          <div>
            <TitleHeader>
              <Spacer />
              <Title>{state.contiData?.title}</Title>
              <EditIconContainer
                onClick={(event) => {
                  if (state.isOwner) ownerOptionsClick(event);
                  else toggleFavorite(event);
                }}
              >
                {state.isOwner ? (
                  <BorderColorIcon />
                ) : (
                  uid && (
                    <HeartIcon
                      $isFavorite={state.isFavorite}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="lightcoral"
                    >
                      <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path>
                    </HeartIcon>
                  )
                )}
              </EditIconContainer>
              {state.showOwnerMenu && (
                <OptionsMenu
                  x={state.ownerPosition.x}
                  y={state.ownerPosition.y}
                  onClose={() => updateState({ showOwnerMenu: false })}
                  menuItems={ownerMenuItems}
                />
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
                              x={state.optionsPosition.x}
                              y={state.optionsPosition.y}
                              onClose={() =>
                                updateState({ activeOptions: null })
                              }
                              menuItems={getMenuItems(song)}
                            />
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
