import { useQuery } from "react-query";
import {
  Container,
  HomeVariants,
  SectionBody,
  SectionContainer,
  SectionHeader,
} from "../styles/Home.styles";
import Conti from "../components/Conti";
import { ContiType } from "../types";
import { getConti, getMyConties } from "../api";
import ContiPlaceholder from "../components/ContiPlaceholder";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { SongList } from "./ContiDetail";
import SongItem from "../components/SongItem";

const ContiSubTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 15px;
`;

const SongsSubTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

function MyConti() {
  const [myContiDetails, setMyContiDetails] = useState<ContiType[]>([]);

  // Fetch My Conties
  const { data: myConti, isLoading: myContiIsLoading } = useQuery<ContiType[]>(
    "myConti",
    getMyConties
  );

  // Fetch My Conti's Details
  useEffect(() => {
    if (myConti) {
      const fetchContiDetails = async () => {
        try {
          const contiDetailsPromises = myConti.map((conti) =>
            getConti(conti!.id)
          );
          const details = await Promise.all(contiDetailsPromises);
          setMyContiDetails(details.reverse());
        } catch (error) {
          console.error("내 콘티 정보를 가져오는 데 실패했습니다.", error);
        }
      };
      fetchContiDetails();
    }
  }, [myConti]);

  const allSongs = myContiDetails.flatMap((conti) => conti!.songs || []);

  return (
    <Container
      variants={HomeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SectionContainer>
        <SectionHeader>
          <ContiSubTitle>"내가 업로드한 콘티들"</ContiSubTitle>
        </SectionHeader>
        <SectionBody>
          {myContiIsLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <ContiPlaceholder key={index} size={115} />
              ))
            : myConti &&
              myConti
                .slice()
                .reverse()
                .map((conti, index) => <Conti key={index} contiData={conti} />)}
        </SectionBody>
      </SectionContainer>
      <SongsSubTitle>"내가 업로드한 곡들"</SongsSubTitle>
      <SongList>
        {allSongs.map((s, i) => (
          <div key={i}>
            <SongItem song={s} index={i} onOptionsClick={() => null}></SongItem>
          </div>
        ))}
      </SongList>
    </Container>
  );
}

export default MyConti;
