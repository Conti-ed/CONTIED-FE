import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const SongItemContainer = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;

  &:first-of-type {
    border-top: 1px solid #ddd;
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
  border-top: 1px solid #ddd;
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

const SongItem = ({
  song,
}: {
  song: { title: string; artist: string; image: string };
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SongItemContainer>
      <SongInfo>
        <div>
          <SongImageWrapper>
            <SongImage src={song.image} alt="Song Image" />
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
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path
                    d="M7 9H13M10 6V12M1 13V3C1 1.89543 1.89543 1 3 1H9L11 3H17C18.1046 3 19 3.89543 19 5V13C19 14.1046 18.1046 15 17 15H3C1.89543 15 1 14.1046 1 13Z"
                    stroke="#8C8C8C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </OptionIcon>
              <OptionText>내 콘티에 추가</OptionText>
            </Option>
            <Option>
              <OptionIcon>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7 17V4L19 1V14M7 17C7 18.1046 5.65685 19 4 19C2.34315 19 1 18.1046 1 17C1 15.8954 2.34315 15 4 15C5.65685 15 7 15.8954 7 17ZM19 14C19 15.1046 17.6569 16 16 16C14.3431 16 13 15.1046 13 14C13 12.8954 14.3431 12 16 12C17.6569 12 19 12.8954 19 14ZM7 8L19 5"
                    stroke="#8C8C8C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </OptionIcon>
              <OptionText>가사</OptionText>
            </Option>
            <Option>
              <OptionIcon>
                <svg width="30" height="6" viewBox="0 0 30 6" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3 4.5C3.82843 4.5 4.5 3.82843 4.5 3C4.5 2.17157 3.82843 1.5 3 1.5C2.17157 1.5 1.5 2.17157 1.5 3C1.5 3.82843 2.17157 4.5 3 4.5ZM3 6C4.65685 6 6 4.65685 6 3C6 1.34315 4.65685 0 3 0C1.34315 0 0 1.34315 0 3C0 4.65685 1.34315 6 3 6ZM14.9999 4.5C15.8284 4.5 16.5 3.82843 16.5 3C16.5 2.17157 15.8284 1.5 14.9999 1.5C14.1715 1.5 13.4999 2.17157 13.4999 3C13.4999 3.82843 14.1715 4.5 14.9999 4.5ZM14.9999 6C16.6568 6 18 4.65685 18 3C18 1.34315 16.6568 0 14.9999 0C13.3431 0 11.9999 1.34315 11.9999 3C11.9999 4.65685 13.3431 6 14.9999 6ZM28.4999 3C28.4999 3.82843 27.8283 4.5 26.9999 4.5C26.1715 4.5 25.4999 3.82843 25.4999 3C25.4999 2.17157 26.1715 1.5 26.9999 1.5C27.8283 1.5 28.4999 2.17157 28.4999 3ZM29.9999 3C29.9999 4.65685 28.6568 6 26.9999 6C25.343 6 23.9999 4.65685 23.9999 3C23.9999 1.34315 25.343 0 26.9999 0C28.6568 0 29.9999 1.34315 29.9999 3Z"
                    fill="#8C8C8C"
                  />
                </svg>
              </OptionIcon>
              <OptionText>곡 정보</OptionText>
            </Option>
          </OptionsContainer>
        )}
      </AnimatePresence>
    </SongItemContainer>
  );
};

export default SongItem;
