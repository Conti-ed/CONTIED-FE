import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useMemo, memo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import ContiPlaceholder from "../components/ContiPlaceholder";
import {
  Container,
  Content,
  Header,
  Logo,
  WelcomeSection,
  UserName,
  StatsText,
  HighlightCount,
  AlbumContainer,
  AlbumThumbnail,
  Mask,
  RoundLogo,
  RoundLogoImage,
  TransitionTitle,
  SectionTitle,
  ButtonGroup,
  ShuffleButton,
  BadgeContainer,
  BadgePill,
  RecentSection,
  RecentHeader,
  RecentTitle,
  RecentList,
  RecentItem,
  RecentImageWrapper,
  RecentImage,
  RecentInfo,
  RecentContiTitle,
  RecentSubtitle,
  RecentSongInfo,
} from "../styles/Home.styles";
import {
  HomeWelcomeSkeleton,
  HomeAlbumSkeleton,
  HomeButtonSkeleton,
  ContiSkeletonList,
} from "../components/Skeleton";
import { useHomeLogic } from "../hooks/useHomeLogic";
import { BUTTONS } from "../constants/homeConstants";
import { HomeButton } from "../components/HomeButton";
import { useAdaptiveTextColor } from "../hooks/useAdaptiveTextColor";
import { getUserProfile } from "../utils/axios";
import { HiRefresh } from "react-icons/hi";
import { FiMusic, FiClock, FiCalendar } from "react-icons/fi";
import Icon from "../components/Icon";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../utils/formatDuration";

const getGreetingMessage = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `좋은 아침이에요`;
  if (hour >= 12 && hour < 17) return `나른한 오후네요`;
  if (hour >= 17 && hour < 22) return `찬양 한 곡 어때요`;
  return `오늘 하루 고생 많으셨어요`;
};

const CountUp = memo(({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <HighlightCount>{rounded}</HighlightCount>;
});

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userProfile, isLoading: isProfileLoading } = useQuery("userProfile", getUserProfile, {
    staleTime: 1000 * 60 * 30, // 30분 캐시
  });
  const userName = userProfile?.nickname;

  const {
    contiList,
    isContiLoading,
    selectedConti,
    hoveredButton,
    isButtonClicked,
    handleMouseEnter,
    handleMouseLeave,
    handleAlbumClick,
    handleButtonClick,
    refreshSelectedConti,
  } = useHomeLogic(navigate);

  const defaultImageUrl = "/images/WhitePiano.png";
  const albumThumbnail = selectedConti?.thumbnail || defaultImageUrl;
  const { textColor, isLoading: isColorLoading } = useAdaptiveTextColor(albumThumbnail);

  const albumTitle = selectedConti?.title || "콘티를 등록해볼까요?";
  const albumId = selectedConti?.id;

  const recentContis = useMemo(() => {
    return [...contiList]
      .sort(
        (a, b) =>
          parseLocalDateString(b.updatedAt).getTime() -
          parseLocalDateString(a.updatedAt).getTime()
      )
      .slice(0, 3);
  }, [contiList]);

  const isInitialLoading = isProfileLoading || isContiLoading;

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Content>
          <Header>
            <Logo src="/images/HeaderLogo.png" alt="Contied Logo" />
          </Header>
          
          {isInitialLoading ? (
            <HomeWelcomeSkeleton />
          ) : (
            <WelcomeSection>
              <UserName>
                {getGreetingMessage()}, <span>{userName || "사용자"}</span>님!
              </UserName>
              <StatsText>
                지금까지 <CountUp value={contiList.length} /> 개의 콘티를 만드셨네요!
              </StatsText>
            </WelcomeSection>
          )}

          {isInitialLoading ? (
            <HomeAlbumSkeleton />
          ) : (
            <AlbumContainer
              onClick={albumId ? () => handleAlbumClick(albumId) : undefined}
            >
              <ShuffleButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9, rotate: 180 }}
                onClick={(e) => {
                  e.stopPropagation();
                  refreshSelectedConti();
                }}
              >
                <HiRefresh size={22} />
              </ShuffleButton>
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
                $isLoading={isColorLoading}
              >
                {selectedConti ? albumTitle : "콘티를 등록해볼까요?"}
              </TransitionTitle>
              {selectedConti && (
                <BadgeContainer style={{ color: textColor }}>
                  <BadgePill>
                    <FiMusic size={12} />
                    {selectedConti.ContiToSong?.length || 0}곡
                  </BadgePill>
                  <BadgePill>
                    <FiClock size={12} />
                    {formatTotalDuration(selectedConti.duration || 0)}
                  </BadgePill>
                  <BadgePill>
                    <FiCalendar size={12} />
                    {formatRelativeTime(parseLocalDateString(selectedConti.updatedAt))}
                  </BadgePill>
                </BadgeContainer>
              )}
            </AlbumContainer>
          )}

          <SectionTitle>
            <Icon id="note-home" width="18" height="18" />
            &nbsp;간편하게&nbsp;<span>콘티</span>&nbsp;만들기
          </SectionTitle>
          
          {isInitialLoading ? (
            <HomeButtonSkeleton />
          ) : (
            <ButtonGroup>
              {BUTTONS.map((button) => (
                <HomeButton
                  key={button.name}
                  buttonInfo={button}
                  isHovered={hoveredButton === button.name}
                  isClicked={isButtonClicked === button.name}
                  onMouseEnter={() => handleMouseEnter(button.name)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleButtonClick(button.name)}
                  disabled={isButtonClicked !== null && isButtonClicked !== button.name}
                />
              ))}
            </ButtonGroup>
          )}

          <RecentSection>
            <RecentHeader>
              <RecentTitle>
                <Icon id="note-home" width="18" height="18" />
                &nbsp;최근 작업한&nbsp;<span>콘티</span>
              </RecentTitle>
            </RecentHeader>
            {isInitialLoading ? (
              <ContiSkeletonList count={3} />
            ) : recentContis.length > 0 ? (
              <RecentList>
                {recentContis.map((conti, index) => (
                  <RecentItem
                    key={conti.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAlbumClick(conti.id)}
                  >
                    <RecentImageWrapper>
                      <ContiPlaceholder size={100} />
                      <RecentImage
                        src={conti.thumbnail || defaultImageUrl}
                        alt="Album Image"
                        style={{
                          height:
                            !conti.thumbnail ||
                            conti.thumbnail === defaultImageUrl
                              ? "62px"
                              : "100px",
                        }}
                      />
                    </RecentImageWrapper>
                    <RecentInfo>
                      <RecentContiTitle>{conti.title}</RecentContiTitle>
                      <RecentSubtitle>{userName || "사용자"}</RecentSubtitle>
                      <RecentSongInfo>
                        {`${formatRelativeTime(parseLocalDateString(conti.updatedAt))} • ${formatTotalDuration(conti.duration || 0)}`}
                      </RecentSongInfo>
                    </RecentInfo>
                  </RecentItem>
                ))}
              </RecentList>
            ) : (
              <div style={{ opacity: 0.5, fontSize: '14px', marginTop: '20px' }}>
                아직 생성된 콘티가 없어요.
              </div>
            )}
          </RecentSection>
      </Content>
    </Container>
  );
};

export default Home;
