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
import { getMyConties } from "../../utils/axios";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";

const ContiList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const ContiItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 80vw;
  margin-bottom: 15px;
  border: 2px solid #9dbbe9;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  color: rgba(23, 26, 31, 0.8);

  &:hover {
    background-color: #f9f9f9;
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
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: rgba(23, 26, 31, 0.5);
`;

const LoadingIndicator = styled.div`
  margin-top: 10px;
  color: #388ee9;
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  color: #dc3545;
`;

interface AddSongToContiProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Conti {
  id: number;
  title: string;
  userId: string;
  thumbnail: string | null;
  updatedAt: string;
  duration: number;
}

const AddSongToConti: React.FC<AddSongToContiProps> = ({ isOpen, onClose }) => {
  const [contis, setContis] = useState<Conti[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchConties = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getMyConties();
          // console.log("Fetched conties:", data);

          if (data && Array.isArray(data.myContiData)) {
            setContis(data.myContiData);
          } else {
            throw new Error("Unexpected response format");
          }
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
      fetchConties();
    }
  }, [isOpen]);

  const handleContiSelect = (contiTitle: string) => {
    alert(`${contiTitle} 콘티에 추가되었습니다.`);
    onClose();
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
                onClick={() => handleContiSelect(conti.title)}
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
          <div>콘티가 없습니다.</div>
        )}
        <ModalActions>
          <CancelButton onClick={onClose} disabled={isLoading}>
            취소
          </CancelButton>
        </ModalActions>
      </ModalContainer>
    </OverlayModal>
  );
};

export default AddSongToConti;
