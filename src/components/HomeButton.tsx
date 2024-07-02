import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { LoadingSpinner } from "../styles/LoadingSpinner";

interface ButtonProps {
  $hoverFillPath?: boolean;
  $hoverColor?: string;
  $isHovered: boolean;
  $isClicked: boolean;
}

const Button = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
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

interface HomeButtonProps {
  buttonInfo: {
    name: string;
    hoverColor: string;
    hoverFillPath?: boolean;
    icon: React.ReactNode;
    spinnerColor: string;
  };
  isHovered: boolean;
  isClicked: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  disabled: boolean;
}

export const HomeButton: React.FC<HomeButtonProps> = ({
  buttonInfo,
  isHovered,
  isClicked,
  onMouseEnter,
  onMouseLeave,
  onClick,
  disabled,
}) => {
  const { name, hoverColor, hoverFillPath, icon, spinnerColor } = buttonInfo;

  return (
    <Button
      $hoverColor={hoverColor}
      $hoverFillPath={hoverFillPath}
      $isHovered={isHovered}
      $isClicked={isClicked}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      disabled={disabled}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isClicked ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClicked ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "absolute" }}
      >
        <LoadingSpinner color={spinnerColor} />
      </motion.div>
      {isHovered ? `${name.slice(0, -1)} !` : name}
    </Button>
  );
};
