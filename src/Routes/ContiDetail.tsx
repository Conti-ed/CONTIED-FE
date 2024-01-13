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

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: transparent;
  margin-bottom: 20px;
  gap: 5px;
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

const ArtistAndDuration = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
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
  console.log(data);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
          <div>{data?.owner.name}</div>
          <div>{data?.created_at}</div>
          <div>{data?.duration ? formatDuration(data.duration) : "0분"}</div>
          <Keywords>
            {data?.keywords.map((k, i) => (
              <KeywordItem key={i}>#{k}</KeywordItem>
            ))}
          </Keywords>
        </div>
      )}
      {data?.sheet && (
        <Link
          target="_blank"
          rel="noreferrer"
          to={`${SERVER_URL}/api/sheet/${data.sheet}`}
        >
          <button>악보 보기</button>
        </Link>
      )}
    </Container>
  );
}

export default ContiDetail;
