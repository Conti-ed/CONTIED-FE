import React from "react";
import styled from "styled-components";
import SafariSpace from "./SafariSpace";
import StatusBar from "./StatusBar";
import { Container } from "../styles/Home.styles";

const AddLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 280px;
`;

const AddLoadingImage = styled.img`
  margin-bottom: 16px;
`;

const AddLoadingText = styled.div`
  font-size: 10px;
  font-weight: 300;
  color: #828282;
  text-align: center;
`;

const AddLoading: React.FC = () => {
  return (
    <Container>
      <StatusBar />
      <AddLoadingContainer>
        <AddLoadingImage
          src={process.env.PUBLIC_URL + "/images/WhitePiano.png"}
          alt="Loading"
        />
        <AddLoadingText>잠시만요...</AddLoadingText>
      </AddLoadingContainer>
      <SafariSpace $isFocused={false} />
    </Container>
  );
};

export default AddLoading;
