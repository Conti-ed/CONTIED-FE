import React, { useEffect, useState } from "react";
import {
  OverlayModal,
  ModalContainer,
  ModalTitle,
  ModalActions,
  CancelButton,
} from "../../styles/Modal.styles";
import ContiPlaceholder from "../ContiPlaceholder";
import styled from "styled-components";
import { getAllMyConties, patchConti, PatchContiDto } from "../../utils/axios";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";
import { motion } from "framer-motion";
import { ContiType } from "../../types";

const ContiList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const ContiItem = styled.li<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 80vw;
  margin-bottom: 15px;
  border: 2px solid #9dbbe9;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  background-color: ${({ $isSelected }) => ($isSelected ? "#9dbbe9" : "white")};
  color: rgba(23, 26, 31, 0.8);

  &:hover {
    background-color: ${({ $isSelected }) =>
      $isSelected ? "#9dbbe9" : "#f9f9f9"};
  }
`;

const ContiImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

const ContiImage = styled.img`
  position: absolute;
  height: 60px;
  width: auto;
  border-radius: 10px;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  margin-left: 13px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: rgba(23, 26, 31, 0.8);
  max-width: 210px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: rgba(23, 26, 31, 0.5);
`;

const LoadingIndicator = styled.div`
  margin-top: 10px;
  color: #388ee9;
`;

const AddButton = styled(motion.button)`
  padding: 10px 20px;
  background-color: #4f8eec;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  color: #dc3545;
`;

interface AddSongToContiProps {
  isOpen: boolean;
  onClose: () => void;
  songId: number;
}

const AddSongToConti: React.FC<AddSongToContiProps> = ({
  isOpen,
  onClose,
  songId,
}) => {
  const [contis, setContis] = useState<ContiType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContiId, setSelectedContiId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchAllConties = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const allContis = await getAllMyConties();
          const activeContis = allContis.filter(
            (conti: ContiType) => conti.state !== "DELETED"
          );
          setContis(activeContis);
        } catch (error: any) {
          console.error("콘티 목록 가져오기 실패:", error);
          setError(
            error.response?.data?.message ||
              "콘티 목록을 가져오는 데 실패했습니다."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllConties();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedContiId(null);
    }
  }, [isOpen]);

  const handleContiSelect = (contiId: number) => {
    setSelectedContiId((prevId) => (prevId === contiId ? null : contiId));
  };

  const handleAddToConti = async () => {
    if (selectedContiId !== null) {
      setIsAdding(true);
      try {
        const selectedConti = contis.find(
          (conti) => conti.id === selectedContiId
        );

        if (!selectedConti) {
          throw new Error("선택한 콘티를 찾을 수 없습니다.");
        }

        const existingSongIds = selectedConti.ContiToSong.map(
          (cts) => cts.songId
        );

        if (existingSongIds.includes(songId)) {
          alert("이미 이 콘티에 추가된 곡입니다.");
          setIsAdding(false);
          return;
        }

        const updatedSongs = [...existingSongIds, songId];
        const uniqueSongs = Array.from(new Set(updatedSongs));

        const dto: PatchContiDto = {
          songs: uniqueSongs,
        };

        await patchConti(selectedContiId, dto);

        alert(`${selectedConti.title} 콘티에 곡이 추가되었습니다.`);
        onClose();
      } catch (error: any) {
        console.error("콘티에 곡 추가 실패:", error);
        setError(
          error.response?.data?.message ||
            "콘티에 곡을 추가하는 데 실패했습니다."
        );
      } finally {
        setIsAdding(false);
      }
    }
  };

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
        style={{ width: "90vw", maxWidth: "500px" }}
      >
        <ModalTitle>추가할 콘티를 선택해주세요</ModalTitle>
        {isLoading ? (
          <LoadingIndicator>로딩 중...</LoadingIndicator>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : contis.length > 0 ? (
          <ContiList>
            {contis.map((conti) => (
              <ContiItem
                key={conti.id}
                onClick={() => handleContiSelect(conti.id)}
                $isSelected={selectedContiId === conti.id}
              >
                <ContiImageWrapper>
                  <ContiPlaceholder size={80} />
                  <ContiImage
                    src={conti.thumbnail || "/images/WhitePiano.png"}
                    alt="Album Image"
                    style={{
                      height:
                        conti.thumbnail === null ||
                        conti.thumbnail === "/images/WhitePiano.png"
                          ? "50px"
                          : "80px",
                    }}
                  />
                </ContiImageWrapper>
                <InfoText>
                  <Title>{conti.title}</Title>
                  <Subtitle>{`${formatRelativeTime(
                    parseLocalDateString(conti.updatedAt)
                  )} • ${formatTotalDuration(conti.duration)}`}</Subtitle>
                </InfoText>
              </ContiItem>
            ))}
          </ContiList>
        ) : (
          <div>생성된 콘티가 없어요...</div>
        )}
        <ModalActions>
          {selectedContiId !== null && (
            <AddButton
              onClick={handleAddToConti}
              disabled={isAdding}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {isAdding ? "추가 중..." : "추가"}
            </AddButton>
          )}
          <CancelButton onClick={onClose} disabled={isLoading || isAdding}>
            취소
          </CancelButton>
        </ModalActions>
      </ModalContainer>
    </OverlayModal>
  );
};

export default AddSongToConti;
