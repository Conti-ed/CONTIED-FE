import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
import Icon from "../components/Icon";

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
  padding-bottom: 134px;
  margin-bottom: 38px;
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
  padding: 23px;
`;

export const AlbumImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px; /* InfoText와의 간격 */
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: auto;
`;

export const AlbumImage = styled.img`
  position: absolute;
  width: auto;
  height: 100%;
  border-radius: 20px;
`;

export const IconWrapper = styled.div`
  position: absolute;
  bottom: 7px;
  right: 7px;
  width: 40px;
  height: 40px;
  background-color: #94b4ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: white 2px solid;
`;

export const NewIcon = styled(Icon)`
  width: 24px;
  height: 24px;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
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

export const ToggleDescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  padding: 10px;
  margin: 0 auto;
  border: 3px solid #94b4ed;
  border-radius: 8px;
`;

export const DescriptionTextWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  text-align: left;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const DescriptionText = styled.span`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  color: #333;
  font-size: 14px;
  line-height: 1.8;
  text-overflow: ellipsis;
  padding-right: 3px;
`;

export const ToggleButton = styled.button`
  background-color: rgba(200, 200, 200, 0.2);
  border: none;
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 12px;
  color: #4f8eec;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(200, 200, 200, 0.5);
  }
`;

export const EmptyStateContainer = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EmptyStateImage = styled.img`
  margin-bottom: 8px;
`;

export const EmptyStateText1 = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #171a1f;
  text-align: center;
  margin-bottom: 9px;
`;

export const EmptyStateText2 = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #828282;
  text-align: center;
  margin-bottom: 10px;
`;

export const AddSongButton = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-decoration: underline;
  color: #4f8eec;
  cursor: pointer;
  text-align: center;

  &:hover {
    color: #376bb8;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 111px;
  left: 0;
  right: 0;
  bottom: 134px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
