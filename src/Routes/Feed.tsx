import { CenteredContainer, Container, Spinner } from "../styles/Feed.styles";
import Conti from "../components/Conti";
import { useQuery } from "react-query";
import { ContiType } from "../types";
import { getConties } from "../api";
import { contiesAtom } from "../atoms";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Feed() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const { data, isLoading } = useQuery<ContiType[]>({
    queryKey: ["conties"],
    queryFn: getConties,
    onSuccess: (data) => {
      if ("detail" in data) {
        setAuthorized(false);
        navigate("/login");
      } else {
        setAuthorized(true);
      }
    },
  });
  const [conties, setConties] = useRecoilState(contiesAtom);

  useEffect(() => {
    data && setConties(data);
  }, [data, setConties]);

  return (
    <Container>
      {isLoading ? (
        <CenteredContainer>
          <div>잠시만요...</div>
          <Spinner />
        </CenteredContainer>
      ) : (
        conties?.map((conti, i) => <Conti key={i} contiData={conti} />)
      )}
    </Container>
  );
}

export default Feed;
