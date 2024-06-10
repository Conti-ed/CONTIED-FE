import ContiPlaceholder from "../components/ContiPlaceholder";
import React from "react";
import {
  Container,
  Content,
  StatusBar,
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
  Footer,
  FooterButton,
  SafariSpace,
} from "../styles/Home.styles";
import { AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const Home: React.FC = () => {
  const userName = "준석"; // 사용자 이름
  const albumTitle = "동계수련회"; // 앨범 제목

  const [activeButton, setActiveButton] = React.useState("home");

  const [hoveredButton, setHoveredButton] = React.useState<string | null>(null);
  const handleMouseEnter = (buttonName: string) => {
    setHoveredButton(buttonName);
  };
  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  return (
    <AnimatePresence mode="wait">
      <Container
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
      >
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
          <AlbumContainer>
            <ContiPlaceholder size={360} />
            <Mask />
            <RoundLogo>
              <RoundLogoImage src="/images/WhitePiano.png" alt="Round Logo" />
            </RoundLogo>
            <Title>{albumTitle}</Title>
          </AlbumContainer>
          <SectionTitle>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 17V4L19 1V14M7 17C7 18.1046 5.65685 19 4 19C2.34315 19 1 18.1046 1 17C1 15.8954 2.34315 15 4 15C5.65685 15 7 15.8954 7 17ZM19 14C19 15.1046 17.6569 16 16 16C14.3431 16 13 15.1046 13 14C13 12.8954 14.3431 12 16 12C17.6569 12 19 12.8954 19 14ZM7 8L19 5"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            &nbsp;간편하게&nbsp;<span>콘티</span>&nbsp;만들기
          </SectionTitle>
          <ButtonGroup>
            <Button
              $hoverColor="#94b4ed"
              onMouseEnter={() => handleMouseEnter("내가?")}
              onMouseLeave={handleMouseLeave}
              $isHovered={hoveredButton === "내가?"}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.83268 3.83334H3.99935C2.71068 3.83334 1.66602 4.87801 1.66602 6.16667V19C1.66602 20.2887 2.71068 21.3333 3.99935 21.3333H16.8327C18.1213 21.3333 19.166 20.2887 19.166 19V13.1667M17.5161 2.18342C18.4273 1.27219 19.9047 1.27219 20.8159 2.18342C21.7272 3.09464 21.7272 4.57203 20.8159 5.48325L10.7992 15.5H7.49935L7.49935 12.2002L17.5161 2.18342Z"
                  stroke="#1468E6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {hoveredButton === "내가?" ? "내가 !" : "내가?"}
            </Button>
            <Button
              $hoverColor="#C194ED"
              onMouseEnter={() => handleMouseEnter("AI가?")}
              onMouseLeave={handleMouseLeave}
              $isHovered={hoveredButton === "AI가?"}
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
              {hoveredButton === "AI가?" ? "AI가 !" : "AI가?"}
            </Button>
            <Button
              $hoverColor="#ED94AB"
              $hoverFillPath
              onMouseEnter={() => handleMouseEnter("유튜브가?")}
              onMouseLeave={handleMouseLeave}
              $isHovered={hoveredButton === "유튜브가?"}
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
              {hoveredButton === "유튜브가?" ? "유튜브가 !" : "유튜브가?"}
            </Button>
          </ButtonGroup>
        </Content>
        <Footer>
          <FooterButton
            $active={activeButton === "home"}
            onClick={() => setActiveButton("home")}
          >
            <svg
              width="22"
              height="23"
              viewBox="0 0 22 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.9264 0.983398L11.5221 1.71381L11.9905 2.28818C14.3965 5.23858 17.0561 7.97063 19.9379 10.4534H20.3783V10.8295C20.877 11.2514 21.3822 11.6659 21.8937 12.0729L20.9597 13.2467C20.765 13.0918 20.5712 12.9358 20.3783 12.7788V21.5791V22.5791H18.8783H14.0863V22.5795H12.5863H9.2948H7.7948V22.5791H3.00378H1.50378V21.5791V12.7967C1.30688 12.9511 1.10892 13.1042 0.909904 13.2561L0 12.0636C0.508368 11.6757 1.0097 11.2791 1.50378 10.8742V10.4534H2.01095C4.99491 7.94753 7.70652 5.13061 10.0991 2.04894L10.6175 2.45144L10.0991 2.04894L10.3484 1.72785L10.9264 0.983398ZM14.0863 21.5791V21.0795V14.1585V12.6585H12.5863H9.2948H7.7948V14.1585V21.0795V21.5791H3.00378V11.5784C3.05323 11.5368 3.10261 11.4952 3.15191 11.4534H3.60144V11.0687C6.28606 8.74689 8.74799 6.17623 10.9538 3.38995C13.1919 6.11774 15.6425 8.66172 18.2817 10.9984V11.4534H18.801L18.8783 11.5204V21.5791H14.0863ZM9.2948 14.1585H12.5863V21.0795H9.2948V14.1585Z"
                fill="#8C8C8C"
              />
            </svg>
            홈
          </FooterButton>
          <FooterButton
            $active={activeButton === "search"}
            onClick={() => setActiveButton("search")}
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.93564 16.8029C12.7718 16.8029 15.8713 13.7041 15.8713 9.89413C15.8713 6.08419 12.7718 2.98535 8.93564 2.98535C5.09951 2.98535 2 6.08419 2 9.89413C2 13.7041 5.09951 16.8029 8.93564 16.8029ZM15.4005 16.0442C16.9313 14.4452 17.8713 12.2791 17.8713 9.89413C17.8713 4.97395 13.8707 0.985352 8.93564 0.985352C4.00062 0.985352 0 4.97395 0 9.89413C0 14.8143 4.00062 18.8029 8.93564 18.8029C10.8968 18.8029 12.7104 18.173 14.184 17.1051L15.3167 18.2343L18.8646 21.7716C19.4067 22.312 20.1153 22.5854 20.8257 22.5915C21.5526 22.5978 22.2814 22.3245 22.836 21.7716L21.4197 20.3595L17.8718 16.8223C17.3297 16.2818 16.6211 16.0085 15.9107 16.0023C15.74 16.0009 15.5692 16.0148 15.4005 16.0442ZM6.11995 8.15692C6.02137 8.3942 5.9707 8.64832 5.9707 8.9048H3.9707C3.9707 8.38484 4.07343 7.86996 4.27301 7.38958C4.47259 6.9092 4.76512 6.47271 5.1339 6.10504C5.50268 5.73737 5.94048 5.44572 6.42231 5.24674C6.90414 5.04776 7.42057 4.94534 7.9421 4.94534V6.94534C7.68238 6.94534 7.42534 6.99635 7.18571 7.09531C6.9461 7.19426 6.72877 7.33914 6.54598 7.52138C6.36321 7.70361 6.21854 7.91961 6.11995 8.15692Z"
                fill="#8C8C8C"
              />
            </svg>
            검색
          </FooterButton>
          <FooterButton
            $active={activeButton === "my"}
            onClick={() => setActiveButton("my")}
          >
            <svg
              width="30"
              height="7"
              viewBox="0 0 30 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 4.9429C3.55797 4.9429 4 4.49355 4 3.95192C4 3.41029 3.55797 2.96094 3 2.96094C2.44203 2.96094 2 3.41029 2 3.95192C2 4.49355 2.44203 4.9429 3 4.9429ZM3 6.9429C4.65685 6.9429 6 5.60379 6 3.95192C6 2.30005 4.65685 0.960938 3 0.960938C1.34315 0.960938 0 2.30005 0 3.95192C0 5.60379 1.34315 6.9429 3 6.9429ZM14.9999 4.9429C15.5579 4.9429 15.9999 4.49355 15.9999 3.95192C15.9999 3.41029 15.5579 2.96094 14.9999 2.96094C14.442 2.96094 13.9999 3.41029 13.9999 3.95192C13.9999 4.49355 14.442 4.9429 14.9999 4.9429ZM14.9999 6.9429C16.6568 6.9429 18 5.60379 18 3.95192C18 2.30005 16.6568 0.960938 14.9999 0.960938C13.3431 0.960938 11.9999 2.30005 11.9999 3.95192C11.9999 5.60379 13.3431 6.9429 14.9999 6.9429ZM27.9999 3.95192C27.9999 4.49355 27.5579 4.9429 26.9999 4.9429C26.4419 4.9429 25.9999 4.49355 25.9999 3.95192C25.9999 3.41029 26.4419 2.96094 26.9999 2.96094C27.5579 2.96094 27.9999 3.41029 27.9999 3.95192ZM29.9999 3.95192C29.9999 5.60379 28.6568 6.9429 26.9999 6.9429C25.343 6.9429 23.9999 5.60379 23.9999 3.95192C23.9999 2.30005 25.343 0.960938 26.9999 0.960938C28.6568 0.960938 29.9999 2.30005 29.9999 3.95192Z"
                fill="#8C8C8C"
              />
            </svg>
            MY
          </FooterButton>
        </Footer>
        <SafariSpace />
      </Container>
    </AnimatePresence>
  );
};

export default Home;
