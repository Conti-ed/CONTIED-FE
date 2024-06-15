import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가
import ContiPlaceholder from "../ContiPlaceholder";
import {
  formatRelativeTime,
  formatTotalDuration,
  parseLocalDateString,
} from "../../utils/formatDuration";

const Conties = styled.div`
  position: absolute;
  top: 25%;
  height: 60%;
  overflow-y: auto;
  padding-bottom: 60px;
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
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

const ContiImage = styled.img`
  position: absolute;
  height: 100px;
  border-radius: 20px;
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

const EmptyStateContainer = styled.div`
  margin-bottom: 74px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const EmptyStateImage = styled.img`
  margin-bottom: 8px;
`;

const EmptyStateText1 = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: #171a1f;
  text-align: center;
  margin-bottom: 9px;
`;

const EmptyStateText2 = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #828282;
  text-align: center;
`;
interface ContiTabProps {
  searchQuery: string;
}

const ContiTab: React.FC<ContiTabProps> = ({ searchQuery }) => {
  const [contiData, setContiData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedContiData: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("conti_")) {
        const data = JSON.parse(localStorage.getItem(key)!);
        storedContiData.push(data);
      }
    }
    storedContiData.sort(
      (a, b) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
    setContiData(storedContiData);
  }, []);

  const filteredTitles = contiData.filter((data) =>
    data.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContiClick = (id: string) => {
    navigate(`/conti-detail/${id}`);
  };

  return (
    <>
      {filteredTitles.length > 0 ? (
        <Conties>
          {filteredTitles.map((data, index) => (
            <ContiItem key={index} onClick={() => handleContiClick(data.id)}>
              <ContiImageWrapper>
                <ContiPlaceholder size={100} />
                <ContiImage src={data.thumbnail} alt="Album Image" />
              </ContiImageWrapper>
              <InfoText>
                <Title>{data.title}</Title>
                <Subtitle>{data.ownerName}</Subtitle>
                <SongInfo>{`${formatRelativeTime(
                  parseLocalDateString(data.updated_at)
                )} • ${formatTotalDuration(data.duration)}`}</SongInfo>
              </InfoText>
            </ContiItem>
          ))}
        </Conties>
      ) : (
        <EmptyStateContainer>
          <EmptyStateImage src="images/WhitePiano.png" alt="Empty state" />
          <EmptyStateText1>앗!</EmptyStateText1>
          <EmptyStateText2>콘티 검색 결과가 없어요.</EmptyStateText2>
        </EmptyStateContainer>
      )}
    </>
  );
};

export default ContiTab;
