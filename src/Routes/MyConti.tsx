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
import { getMyConties } from "../api";
import ContiPlaceholder from "../components/ContiPlaceholder";
import { styled } from "styled-components";

const SectionSubTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 15px;
`;

function MyConti() {
  const { data: myConti, isLoading: myContiIsLoading } = useQuery<ContiType[]>(
    ["myConti"],
    {
      queryFn: getMyConties,
    }
  );

  return (
    <Container
      variants={HomeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <SectionContainer>
        <SectionHeader>
          <SectionSubTitle>"내가 업로드한 콘티들"</SectionSubTitle>
        </SectionHeader>
        <SectionBody>
          {myContiIsLoading
            ? Array.from({ length: 20 }).map((_, index) => (
                <ContiPlaceholder key={index} size={115} />
              ))
            : myConti &&
              myConti
                .slice(0, 20)
                .map((conti, index) => <Conti key={index} contiData={conti} />)}
        </SectionBody>
      </SectionContainer>
    </Container>
  );
}

export default MyConti;
