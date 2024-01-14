import { useQuery } from "react-query";
import { SERVER_URL, getConti } from "../api";
import { ContiType } from "../types";
import { Link, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { MdKeyboardArrowLeft } from "react-icons/md";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Container = styled.div`
  padding-top: 35px;
  padding: 10px;
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

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: transparent;
  gap: 5px;
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

const SongList = styled.div`
  text-align: left;
  font-size: 15px;
  margin-left: 10px;
`;

const SongItem = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 10px 20px 0px;
`;

const SongNumber = styled.span`
  min-width: 20px;
  margin-right: 8px;
`;

const SongInfo = styled.span`
  padding: 0px 30px 0px 0px;
`;

const SongTitle = styled.span`
  font-weight: 700;
  flex: 1;
`;

const SongArtist = styled.span``;

const SongDuration = styled.span``;

const SongDetails = styled.div`
  color: #6c757d;
  font-size: 13px;
  margin-top: 5px;
`;

const ArtistAndDuration = styled(DetailItem)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TotalDurationContainer = styled(DetailItem)`
  justify-content: center;
  margin-top: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #c1c8ce;
`;

const IconContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
`;

const KeywordItem = styled.div`
  background-color: #e1ecf4;
  color: #3178c6;
  padding: 5px;
  border-radius: 10px;
`;

function ContiDetail() {
  const { id: cid } = useParams();
  const { data, isLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti", cid],
    queryFn: () => getConti(Number(cid)),
  });

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

  return (
    <Container>
      {isLoading ? (
        <CenteredContainer>
          <div>잠시만요...</div>
          <Spinner />
        </CenteredContainer>
      ) : (
        <div>
          <HeaderContainer>
            <BackButton to="/feed">
              <MdKeyboardArrowLeft size="25" color="#8ab1e8" />
              <span
                style={{
                  textDecoration: "underline",
                  fontWeight: "bold",
                  color: "#8ab1e8",
                  fontSize: "18px",
                }}
              >
                피드
              </span>
            </BackButton>
            <OwnerInfoContainer>
              <OwnerName>{data?.owner.name}</OwnerName>
              <CreatedAt>
                {data?.created_at
                  ? parseLocalDateString(data.created_at)
                  : "Loading..."}
              </CreatedAt>
            </OwnerInfoContainer>
          </HeaderContainer>
          <SongList>
            {data?.songs.map((s, i) => (
              <SongItem key={i}>
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
                <IconContainer>
                  <MoreVertIcon />
                </IconContainer>
              </SongItem>
            ))}
          </SongList>
          <TotalDurationContainer>
            <span>총 {data?.songs.length}개의 곡</span>
            <span>•</span>
            <span>
              {data?.duration ? formatTotalDuration(data.duration) : "0분"}
            </span>
          </TotalDurationContainer>
          <Keywords>
            {data?.keywords.map((k, i) => (
              <KeywordItem key={i}>#{k}</KeywordItem>
            ))}
          </Keywords>
        </div>
      )}
      {data?.sheet && (
        <Link to={`${SERVER_URL}/api/sheet/${data.sheet}`}>
          <button>악보 보기</button>
        </Link>
      )}
    </Container>
  );
}

export default ContiDetail;
