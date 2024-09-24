import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../api";
import { UserInfo } from "../types";
import StatusBar from "../components/StatusBar";
import ContiPlaceholder from "../components/ContiPlaceholder";
import TabBar from "../components/TabBar";
import SafariSpace from "../components/SafariSpace";
import {
  Container,
  Content,
  Header,
  Logo,
  UserName,
  AlbumContainer,
  AlbumThumbnail,
  Mask,
  RoundLogo,
  RoundLogoImage,
  TransitionTitle,
  SectionTitle,
  ButtonGroup,
} from "../styles/Home.styles";
import Icon from "../components/Icon";
import { useHomeLogic } from "../hooks/useHomeLogic";
import { BUTTONS } from "../constants/homeConstants";
import { HomeButton } from "../components/HomeButton";
import Loading from "../components/Loading";
import { useAdaptiveTextColor } from "../hooks/useAdaptiveTextColor";
import api from "../utils/axios";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  const {
    selectedConti,
    hoveredButton,
    isButtonClicked,
    handleMouseEnter,
    handleMouseLeave,
    handleAlbumClick,
    handleButtonClick,
  } = useHomeLogic(navigate);

  const defaultImageUrl = "/images/WhitePiano.png";
  const albumThumbnail = selectedConti?.thumbnail || defaultImageUrl;
  const { textColor, isLoading } = useAdaptiveTextColor(albumThumbnail);

  useEffect(() => {
    // 백엔드에서 사용자 정보를 가져오는 API 호출
    const fetchUserInfo = async () => {
      try {
        const response = await api.get<UserInfo>(`${SERVER_URL}/users`); // 사용자 정보를 반환하는 API 엔드포인트
        setUserName(response.data.nickname); // 사용자 이름을 상태에 설정
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setUserName("사용자");
      }
    };

    fetchUserInfo();
  }, []);

  if (!selectedConti) {
    return <Loading />;
  }

  const { title: albumTitle, id: albumId } = selectedConti;

  return (
    <AnimatePresence mode="wait">
      <Container>
        <StatusBar />
        <Content>
          <Header>
            <Logo src="/images/HeaderLogo.png" alt="Contied Logo" />
          </Header>
          <UserName>
            <span>{userName}</span> 님의
            <br />
            콘티 리스트
          </UserName>
          <AlbumContainer onClick={() => handleAlbumClick(albumId)}>
            {albumThumbnail !== defaultImageUrl ? (
              <AlbumThumbnail src={albumThumbnail} alt="Album Image" />
            ) : (
              <ContiPlaceholder size={360} />
            )}
            <Mask />
            <RoundLogo>
              <RoundLogoImage src={defaultImageUrl} alt="Round Logo" />
            </RoundLogo>
            <TransitionTitle
              style={{ color: textColor }}
              $isLoading={isLoading}
            >
              {albumTitle}
            </TransitionTitle>
          </AlbumContainer>
          <SectionTitle>
            <Icon id="note-home" width="20" height="20" />
            &nbsp;간편하게&nbsp;<span>콘티</span>&nbsp;만들기
          </SectionTitle>
          <ButtonGroup>
            {BUTTONS.map((button) => (
              <HomeButton
                key={button.name}
                buttonInfo={button}
                isHovered={
                  hoveredButton === button.name ||
                  isButtonClicked === button.name
                }
                isClicked={isButtonClicked === button.name}
                onMouseEnter={() => handleMouseEnter(button.name)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleButtonClick(button.name)}
                disabled={isButtonClicked !== null}
              />
            ))}
          </ButtonGroup>
        </Content>
        <TabBar />
        <SafariSpace $isFocused={false} />
      </Container>
    </AnimatePresence>
  );
};

export default Home;
