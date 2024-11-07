import React from "react";
import { OverlayModal } from "../../styles/Modal.styles";
import styled from "styled-components";
import ContiPlaceholder from "../ContiPlaceholder";
import { motion } from "framer-motion";

const ModalContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  max-width: 85%;
  width: 400px;
  max-height: 55vh;
  background: white;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
`;

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  thumbnail: string | null;
  title: string;
  userNickname: string;
  description: string;
}

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #ffffff;
  flex-shrink: 0;
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 14px;
`;

const ThumbnailImage = styled.img<{ $hasThumbnail: boolean }>`
  position: absolute;
  height: ${({ $hasThumbnail }) => ($hasThumbnail ? "80px" : "45px")};
  width: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
`;

const TitleContainer = styled.div`
  text-align: left;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: #323743;
  margin-bottom: 7px;
  max-width: 200px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #323743;
`;

const ContentContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 15px;
  margin: 15px 0;

  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;

const DescriptionContent = styled.div`
  text-align: left;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
`;

const DescriptionTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #323743;
  margin-bottom: 10px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 15px;
  border-top: 1px solid #e0e0e0;
  background-color: #ffffff;
  flex-shrink: 0;
`;

const ExitButton = styled.button`
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

const DescriptionModal: React.FC<DescriptionModalProps> = ({
  isOpen,
  onClose,
  thumbnail,
  title,
  userNickname,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <OverlayModal
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContainer
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ maxWidth: "85%", width: "400px" }}
      >
        <ModalHeader>
          <ThumbnailWrapper>
            <ContiPlaceholder size={80} />
            <ThumbnailImage
              src={thumbnail || "/images/WhitePiano.png"}
              alt="Thumbnail"
              $hasThumbnail={!!thumbnail}
            />
          </ThumbnailWrapper>
          <TitleContainer>
            <ModalTitle>{title}</ModalTitle>
            <SubTitle>{userNickname}</SubTitle>
          </TitleContainer>
        </ModalHeader>
        <ContentContainer>
          <DescriptionContent>
            <DescriptionTitle>이 콘티는...</DescriptionTitle>
            <p>{description || "아직 설명이 없어요..."}</p>
          </DescriptionContent>
        </ContentContainer>
        <Footer>
          <ExitButton onClick={onClose}>닫기</ExitButton>
        </Footer>
      </ModalContainer>
    </OverlayModal>
  );
};

export default DescriptionModal;
