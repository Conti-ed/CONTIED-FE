import React from "react";
import styled from "styled-components";
import { SongType } from "../types";
import { formatDuration } from "../utils/formatDuration";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const SongItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 10px 20px 0px;
`;

const SongNumber = styled.span`
  min-width: 20px;
  margin-right: 8px;
`;

const SongInfo = styled.span`
  padding: 0px 30px 0px 0px;
`;

const SongTitle = styled.span`
  font-weight: 700;
  flex: 1;
`;

const SongDetails = styled.div`
  color: #6c757d;
  font-size: 13px;
  margin-top: 5px;
`;

const ArtistAndDuration = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #6c757d;
`;

const IconContainer = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

interface SongItemProps {
  song: SongType;
  index: number;
  onOptionsClick: (
    songId: number,
    event: React.MouseEvent<HTMLElement>
  ) => void;
}

export const SongItem: React.FC<SongItemProps> = ({
  song,
  index,
  onOptionsClick,
}) => {
  return (
    <SongItemContainer>
      <SongNumber>{index + 1}.</SongNumber>
      <SongInfo>
        <SongTitle>{song.title}</SongTitle>
        <SongDetails>
          <ArtistAndDuration>
            <span>{song.artist}</span>
            <span>•</span>
            <span>
              {song.duration ? formatDuration(song.duration) : "0:00"}
            </span>
          </ArtistAndDuration>
        </SongDetails>
      </SongInfo>
      <IconContainer onClick={(event) => onOptionsClick(song.id, event)}>
        <MoreVertIcon />
      </IconContainer>
    </SongItemContainer>
  );
};

export default React.memo(SongItem);
