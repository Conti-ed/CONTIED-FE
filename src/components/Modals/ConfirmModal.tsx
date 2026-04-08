import React from "react";
import styled, { keyframes } from "styled-components";

interface ConfirmModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
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
  border-radius: 12px;
  max-width: 320px;
  width: 100%;
  color: #323743;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.p`
  text-align: center;
  color: #323743;
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 25px;
  line-height: 1.4;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled(Button)`
  border: 1px solid #e1e4e8;
  background: white;
  color: #586069;
  
  &:hover {
    background: #f6f8fa;
  }
`;

const ConfirmButton = styled(Button)`
  border: none;
  background-color: #94b4ed;
  color: white;
  
  &:hover {
    background-color: #7d9ed9;
  }
  
  &.danger {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
`;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
}) => {
  const isDanger = confirmText === "삭제" || confirmText === "로그아웃";

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        <ModalActions>
          <ConfirmButton 
            onClick={onConfirm} 
            className={isDanger ? "danger" : ""}
          >
            {confirmText}
          </ConfirmButton>
          <CancelButton onClick={onCancel}>
            {cancelText}
          </CancelButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;
