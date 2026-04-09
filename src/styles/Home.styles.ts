import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
  position: relative;
`;

export const Content = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 35px;
  margin-top: 13px;
  margin-bottom: 29px;
`;

export const Logo = styled.img`
  height: 36px;
  margin-left: 10px;
`;

export const WelcomeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin-left: 10px;
  margin-bottom: 24px;
`;

export const UserName = styled.div`
  font-size: 28px;
  font-weight: 600;
  text-align: left;
  line-height: 1.2;
  color: #1b1b1b;
  margin-bottom: 4px;
  span {
    color: #94b4ed;
  }
`;

export const StatsText = styled.div`
  font-size: 15px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const HighlightCount = styled(motion.span)`
  color: #94b4ed;
  font-weight: 700;
  font-size: 17px;
`;

export const AlbumContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 360px;
  height: 360px;
  border-radius: 20px;
  box-shadow: 0px 8px 24px rgba(148, 180, 237, 0.15);
  margin-bottom: 29px;
  flex-shrink: 0;
  overflow: hidden;
`;

export const ShuffleButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: #545f71;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  & svg {
    transition: transform 0.4s ease;
  }
  &:hover svg {
    transform: rotate(180deg);
  }
`;

export const AlbumThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
  background-color: #000000;
`;

export const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: rgba(115, 115, 115, 0.3);
`;

export const RoundLogo = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #94b4ed;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RoundLogoImage = styled.img`
  width: auto;
  height: 70px;
`;

export const Title = styled.div`
  position: absolute;
  top: 68%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #001438;
  text-align: center;
`;

export const TransitionTitle = styled(Title)<{ $isLoading: boolean }>`
  transition: color 0.3s ease-in-out;
  opacity: ${(props) => (props.$isLoading ? 0 : 1)};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  font-size: 20px;
  line-height: 1.3;
  width: 80%;
  max-width: 85%;
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #000;
  align-self: flex-start;
  margin-left: 10px;
  margin-bottom: 22px;
  & span {
    color: #94b4ed;
  }
  & svg {
    margin-right: 5px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 360px;
  margin-bottom: 20px;
`;

interface ButtonProps {
  $hoverFillPath?: boolean;
  $hoverColor?: string;
  $isHovered: boolean;
  $isClicked?: boolean; // 클릭 시 상태를 나타내는 속성 추가
}

export const Button = styled(motion.button)<ButtonProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.03);
  padding: 10px;
  font-size: 16px;
  font-weight: 400;
  color: #333;
  border-radius: 16px;
  width: 31%;
  height: 95px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: background 0.4s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.$hoverColor
        ? `linear-gradient(145deg, ${props.$hoverColor} 0%, #FFFFFF 100%)`
        : "linear-gradient(145deg, #94B4ED 0%, #FFFFFF 100%)"};
    color: #fff;
    border-color: transparent;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

    svg path {
      stroke: ${(props) => (props.$hoverColor === "#94b4ed" ? "#fff" : "")};
      fill: ${(props) => (props.$hoverColor === "#C194ED" ? "#fff" : "")};
    }
    svg rect,
    svg path {
      stroke: ${(props) => (props.$hoverColor === "#ED94AB" ? "#fff" : "")};
    }
    svg path.specific-fill {
      fill: ${(props) => (props.$hoverFillPath ? "#fff" : "")};
    }
  }

  &:disabled {
    cursor: default;
    opacity: 0.8;
  }

  & svg {
    margin-bottom: 12px;
    transition: all 0.3s ease;
  }
`;
