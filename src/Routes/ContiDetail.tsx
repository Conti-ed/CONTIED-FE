import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: 67px;
  width: 100%;
  border-bottom: 0.7px solid #d9d9d9;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 9px;
  gap: 10px;
`;

const HeartIcon = () => (
  <svg
    width="17"
    height="14"
    viewBox="0 0 17 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.73582 1.30738C2.49233 0.54952 3.51824 0.123781 4.58794 0.123781C5.65765 0.123781 6.68356 0.54952 7.44007 1.30738L8.62206 2.49082L9.80406 1.30738C10.1762 0.921274 10.6213 0.613306 11.1135 0.401441C11.6057 0.189577 12.1351 0.0780591 12.6707 0.0733948C13.2063 0.0687305 13.7376 0.171013 14.2333 0.374275C14.7291 0.577536 15.1795 0.877706 15.5583 1.25727C15.9371 1.63683 16.2366 2.08819 16.4395 2.585C16.6423 3.08181 16.7444 3.61413 16.7397 4.15089C16.7351 4.68765 16.6238 5.21811 16.4124 5.71132C16.2009 6.20452 15.8936 6.65059 15.5083 7.0235L8.62206 13.9251L1.73582 7.0235C0.979542 6.26542 0.554688 5.23737 0.554688 4.16544C0.554688 3.09351 0.979542 2.06546 1.73582 1.30738Z"
      fill="#4F8EEC"
    />
  </svg>
);

const OptionsIcon = () => (
  <svg
    width="15"
    height="3"
    viewBox="0 0 15 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.49999 1.99998C1.77612 1.99998 1.99998 1.77612 1.99998 1.49999C1.99998 1.22385 1.77612 1 1.49999 1C1.22385 1 1 1.22385 1 1.49999C1 1.77612 1.22385 1.99998 1.49999 1.99998ZM1.49999 2.99998C2.32841 2.99998 2.99998 2.32841 2.99998 1.49999C2.99998 0.671567 2.32841 0 1.49999 0C0.671567 0 0 0.671567 0 1.49999C0 2.32841 0.671567 2.99998 1.49999 2.99998ZM7.67638 2.00012C7.95251 2.00012 8.17636 1.77626 8.17636 1.50013C8.17636 1.22399 7.95251 1.00014 7.67638 1.00014C7.40024 1.00014 7.17639 1.22399 7.17639 1.50013C7.17639 1.77626 7.40024 2.00012 7.67638 2.00012ZM7.67638 3.00012C8.5048 3.00012 9.17636 2.32855 9.17636 1.50013C9.17636 0.671707 8.5048 0.000139432 7.67638 0.000139432C6.84796 0.000139432 6.17639 0.671707 6.17639 1.50013C6.17639 2.32855 6.84796 3.00012 7.67638 3.00012ZM14.0003 1.50013C14.0003 1.77626 13.7765 2.00012 13.5003 2.00012C13.2242 2.00012 13.0004 1.77626 13.0004 1.50013C13.0004 1.22399 13.2242 1.00014 13.5003 1.00014C13.7765 1.00014 14.0003 1.22399 14.0003 1.50013ZM15.0003 1.50013C15.0003 2.32855 14.3288 3.00012 13.5003 3.00012C12.6719 3.00012 12.0004 2.32855 12.0004 1.50013C12.0004 0.671707 12.6719 0.000139432 13.5003 0.000139432C14.3288 0.000139432 15.0003 0.671707 15.0003 1.50013Z"
      fill="#171A1F"
      fillOpacity="0.5"
    />
  </svg>
);

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const AlbumDetailContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AlbumImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
`;

const AlbumInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const InfoText = styled.div`
  margin-left: 10px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 500;
  color: #323743;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  font-size: 13px;
  font-weight: 300;
  color: #171a1f;
  margin-bottom: 9px;
`;

const SongInfo = styled.div`
  font-size: 10px;
  font-weight: 300;
  color: #9095a1;
  margin-bottom: 20px;
`;

const SongList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
`;

const SongItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;

  & > div {
    font-size: 16px;
  }
`;

const ContiDetail: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const albumTitle = "동계 수련회 콘티";
  const albumSubtitle = "준석";
  const albumDate = "2024.02.13";
  const albumDuration = "26분";
  const songs = [
    { title: "은혜 아래 있네", artist: "아이자야씩스티원" },
    { title: "I’m Not Ashamed", artist: "아이자야씩스티원" },
    { title: "Celebrate (Live)", artist: "아이자야씩스티원" },
    { title: "온 우주 전에", artist: "아이자야씩스티원" },
  ];

  return (
    <AnimatePresence mode="wait">
      <Container>
        <StatusBar />
        <Header>
          <BackButton onClick={handleBackClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6L9 12L15 18"
                stroke="#545F71"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </BackButton>
          <IconContainer>
            <HeartIcon />
            <OptionsIcon />
          </IconContainer>
        </Header>
        <Content>
          <AlbumDetailContainer>
            <AlbumInfo>
              <AlbumImage src="/images/WhitePiano.png" alt="Album Image" />
              <InfoText>
                <Title>{albumTitle}</Title>
                <Subtitle>{albumSubtitle}</Subtitle>
                <SongInfo>{`${songs.length}곡 • ${albumDuration} • ${albumDate}`}</SongInfo>
              </InfoText>
            </AlbumInfo>
            <SongList>
              {songs.map((song, index) => (
                <SongItem key={index}>
                  <div>{song.title}</div>
                  <div>{song.artist}</div>
                </SongItem>
              ))}
            </SongList>
          </AlbumDetailContainer>
        </Content>
        <SafariSpace $isFocused={false} />
      </Container>
    </AnimatePresence>
  );
};

export default ContiDetail;
