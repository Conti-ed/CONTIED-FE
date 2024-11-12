import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

interface OptionsProps {
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const OptionsContainer = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  padding: 4px 8px;
  margin: 2px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  color: #323743;
  white-space: nowrap;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DialogOverlay = styled.div`
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

const DialogContent = styled.div`
  background-color: white;
  padding: 35px;
  border-radius: 8px;
  max-width: 280px;
  width: 100%;
  color: #323743;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
`;

const DialogTitle = styled.p`
  text-align: center;
  color: #323743;
  font-size: 17px;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
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

const DeleteButton = styled(Button)`
  border: none;
  background-color: #dc3545;
  color: white;
`;

const Options: React.FC<OptionsProps> = ({ onEdit, onDelete, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditClick = () => {
    setIsMenuOpen(false);
    onEdit();
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <OptionsContainer ref={menuRef}>
      <div onClick={() => setIsMenuOpen(!isMenuOpen)}>{children}</div>
      {isMenuOpen && (
        <Menu>
          <MenuItem onClick={handleEditClick}>콘티 수정</MenuItem>
          <MenuItem onClick={handleDeleteClick}>콘티 삭제</MenuItem>
        </Menu>
      )}
      {isDeleteDialogOpen && (
        <DialogOverlay>
          <DialogContent>
            <DialogTitle>이 콘티를 삭제할까요?</DialogTitle>
            <DialogActions>
              <DeleteButton onClick={handleDeleteConfirm}>삭제</DeleteButton>
              <CancelButton onClick={() => setIsDeleteDialogOpen(false)}>
                취소
              </CancelButton>
            </DialogActions>
          </DialogContent>
        </DialogOverlay>
      )}
    </OptionsContainer>
  );
};

export default Options;
