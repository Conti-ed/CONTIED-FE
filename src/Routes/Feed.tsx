import {
  CenteredContainer,
  Container,
  Spinner,
  FeedVariants,
} from "../styles/Feed.styles";
import Conti from "../components/Conti";
import { useQuery } from "react-query";
import { ContiType } from "../types";
import { getConties } from "../api";
import { contiesAtom, isLoginAtom } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect } from "react";

function Feed() {
  const { data, isLoading } = useQuery<ContiType[]>({
    queryKey: ["conties"],
    queryFn: getConties,
  });
  const [conties, setConties] = useRecoilState(contiesAtom);
  const setIsLogin = useSetRecoilState(isLoginAtom);

  useEffect(() => {
    data && setConties(data);
  }, [data, setConties]);

  useEffect(() => {
    localStorage.getItem("user_info") &&
      JSON.parse(localStorage.getItem("user_info")!).id &&
      setIsLogin(true);
  }, [setIsLogin]);

  return (
    <Container
      variants={FeedVariants}
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
        conties
          ?.slice()
          .reverse()
          .map((conti, i) => <Conti key={i} contiData={conti} />)
      )}
    </Container>
  );
}

export default Feed;
