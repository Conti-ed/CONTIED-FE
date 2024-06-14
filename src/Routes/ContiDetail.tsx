import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import StatusBar from "../components/StatusBar";
import SafariSpace from "../components/SafariSpace";
import ContiPlaceholder from "../components/ContiPlaceholder";
import SongList from "../components/SongList";
import {
  AddIcon,
  AddSongContainer,
  AlbumDetailContainer,
  AlbumImage,
  AlbumImageWrapper,
  AlbumInfo,
  BackButton,
  Container,
  Content,
  Header,
  HeartIcon,
  IconContainer,
  InfoText,
  SongInfo,
  Subtitle,
  Title,
} from "../styles/ContiDetail.styles";

const OptionsIcon = () => (
  <svg width="15" height="3" viewBox="0 0 15 3" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.49999 1.99998C1.77612 1.99998 1.99998 1.77612 1.99998 1.49999C1.99998 1.22385 1.77612 1 1.49999 1C1.22385 1 1 1.22385 1 1.49999C1 1.77612 1.22385 1.99998 1.49999 1.99998ZM1.49999 2.99998C2.32841 2.99998 2.99998 2.32841 2.99998 1.49999C2.99998 0.671567 2.32841 0 1.49999 0C0.671567 0 0 0.671567 0 1.49999C0 2.32841 0.671567 2.99998 1.49999 2.99998ZM7.67638 2.00012C7.95251 2.00012 8.17636 1.77626 8.17636 1.50013C8.17636 1.22399 7.95251 1.00014 7.67638 1.00014C7.40024 1.00014 7.17639 1.22399 7.17639 1.50013C7.17639 1.77626 7.40024 2.00012 7.67638 2.00012ZM7.67638 3.00012C8.5048 3.00012 9.17636 2.32855 9.17636 1.50013C9.17636 0.671707 8.5048 0.000139432 7.67638 0.000139432C6.84796 0.000139432 6.17639 0.671707 6.17639 1.50013C6.17639 2.32855 6.84796 3.00012 7.67638 3.00012ZM14.0003 1.50013C14.0003 1.77626 13.7765 2.00012 13.5003 2.00012C13.2242 2.00012 13.0004 1.77626 13.0004 1.50013C13.0004 1.22399 13.2242 1.00014 13.5003 1.00014C13.7765 1.00014 14.0003 1.22399 14.0003 1.50013ZM15.0003 1.50013C15.0003 2.32855 14.3288 3.00012 13.5003 3.00012C12.6719 3.00012 12.0004 2.32855 12.0004 1.50013C12.0004 0.671707 12.6719 0.000139432 13.5003 0.000139432C14.3288 0.000139432 15.0003 0.671707 15.0003 1.50013Z"
      fill="#171A1F"
      fillOpacity="0.5"
    />
  </svg>
);

const ContiDetail: React.FC = () => {
  const navigate = useNavigate();
  const { contiId } = useParams<{ contiId: string }>();
  const [contiData, setContiData] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const storedConti = localStorage.getItem(`conti_${contiId}`);
    console.log(storedConti);
    if (storedConti) {
      setContiData(JSON.parse(storedConti));
    } else {
      console.error("Conti not found");
    }
  }, [contiId]);

  if (!contiData) {
    return <div>콘티가 존재하지 않는 것 같아요...</div>;
  }

  const handleHeartClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <AnimatePresence mode="wait">
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
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
            <HeartIcon
              $isFavorite={isFavorite}
              onClick={handleHeartClick}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F8EEC"
            >
              <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path>
            </HeartIcon>
            <OptionsIcon />
          </IconContainer>
        </Header>
        <Content>
          <AlbumDetailContainer>
            <AlbumInfo>
              <AlbumImageWrapper>
                <ContiPlaceholder size={129} />
                <AlbumImage src={contiData.thumbnail} alt="Album Image" />
              </AlbumImageWrapper>
              <InfoText>
                <Title>{contiData.title}</Title>
                <Subtitle>{contiData.ownerName}</Subtitle>
                <SongInfo>{`${contiData.songs.length}곡 • ${contiData.duration}분 • ${contiData.createdDate}`}</SongInfo>
              </InfoText>
            </AlbumInfo>
            <SongList songs={contiData.songs} />
            <AddSongContainer>
              <AddIcon width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M5 1V9M9 5L1 5"
                  stroke="#9095A1"
                  strokeOpacity="0.631373"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </AddIcon>
              곡 추가
            </AddSongContainer>
          </AlbumDetailContainer>
        </Content>
        <SafariSpace $isFocused={false} />
      </Container>
    </AnimatePresence>
  );
};

export default ContiDetail;
