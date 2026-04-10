import styled from "styled-components";
import SongPlaceholder from "./SongPlaceholder";
import React, { useRef, useEffect } from "react";

const SongItemContainer = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 14px;
  margin-bottom: 14px;

  &:first-of-type {
    border-top: 1px solid #f3f4f6;
    padding-top: 14px;
  }
`;

const SongImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 23px;
  margin-right: 20px;
  border: 1px solid #9dbbe9;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;
  position: relative; /* SongImage(absolute)의 기준점 — 없으면 스크롤 시 이미지가 따라다님 */
`;

const SongInfo = styled.div`
  display: flex;
  height: 53px;
  padding: 0 20px;
  justify-content: space-between;

  & > div:first-child {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex: 1;
    overflow: hidden;
  }

  & > .song-button {
    flex: 0 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  img {
    width: 42px;
    height: auto;
    border-radius: 10px;
  }
`;

const SongImage = styled.img`
  position: absolute;
  width: auto;
  height: 20px;
`;

const SongSummary = styled.div`
  margin-left: 11px;
  flex: 1;
  overflow: hidden;
`;

const SongTitle = styled.div`
  font-size: 11px;
  font-weight: 300;
  color: rgba(23, 26, 31, 0.8);
  margin-bottom: 4px;
`;

const SongArtistName = styled.div`
  font-size: 8px;
  font-weight: 300;
  color: rgba(23, 26, 31, 0.5);
`;

/* 바깥쪽: overflow: hidden + max-height transition → 접힘/펼침 애니메이션 담당 */
const LyricsWrapper = styled.div<{ $isOpen: boolean }>`
  margin-top: 9px;
  margin-bottom: 4px;
  overflow: hidden;
  max-height: ${({ $isOpen }) => ($isOpen ? "220px" : "40px")};
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* 안쪽: 펼쳐졌을 때 스크롤 담당 */
const LyricsScroll = styled.div<{ $isOpen: boolean }>`
  padding: 0 24px;
  max-height: ${({ $isOpen }) => ($isOpen ? "200px" : "none")};
  overflow-y: ${({ $isOpen }) => ($isOpen ? "auto" : "visible")};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 10px;
  }
`;

const Lyrics = styled.div`
  font-size: 12px;
  font-weight: 300;
  line-height: 1.6;
  color: rgba(23, 26, 31, 0.8);
  white-space: pre-wrap;
`;

const Highlight = styled.span`
  color: #4f8eec;
  font-weight: 600;
  background-color: rgba(79, 142, 236, 0.1);
  border-radius: 4px;
  padding: 0 2px;
`;

interface LyricsOnlySongItemProps {
  song: { title: string; artist: string; thumbnail: string; lyrics: string };
  searchQuery?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const LyricsOnlySongItem = ({
  song,
  searchQuery = "",
  isOpen = false,
  onToggle,
}: LyricsOnlySongItemProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 접힐 때: 스크롤 위치를 맨 위로 즉시 복귀시켜
  // "보던 곳에서 접혀서 고정되는" 문제를 방지
  useEffect(() => {
    if (!isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/images/WhitePiano.png";
    e.currentTarget.style.height = "16px";
    e.currentTarget.style.width = "auto";
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    // 특수문자 이스케이프 (정규식 에러 방지)
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? <Highlight key={index}>{part}</Highlight> : part
    );
  };

  const getDisplayLyrics = () => {
    const rawLyrics = song.lyrics || "가사가 아직 제공되지 않았어요.";

    // 펼쳐져 있으면 전체 가사
    if (isOpen) return rawLyrics;

    // 검색어가 없으면 원본 그대로 (max-height가 잘라줌)
    if (!searchQuery) return rawLyrics;

    // 검색어가 있으면 해당 줄부터 보여주기
    const lines = rawLyrics.split("\n");
    const matchLineIndex = lines.findIndex((line) =>
      line.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchLineIndex > 0) {
      const contextualLines = lines.slice(matchLineIndex);
      return "...\n" + contextualLines.join("\n");
    }

    return rawLyrics;
  };

  return (
    <SongItemContainer>
      <SongInfo>
        <div>
          <SongImageWrapper>
            {song.thumbnail ? (
              <SongImage
                src={song.thumbnail}
                alt="Image"
                loading="lazy"
                onError={handleImgError}
              />
            ) : (
              <SongPlaceholder />
            )}
          </SongImageWrapper>
          <SongSummary className="song-info">
            <SongTitle>{highlightText(song.title, searchQuery)}</SongTitle>
            <SongArtistName>
              {highlightText(song.artist, searchQuery)}
            </SongArtistName>
          </SongSummary>
        </div>
        <div className="song-button" onClick={onToggle}>
          <svg
            width="16"
            height="9"
            viewBox="0 0 16 9"
            fill="none"
            style={{
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path
              d="M1 1L8 8L15 1"
              stroke="#8C8C8C"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </SongInfo>
      <LyricsWrapper $isOpen={isOpen}>
        <LyricsScroll ref={scrollRef} $isOpen={isOpen}>
          <Lyrics>
            {highlightText(getDisplayLyrics(), searchQuery)}
          </Lyrics>
        </LyricsScroll>
      </LyricsWrapper>
    </SongItemContainer>
  );
};

export default LyricsOnlySongItem;


