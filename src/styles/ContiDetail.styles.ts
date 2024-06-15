import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";

export const Container = styled(motion.div)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

export const Header = styled.header`
  height: 67px;
  width: 100%;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.7px solid #d9d9d9;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const IconContainer = styled.div`
  margin-right: 10px;
  gap: 13px;
  display: flex;
  align-items: center;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const fillHeart = keyframes`
  from {
    transform: scale(0.7);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

export const HeartIcon = styled.svg<{ $isFavorite: boolean }>`
  width: 20px;
  height: auto;
  fill: ${({ $isFavorite }) => ($isFavorite ? "#4F8EEC" : "transparent")};
  stroke: #4f8eec;
  stroke-width: 1.5px;
  transition: fill 0.3s ease-in-out, stroke 0.3s ease-in-out;
  ${({ $isFavorite }) =>
    $isFavorite &&
    css`
      animation: ${fillHeart} 0.6s ease forwards;
    `}
`;

export const AlbumDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AlbumInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 19px;
  margin-bottom: 19px;
  padding: 23px;
`;

export const AlbumImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px; /* InfoText와의 간격 */
  // border: 1px solid #9dbbe9;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: sticky;
`;

export const AlbumImage = styled.img`
  position: absolute;
  width: auto;
  height: 100%;
  border-radius: 20px;
`;

export const InfoText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 19px;
  font-weight: 500;
  color: #323743;
  margin-bottom: 10px;
`;

export const Subtitle = styled.h2`
  font-size: 14px;
  font-weight: 300;
  color: #171a1f;
  margin-bottom: 9px;
`;

export const SongInfo = styled.div`
  font-size: 11px;
  font-weight: 300;
  color: #9095a1;
`;

export const AddSongContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  margin-top: 23px;
  font-size: 12px;
  font-weight: 300;
  color: #9095a1;
  cursor: pointer;
`;

export const AddIcon = styled.svg`
  margin-right: 5px;
`;

export const DEContiData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70.5%;
`;

export const DEImage = styled.img`
  margin-bottom: 20px;
  width: 50px;
`;

export const DEContiDataText = styled.h2`
  color: #000;
  font-size: 15px;
  text-align: center;
`;
