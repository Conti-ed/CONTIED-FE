import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Mask,
  RoundLogo,
  RoundLogoImage,
  Title,
  SectionTitle,
  ButtonGroup,
  Button,
  AlbumThumbnail,
} from "../styles/Home.styles";
import { LoadingSpinner } from "../styles/LoadingSpinner";
import Icon from "../components/Icon";

const Home: React.FC = () => {
  const userName = "준석"; // 사용자 이름
  const navigate = useNavigate();

  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<string | null>(null);
  const [contiList, setContiList] = useState<any[]>([]);
  const [selectedConti, setSelectedConti] = useState<any | null>(null);

  useEffect(() => {
    const storedContiData = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("conti_")) {
        const data = JSON.parse(localStorage.getItem(key)!);
        storedContiData.push(data);
      }
    }
    setContiList(storedContiData);
    if (storedContiData.length > 0) {
      setSelectedConti(
        storedContiData[Math.floor(Math.random() * storedContiData.length)]
      );
    }
  }, []);

  const handleMouseEnter = (buttonName: string) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleAlbumClick = (id: string) => {
    navigate(`/conti-detail/${id}`);
  };

  const handleButtonClick = (buttonName: string) => {
    setIsButtonClicked(buttonName);
    setTimeout(() => {
      navigate(`/upload?source=${buttonName}`);
    }, 1500);
  };

  if (!selectedConti) {
    return null; // 혹은 로딩 스피너를 표시할 수 있습니다.
  }

  const albumTitle = selectedConti.title; // 선택된 앨범의 제목
  const albumThumbnail = selectedConti.thumbnail;

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
          <AlbumContainer onClick={() => handleAlbumClick(selectedConti.id)}>
            {albumThumbnail !== "/images/WhitePiano.png" ? (
              <AlbumThumbnail src={albumThumbnail} alt="Album Image" />
            ) : (
              <ContiPlaceholder size={360} />
            )}
            <Mask />
            <RoundLogo>
              <RoundLogoImage src="/images/WhitePiano.png" alt="Round Logo" />
            </RoundLogo>
            <Title>{albumTitle}</Title>
          </AlbumContainer>
          <SectionTitle>
            <Icon id="note" width="20" height="20" />
            &nbsp;간편하게&nbsp;<span>콘티</span>&nbsp;만들기
          </SectionTitle>
          <ButtonGroup>
            <Button
              $hoverColor="#94b4ed"
              onMouseEnter={() => handleMouseEnter("내가?")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleButtonClick("내가?")}
              $isHovered={
                hoveredButton === "내가?" || isButtonClicked === "내가?"
              }
              $isClicked={isButtonClicked === "내가?"}
              disabled={isButtonClicked !== null}
            >
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isButtonClicked === "내가?" ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
                  <path
                    d="M9.83268 3.83334H3.99935C2.71068 3.83334 1.66602 4.87801 1.66602 6.16667V19C1.66602 20.2887 2.71068 21.3333 3.99935 21.3333H16.8327C18.1213 21.3333 19.166 20.2887 19.166 19V13.1667M17.5161 2.18342C18.4273 1.27219 19.9047 1.27219 20.8159 2.18342C21.7272 3.09464 21.7272 4.57203 20.8159 5.48325L10.7992 15.5H7.49935L7.49935 12.2002L17.5161 2.18342Z"
                    stroke="#1468E6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isButtonClicked === "내가?" ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: "absolute" }}
              >
                <LoadingSpinner color="#4f8eec" />
              </motion.div>
              {hoveredButton === "내가?" ? "내가 !" : "내가?"}
            </Button>
            <Button
              $hoverColor="#C194ED"
              onMouseEnter={() => handleMouseEnter("AI가?")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleButtonClick("AI가?")}
              $isHovered={
                hoveredButton === "AI가?" || isButtonClicked === "AI가?"
              }
              $isClicked={isButtonClicked === "AI가?"}
              disabled={isButtonClicked !== null}
            >
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isButtonClicked === "AI가?" ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 21C18 21.5523 17.5523 22 17 22C16.4477 22 16 21.5523 16 21C16 20.4477 16.4477 20 17 20C17.5523 20 18 20.4477 18 21Z"
                    fill="#8A14E6"
                  />
                  <path
                    d="M22 17C22 17.5523 21.5523 18 21 18C20.4477 18 20 17.5523 20 17C20 16.4477 20.4477 16 21 16C21.5523 16 22 16.4477 22 17Z"
                    fill="#8A14E6"
                  />
                  <path
                    d="M2 5C2 5.55228 1.55228 6 1 6C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4C1.55228 4 2 4.44772 2 5Z"
                    fill="#8A14E6"
                  />
                  <path
                    d="M6 1C6 1.55228 5.55228 2 5 2C4.44772 2 4 1.55228 4 1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1Z"
                    fill="#8A14E6"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11 5.48292L10.3478 8.17257C10.0871 9.24768 9.24768 10.0871 8.17257 10.3478L5.48292 11L8.17257 11.6522C9.24768 11.9129 10.0871 12.7523 10.3478 13.8274L11 16.5171L11.6522 13.8274C11.9129 12.7523 12.7523 11.9129 13.8274 11.6522L16.5171 11L13.8274 10.3478C12.7523 10.0871 11.9129 9.24768 11.6522 8.17257L11 5.48292ZM12.3052 4.02656C11.9733 2.65781 10.0267 2.65781 9.69476 4.02656L8.78151 7.79277C8.66301 8.28146 8.28146 8.66301 7.79277 8.78151L4.02656 9.69476C2.65781 10.0267 2.65781 11.9733 4.02656 12.3052L7.79277 13.2185C8.28146 13.337 8.66301 13.7185 8.78151 14.2072L9.69476 17.9734C10.0267 19.3422 11.9733 19.3422 12.3052 17.9734L13.2185 14.2072C13.337 13.7185 13.7185 13.337 14.2072 13.2185L17.9734 12.3052C19.3422 11.9733 19.3422 10.0267 17.9734 9.69476L14.2072 8.78151C13.7185 8.66301 13.337 8.28146 13.2185 7.79277L12.3052 4.02656Z"
                    fill="#8A14E6"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.00462 21.3147C7.83081 21.7804 7.31241 22.017 6.84673 21.8432C3.8303 20.7173 1.40732 18.3801 0.169734 15.4228C-0.0221526 14.9643 0.194 14.4371 0.652524 14.2452C1.11105 14.0533 1.63831 14.2694 1.8302 14.728C2.8762 17.2274 4.92654 19.2052 7.47615 20.1568C7.94183 20.3306 8.17843 20.849 8.00462 21.3147Z"
                    fill="#8A14E6"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21.3153 8.02077C20.8498 8.19493 20.3312 7.95873 20.157 7.49319C19.1979 4.92954 17.1971 2.87072 14.6693 1.83251C14.2095 1.64366 13.9899 1.11784 14.1787 0.658056C14.3676 0.198271 14.8934 -0.0213681 15.3532 0.167478C18.3427 1.39533 20.7076 3.82798 21.8429 6.86246C22.0171 7.32801 21.7809 7.8466 21.3153 8.02077Z"
                    fill="#8A14E6"
                  />
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isButtonClicked === "AI가?" ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: "absolute" }}
              >
                <LoadingSpinner color="#9e41e6" />
              </motion.div>
              {hoveredButton === "AI가?" ? "AI가 !" : "AI가?"}
            </Button>
            <Button
              $hoverColor="#ED94AB"
              $hoverFillPath
              onMouseEnter={() => handleMouseEnter("유튜브가?")}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleButtonClick("유튜브가?")}
              $isHovered={
                hoveredButton === "유튜브가?" || isButtonClicked === "유튜브가?"
              }
              $isClicked={isButtonClicked === "유튜브가?"}
              disabled={isButtonClicked !== null}
            >
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isButtonClicked === "유튜브가?" ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_993_4479)">
                    <rect
                      x="5"
                      y="1"
                      width="18"
                      height="18"
                      stroke="#E61414"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 10L10.5 14.3301L10.5 5.66987L18 10Z"
                      fill="#E61414"
                      className="specific-fill"
                    />
                    <path d="M1 5V23H19" stroke="#E61414" strokeWidth="2" />
                  </g>
                  <defs>
                    <clipPath id="clip0_993_4479">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isButtonClicked === "유튜브가?" ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: "absolute" }}
              >
                <LoadingSpinner color="#E61414" />
              </motion.div>
              {hoveredButton === "유튜브가?" ? "유튜브가 !" : "유튜브가?"}
            </Button>
          </ButtonGroup>
        </Content>
        <TabBar />
        <SafariSpace $isFocused={false} />
      </Container>
    </AnimatePresence>
  );
};

export default Home;
