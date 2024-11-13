import React from "react";
import styled, { keyframes } from "styled-components";

interface ConfirmModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const fadeIn = keyframes`
  from { 
    opacity: 0;
  }
  to { 
    opacity: 1; 
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 35px;
  border-radius: 8px;
  max-width: 320px;
  width: 100%;
  color: #323743;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
`;

const ModalTitle = styled.p`
  text-align: center;
  color: #323743;
  font-size: 18px;
  margin-bottom: 10px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
  max-width: 45%;
  font-size: 14px;
`;

const CancelButton = styled(Button)`
  border: 1px solid #ccc;
  background: white;
  color: #323743;
`;

const ConfirmButton = styled(Button)`
  border: none;
  background-color: #dc3545;
  color: white;
`;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  onConfirm,
  onCancel,
}) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <ModalActions>
          <ConfirmButton onClick={onConfirm}>삭제</ConfirmButton>
          <CancelButton onClick={onCancel}>취소</CancelButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;
