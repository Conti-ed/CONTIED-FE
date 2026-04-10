import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 50%,
    #f3f4f6 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
`;

// Song Item Skeleton components
const SongSkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  height: 53px;
  padding: 0 20px;
  border-bottom: 1px solid #f3f4f6;
  width: 100%;
`;

const SongThumbSkeleton = styled(SkeletonBase)`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const SongTextSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 11px;
  flex: 1;
`;

const SongTitleSkeleton = styled(SkeletonBase)`
  width: 40%;
  height: 11px;
  margin-bottom: 4px;
`;

const SongArtistSkeleton = styled(SkeletonBase)`
  width: 25%;
  height: 8px;
`;

export const SongSkeleton: React.FC = () => (
  <SongSkeletonContainer>
    <SongThumbSkeleton />
    <SongTextSkeletonWrapper>
      <SongTitleSkeleton />
      <SongArtistSkeleton />
    </SongTextSkeletonWrapper>
  </SongSkeletonContainer>
);

// Conti Item Skeleton components
const ContiSkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 90vw;
  margin: 0 auto 15px auto;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
`;

const ContiThumbSkeleton = styled(SkeletonBase)`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  flex-shrink: 0;
`;

const ContiInfoSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13px;
  flex: 1;
`;

const ContiTitleSkeleton = styled(SkeletonBase)`
  width: 60%;
  height: 15px;
  margin-bottom: 7px;
`;

const ContiSubtitleSkeleton = styled(SkeletonBase)`
  width: 40%;
  height: 13px;
  margin-bottom: 7px;
`;

const ContiSongInfoSkeleton = styled(SkeletonBase)`
  width: 70%;
  height: 11px;
`;

export const ContiSkeleton: React.FC = () => (
  <ContiSkeletonContainer>
    <ContiThumbSkeleton />
    <ContiInfoSkeleton>
      <ContiTitleSkeleton />
      <ContiSubtitleSkeleton />
      <ContiSongInfoSkeleton />
    </ContiInfoSkeleton>
  </ContiSkeletonContainer>
);

// Home Component Skeletons
const HomeWelcomeSkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin-left: 10px;
  margin-bottom: 24px;
`;

const UserNameSkeleton = styled(SkeletonBase)`
  width: 200px;
  height: 22px;
  margin-bottom: 8px;
`;

const StatsTextSkeleton = styled(SkeletonBase)`
  width: 150px;
  height: 15px;
`;

export const HomeWelcomeSkeleton: React.FC = () => (
  <HomeWelcomeSkeletonContainer>
    <UserNameSkeleton />
    <StatsTextSkeleton />
  </HomeWelcomeSkeletonContainer>
);

export const HomeAlbumSkeleton = styled(SkeletonBase)`
  width: 360px;
  height: 360px;
  border-radius: 20px;
  margin-bottom: 29px;
  flex-shrink: 0;
`;

const ButtonGroupSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 360px;
  margin-bottom: 29px;
`;

const ButtonSkeleton = styled(SkeletonBase)`
  width: 31%;
  height: 95px;
  border-radius: 16px;
`;

export const HomeButtonSkeleton: React.FC = () => (
  <ButtonGroupSkeleton>
    <ButtonSkeleton />
    <ButtonSkeleton />
    <ButtonSkeleton />
  </ButtonGroupSkeleton>
);

// Search Suggestion Skeleton
export const SuggestionSkeleton = styled(SkeletonBase)`
  display: inline-block;
  padding: 8px 18px;
  height: 35px;
  width: ${() => Math.floor(Math.random() * (100 - 60 + 1) + 60)}px;
  border-radius: 24px;
  margin: 5px;
`;

export const SuggestionSkeletonList: React.FC<{ count?: number }> = ({ count = 10 }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '320px' }}>
    {Array.from({ length: count }).map((_, i) => (
      <SuggestionSkeleton key={i} />
    ))}
  </div>
);

// Grouping components
const Stack = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const SongSkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <Stack>
    {Array.from({ length: count }).map((_, i) => (
      <SongSkeleton key={i} />
    ))}
  </Stack>
);

export const ContiSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <Stack>
    {Array.from({ length: count }).map((_, i) => (
      <ContiSkeleton key={i} />
    ))}
  </Stack>
);
