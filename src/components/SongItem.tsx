import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import SongPlaceholder from "./SongPlaceholder";
import Icon from "./Icon";
import { formatDuration } from "../utils/formatDuration";
import AddSongToConti from "./Modals/AddSongToConti";

const SongItemContainer = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f3f4f6;
  width: 100%;

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
  width: 100%; // 부모 요소의 너비에 맞춤
  max-height: 170px;
  overflow-y: auto;
  background: linear-gradient(145deg, #f0f4f8, #e1e8ed);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 0 auto; // 중앙 정렬

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0 16px 16px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;

  &.top {
    top: 0;
    background: linear-gradient(
      to bottom,
      rgba(240, 244, 248, 1),
      rgba(240, 244, 248, 0)
    );
    border-radius: 16px 16px 0 0;
    position: sticky;
  }

  &.bottom {
    bottom: 0;
    background: linear-gradient(
      to top,
      rgba(225, 232, 237, 1),
      rgba(225, 232, 237, 0)
    );
    border-radius: 0 0 16px 16px;
    position: sticky;
  }
`;

const LyricsContent = styled.div`
  padding: 10px 16px 6px 16px;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(23, 26, 31, 0.8);
  text-align: center;
`;

const LyricsTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 16px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const LyricsText = styled.p`
  white-space: pre-wrap;
  text-align: left;
  padding: 0 16px;
`;

const NoLyrics = styled.p`
  font-style: italic;
  color: #8c8c8c;
  text-align: center;
`;

const InfoContainer = styled(motion.div)`
  width: 100%;
  max-height: 170px;
  overflow-y: auto;
  background: linear-gradient(145deg, #f0f4f8, #e1e8ed);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 0 auto;
`;

const InfoContent = styled.div`
  padding: 10px 16px 6px 16px;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(23, 26, 31, 0.8);
  text-align: center;
`;

const InfoText = styled.div`
  white-space: pre-wrap;
  text-align: center;
  padding: 0 16px;

  p {
    margin-bottom: 4px;
  }
`;

const EmphasizedText = styled.span`
  color: #4f8eec;
`;

const NoInfo = styled.p`
  font-style: italic;
  color: #8c8c8c;
  text-align: center;
  font-size: 12px;
`;

interface SongItemProps {
  song: {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
    lyrics: string;
    duration: number;
    tempo?: number;
    keyScale?: string;
  };
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const SongItem: React.FC<SongItemProps> = ({ song, isOpen, onToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowLyrics(false);
      setShowInfo(false);
    }
  }, [isOpen]);

  const toggleOptions = () => {
    onToggle(song.id);
  };

  const toggleLyrics = () => {
    setShowLyrics(!showLyrics);
    if (showInfo) setShowInfo(false);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (showLyrics) setShowLyrics(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
            <SongArtistName>
              {song.artist} • {formatDuration(song.duration)}
            </SongArtistName>
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
            <Option onClick={openModal}>
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
            <Option onClick={toggleInfo}>
              <OptionIcon>
                <Icon id="info-songitem" width="30" height="6" />
              </OptionIcon>
              <OptionText>곡 정보</OptionText>
            </Option>
          </OptionsContainer>
        )}
      </AnimatePresence>
      <AddSongToConti isOpen={isModalOpen} onClose={closeModal} />
      <AnimatePresence mode="wait">
        {showLyrics && (
          <LyricsContainer
            key="lyrics"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientOverlay className="top" />
            <LyricsContent>
              <LyricsTitle>{song.title}</LyricsTitle>
              {song.lyrics && song.lyrics !== "가사 정보를 입력해주세요." ? (
                <LyricsText>{song.lyrics}</LyricsText>
              ) : (
                <NoLyrics>가사가 아직 제공되지 않았어요.</NoLyrics>
              )}
            </LyricsContent>
            <GradientOverlay className="bottom" />
          </LyricsContainer>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showInfo && (
          <InfoContainer
            key="info"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GradientOverlay className="top" />
            <InfoContent>
              <LyricsTitle>{song.title}</LyricsTitle>
              {song.tempo && song.keyScale ? (
                <>
                  <InfoText>
                    <p>
                      원곡의 템포는{" "}
                      <EmphasizedText>{song.tempo} BPM</EmphasizedText>이고,
                    </p>
                    <p>
                      <EmphasizedText>{song.keyScale}</EmphasizedText> 코드로
                      연주되고 있어요!
                    </p>
                  </InfoText>
                </>
              ) : (
                <NoInfo>곡 정보가 아직 제공되지 않았어요.</NoInfo>
              )}
            </InfoContent>

            <GradientOverlay className="bottom" />
          </InfoContainer>
        )}
      </AnimatePresence>
    </SongItemContainer>
  );
};

export default SongItem;
