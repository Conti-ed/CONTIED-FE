import React from "react";
import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

const SkeletonHeader = styled.div`
  height: 67px;
  width: 100%;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.7px solid #d9d9d9;
`;

const HeaderIconSkeleton = styled(SkeletonBase)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const AlbumInfoSkeleton = styled.div`
  display: flex;
  align-items: center;
  margin-top: 19px;
  padding: 23px;
`;

const AlbumImageSkeleton = styled(SkeletonBase)`
  width: 129px;
  height: 129px;
  border-radius: 20px;
  flex-shrink: 0;
  margin-right: 15px;
`;

const AlbumTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TitleSkeleton = styled(SkeletonBase)`
  width: 140px;
  height: 18px;
`;

const SubtitleSkeleton = styled(SkeletonBase)`
  width: 90px;
  height: 13px;
`;

const SongInfoSkeleton = styled(SkeletonBase)`
  width: 110px;
  height: 11px;
`;

const DescriptionBoxSkeleton = styled(SkeletonBase)`
  width: 90%;
  height: 50px;
  border-radius: 8px;
  margin: 0 auto 20px auto;
`;

const SongItemSkeleton = styled.div`
  display: flex;
  align-items: center;
  height: 53px;
  padding: 0 20px;
  border-bottom: 1px solid #f3f4f6;
`;

const SongThumbSkeleton = styled(SkeletonBase)`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  flex-shrink: 0;
`;

const SongTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 11px;
  gap: 4px;
`;

const SongTitleSkeleton = styled(SkeletonBase)`
  width: 120px;
  height: 11px;
`;

const SongArtistSkeleton = styled(SkeletonBase)`
  width: 70px;
  height: 8px;
`;

const SongItemSkeletonRow: React.FC = () => (
  <SongItemSkeleton>
    <SongThumbSkeleton />
    <SongTextGroup>
      <SongTitleSkeleton />
      <SongArtistSkeleton />
    </SongTextGroup>
  </SongItemSkeleton>
);

interface ContiDetailSkeletonProps {
  songCount?: number;
}

const ContiDetailSkeleton: React.FC<ContiDetailSkeletonProps> = ({
  songCount = 5,
}) => {
  return (
    <Wrapper>
      <SkeletonHeader>
        <HeaderIconSkeleton />
        <HeaderIconSkeleton />
      </SkeletonHeader>

      <AlbumInfoSkeleton>
        <AlbumImageSkeleton />
        <AlbumTextGroup>
          <TitleSkeleton />
          <SubtitleSkeleton />
          <SongInfoSkeleton />
        </AlbumTextGroup>
      </AlbumInfoSkeleton>

      <DescriptionBoxSkeleton />

      {Array.from({ length: songCount }).map((_, i) => (
        <SongItemSkeletonRow key={i} />
      ))}
    </Wrapper>
  );
};

export default ContiDetailSkeleton;
