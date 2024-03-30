import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MenuContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  white-space: nowrap;
`;

const MenuItem = styled.div`
  padding: 5px 10px;
  &:hover {
    border: 1px solid #ccc;
  }
`;

const PlayItem = styled(Link)`
  padding: 5px 10px;
  &:hover {
    border: 1px solid #ccc;
  }
`;

export interface IMenuItem {
  label: string;
  onClick?: () => void;
  link?: string;
}

interface OptionsMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  menuItems: IMenuItem[];
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  x,
  y,
  onClose,
  menuItems,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <MenuContainer
      ref={menuRef}
      style={{ position: "fixed", top: `${y}px`, left: `${x}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {menuItems.map((item, index) =>
        item.link ? (
          <PlayItem
            key={index}
            to={item.link}
            onClick={onClose}
            target="_blank"
          >
            {item.label}
          </PlayItem>
        ) : (
          <MenuItem
            key={index}
            onClick={() => {
              if (item.onClick) item.onClick();
              onClose();
            }}
          >
            {item.label}
          </MenuItem>
        )
      )}
    </MenuContainer>
  );
};

export default OptionsMenu;
