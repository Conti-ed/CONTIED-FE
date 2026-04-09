import React from "react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "../styles/LoadingSpinner";
import { Button } from "../styles/Home.styles";

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
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
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
