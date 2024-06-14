import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import EmptyState from "../../components/EmptyState"; // EmptyState 컴포넌트 import
import ContiPlaceholder from "../ContiPlaceholder";

const Container = styled.div`
  height: 60vh;
  width: 100%;
  padding-top: 15px;
  padding-bottom: 55px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Conties = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContiItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 90vw;
  margin-bottom: 15px;
  border: 2px solid #9dbbe9;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer; // 클릭 가능하도록 커서 스타일 추가
`;

const ContiImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  position: relative;
  border-radius: 20px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

const ContiImage = styled.img`
  position: absolute;
  height: 52px;
  width: auto;
  align-items: center;
  justify-content: center;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13px;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 7px;
  color: rgba(23, 26, 31, 0.8);
`;

const Subtitle = styled.div`
  font-size: 13px;
  margin-bottom: 7px;
  color: rgba(23, 26, 31, 0.5);
`;

const SongInfo = styled.div`
  font-size: 11px;
  color: rgba(23, 26, 31, 0.5);
`;

interface ContiTabProps {
  searchQuery: string;
}

const ContiTab: React.FC<ContiTabProps> = ({ searchQuery }) => {
  const [contiData, setContiData] = useState<any[]>([]);
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    const storedContiData: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("conti_")) {
        const data = JSON.parse(localStorage.getItem(key)!);
        storedContiData.push(data);
      }
    }
    setContiData(storedContiData);
  }, []);

  const filteredTitles = contiData.filter((data) =>
    data.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContiClick = (id: string) => {
    navigate(`/conti-detail/${id}`);
  };

  return (
    <Container>
      <Conties>
        {filteredTitles.length > 0 ? (
          filteredTitles.map((data, index) => (
            <ContiItem key={index} onClick={() => handleContiClick(data.id)}>
              <ContiImageWrapper>
                <ContiPlaceholder size={100} />
                <ContiImage src={data.thumbnail} alt="Album Image" />
              </ContiImageWrapper>
              <InfoText>
                <Title>{data.title}</Title>
                <Subtitle>{data.ownerName}</Subtitle>
                <SongInfo>{`${data.createdDate} • ${data.duration}분`}</SongInfo>
              </InfoText>
            </ContiItem>
          ))
        ) : (
          <EmptyState message={"콘티 검색 결과가 없어요."} top="49.5%" />
        )}
      </Conties>
    </Container>
  );
};

export default ContiTab;
