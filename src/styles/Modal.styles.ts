import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// 오버레이
export const OverlayModal = styled(motion.div)`
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
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ModalContainer = styled(motion.div)`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  max-width: 600px;
  width: 100%;
  max-height: 60vh;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ModalTitle = styled.p`
  color: #323743;
  font-weight: 500;
  margin-top: 5px;
  margin-bottom: 20px;
  font-size: 18px;
`;

// 모달 버튼 컨테이너
export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 10px;
`;

// 취소 버튼
export const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: #323743;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #f0f0f0;
  }
`;
