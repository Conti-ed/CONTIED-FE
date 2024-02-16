import { useQuery } from "react-query";
import { SERVER_URL, getConti } from "../api";
import { ContiType } from "../types";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { MdKeyboardArrowLeft } from "react-icons/md";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setFontStyle } from "../styles/UploadDrawer.styles";
import { motion } from "framer-motion";
import { useState } from "react";

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
  const { id: cid } = useParams();
  const [contiData, setContiData] = useState<ContiType | undefined>(undefined);
  const { isLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti", cid],
    queryFn: () => getConti(Number(cid)),
    onSuccess: (data) => setContiData(data),
  });

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOptionsPosition({ x: rect.left - 88, y: rect.top + 10 });
  };

  const navigate = useNavigate();

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

  const formatTotalDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else {
      return `${minutes}분`;
    }
  };

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

  const deleteSong = async (sid: number | undefined) => {
    const uid = JSON.parse(localStorage["user_info"]).id;
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
    console.log(res.status, data);

    if (res.ok) {
      setContiData(data);
    }
  };

  return (
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
          <SongList>
            {contiData?.songs.map((s, i) => (
              <SongItem key={s.id || i}>
                <SongNumber>{i + 1}.</SongNumber>
                <SongInfo>
                  <SongTitle>{s.title}</SongTitle>
                  <SongDetails>
                    <ArtistAndDuration>
                      <SongArtist>{s.artist}</SongArtist>
                      <span>•</span>
                      <SongDuration>
                        {s?.duration ? formatDuration(s.duration) : "0:00"}
                      </SongDuration>
                    </ArtistAndDuration>
                  </SongDetails>
                </SongInfo>
                <IconContainer
                  onClick={(event) => {
                    handleMoreClick(event);
                    setActiveOptions(s.id !== undefined ? s.id : null);
                  }}
                >
                  <MoreVertIcon />
                </IconContainer>
                {activeOptions === s.id && (
                  <OptionsMenu
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
                    <OptionItem onClick={() => deleteSong(s.id)}>
                      삭제하기
                    </OptionItem>
                    <OptionItem onClick={() => console.log("기타옵션")}>
                      기타 옵션
                    </OptionItem>
                  </OptionsMenu>
                )}
              </SongItem>
            ))}
          </SongList>
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
        <StyledLink to={`${SERVER_URL}/api/sheet/${contiData.sheet}`}>
          <SheetButton>
            {contiData.sheet.filename}{" "}
            {Math.floor((contiData.sheet.size / 1024 / 1024) * 10) / 10}MB
          </SheetButton>
        </StyledLink>
      )}
    </Container>
  );
}

export default ContiDetail;
