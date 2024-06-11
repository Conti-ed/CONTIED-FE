// StyledComponents.ts
import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  background-color: #ffffff;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

export const Content = styled(motion.div)`
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

export const UserName = styled.div`
  font-size: 28px;
  font-weight: 500;
  text-align: left;
  align-self: flex-start;
  margin-bottom: 12px;
  margin-left: 10px;
  line-height: 1.2;
  color: #1b1b1b;
  span {
    color: #94b4ed;
  }
`;

export const AlbumContainer = styled.div`
  position: relative;
  width: 360px;
  height: 360px;
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 29px;
`;

export const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: rgba(115, 115, 115, 0.1);
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
  font-size: 25px;
  color: #001438;
  text-align: center;
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
}

export const Button = styled.button<ButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5cd;
  border: none;
  padding: 10px;
  font-size: 16px;
  font-weight: 300;
  color: #000;
  border-radius: 10px;
  width: 31%;
  height: 95px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: ${(props) =>
      props.$hoverColor
        ? `linear-gradient(140.12deg, ${props.$hoverColor} 22.86%, #FFFFFF 126.99%)`
        : "linear-gradient(140.12deg, #94B4ED 22.86%, #FFFFFF 126.99%)"};
    color: #fff;
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
  & svg {
    margin-bottom: 12px;
    transition: fill 0.3s ease, stroke 0.3s ease;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 53px;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  position: absolute;
  bottom: 134px;
`;

interface FooterButtonProps {
  $active?: boolean;
}

export const FooterButton = styled.button<FooterButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: none;
  padding: 0;
  font-size: 12px;
  font-weight: 300;
  color: ${({ $active }) => ($active ? "#94b4ed" : "#8C8C8C")};
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 40px;
  &:hover {
    color: #94b4ed;
    svg path {
      fill: #94b4ed;
    }
  }
  & svg {
    margin-bottom: 3px;
    width: 23px;
    height: 23px;
    path {
      fill: ${({ $active }) => ($active ? "#94b4ed" : "#8C8C8C")};
    }
  }
`;

export const SafariSpace = styled.div`
  width: 100%;
  height: 129px;
  border-radius: 15px;
  background-color: #e7f0fc;
`;
