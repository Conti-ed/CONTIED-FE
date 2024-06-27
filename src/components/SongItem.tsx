import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import SongPlaceholder from "./SongPlaceholder";
import Icon from "./Icon";

const SongItemContainer = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f3f4f6;

  &:first-of-type {
    border-top: 1px solid #f3f4f6;
  }
`;

const SongImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 23px;
  margin-right: 20px; /* InfoText와의 간격 */
  border: 1px solid #9dbbe9;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: sticky;
`;

const SongInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 53px;
  padding-left: 20px;
  padding-right: 20px;

  & > div {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  & > .song-info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  & > .song-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 3px;
  }

  img {
    width: 42px;
    height: auto;
    border-radius: 10px;
  }
`;

const OptionsContainer = styled(motion.div)`
  display: flex;
  background-color: #f9f9f9;
  border: 1px solid rgba(23, 26, 31, 0.1);
  justify-content: center;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  font-weight: 300;
  color: #8c8c8c;
  gap: 6px; /* 아이콘과 텍스트 간의 간격 */
  width: 110px;
  padding: 3px;
`;

const OptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px; /* 아이콘 크기 고정 */
`;

const OptionText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SongImage = styled.img`
  position: absolute;
  width: auto;
  height: 20px;
`;

const SongSummary = styled.div`
  margin-left: 11px;
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

const LyricsContainer = styled(motion.div)`
  width: 100vw;
  border: 2px solid #9dbbe9;
`;

const Lyrics = styled.div`
  padding: 24px;
  font-size: 12px;
  line-height: 1.3;
  color: rgba(23, 26, 31, 0.8);
  text-align: center;
`;

const SongItem = ({
  song,
}: {
  song: { title: string; artist: string; thumbnail: string; lyrics: string };
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
  };

  return (
    <SongItemContainer>
      <SongInfo>
        <div>
          <SongImageWrapper>
            {song.thumbnail ? (
              <SongImage src={song.thumbnail} alt="Image" />
            ) : (
              <SongPlaceholder />
            )}
          </SongImageWrapper>
          <SongSummary className="song-info">
            <SongTitle>{song.title}</SongTitle>
            <SongArtistName>{song.artist}</SongArtistName>
          </SongSummary>
        </div>
        <div className="song-button" onClick={toggleOptions}>
          <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
            <path
              d={isOpen ? "M1 8L8 1L15 8" : "M1 1L8 8L15 1"}
              stroke="#8C8C8C"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </SongInfo>
      <AnimatePresence>
        {isOpen && (
          <OptionsContainer
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Option>
              <OptionIcon>
                <Icon id="add-songitem" width="20" height="16" />
              </OptionIcon>
              <OptionText>내 콘티에 추가</OptionText>
            </Option>
            <Option onClick={toggleLyrics}>
              <OptionIcon>
                <Icon id="lyrics-songitem" width="20" height="20" />
              </OptionIcon>
              <OptionText>가사</OptionText>
            </Option>
            <Option>
              <OptionIcon>
                <Icon id="info-songitem" width="30" height="6" />
              </OptionIcon>
              <OptionText>곡 정보</OptionText>
            </Option>
          </OptionsContainer>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showLyrics && (
          <LyricsContainer
            key="lyrics"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Lyrics>{song.lyrics || "가사가 아직 제공되지 않았어요."}</Lyrics>
          </LyricsContainer>
        )}
      </AnimatePresence>
    </SongItemContainer>
  );
};

export default SongItem;
