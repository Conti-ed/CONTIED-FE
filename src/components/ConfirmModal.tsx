import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const OverlayModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled(motion.div)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  max-width: 500px;
  text-align: center;
`;

const ModalTitle = styled.p`
  color: black;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #388ee9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:nth-child(2) {
    background-color: #b6434f;
  }
`;

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
  title: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onConfirm,
  onCancel,
  isVisible,
  title,
}) => {
  if (!isVisible) return null;

  return (
    <OverlayModal>
      <ModalContainer
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalTitle>{title}</ModalTitle>
        <div>
          <ModalButton onClick={onConfirm}>네</ModalButton>
          <ModalButton onClick={onCancel}>아니오</ModalButton>
        </div>
      </ModalContainer>
    </OverlayModal>
  );
};

export default ConfirmModal;
