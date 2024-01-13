import { useQuery } from "react-query";
import { SERVER_URL, getConti } from "../api";
import { ContiType } from "../types";
import { Link, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Button } from "../styles/UploadDrawer.styles";

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
  display: inline-block;
  padding: 8px 12px;
  background-color: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  top: 70px;
  left: 10px;
  margin-bottom: 20px;
`;

function ContiDetail() {
  const { id: cid } = useParams();
  const { data, isLoading } = useQuery<ContiType>({
    queryKey: ["conties", "conti", cid],
    queryFn: () => getConti(Number(cid)),
  });

  console.log(data);

  return (
    <Container>
      {isLoading ? (
        <CenteredContainer>
          <div>잠시만요...</div>
          <Spinner />
        </CenteredContainer>
      ) : (
        <div>
          <BackButton to="/feed">뒤로 가기</BackButton>
          <div>
            {data?.songs.map((s, i) => (
              <div key={i}>{s.title}</div>
            ))}
          </div>
          <div>{data?.owner.name}</div>
          <div>{data?.created_at}</div>
          <div>
            {data?.keywords.map((k, i) => (
              <div key={i}>{k}</div>
            ))}
          </div>
          {data?.sheet && (
            <Link
              target="_blank"
              rel="noreferrer"
              to={`${SERVER_URL}/api/sheet/${data.sheet}`}
            >
              <Button>악보 보기</Button>
            </Link>
          )}
        </div>
      )}
    </Container>
  );
}

export default ContiDetail;
