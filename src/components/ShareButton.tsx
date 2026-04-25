import React, { useState } from "react";
import styled from "styled-components";
import ShareMenu from "./ShareMenu";

interface ShareButtonProps {
  contiId: number;
  title: string;
}

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 400;
  color: #4f8eec;
  background-color: transparent;
  border: 1.5px solid #4f8eec;
  border-radius: 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #eef4ff;
  }

  &:active {
    background-color: #d7e4ff;
  }
`;

const ShareIcon = styled.svg`
  flex-shrink: 0;
`;

const ToastContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #323743;
  color: #fff;
  font-size: 13px;
  padding: 10px 20px;
  border-radius: 20px;
  white-space: nowrap;
  z-index: 2000;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ShareButton: React.FC<ShareButtonProps> = ({ contiId, title }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleButtonClick = () => {
    setMenuOpen(true);
  };

  const handleCopied = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1800);
  };

  return (
    <>
      <Button type="button" onClick={handleButtonClick} aria-label="콘티 공유">
        <ShareIcon
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4f8eec"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </ShareIcon>
        공유
      </Button>

      <ShareMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        contiId={contiId}
        title={title}
        onCopied={handleCopied}
      />

      <ToastContainer $visible={toastVisible}>링크가 복사되었어요</ToastContainer>
    </>
  );
};

export default ShareButton;
