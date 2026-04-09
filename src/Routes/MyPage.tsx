import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "react-query";
import { getUserProfile } from "../utils/axios";
import { getAccessToken, logout } from "../utils/auth";
import ConfirmModal from "../components/Modals/ConfirmModal";

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: calc(var(--vh, 1vh) * 100);
  background-color: #fff;
`;

export const Header = styled.div`
  position: relative;
  width: 100%;
  padding: 0 20px;
  margin-top: 23px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 42px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 500;
  color: #171a1f;
  text-align: center;
  padding: 0 45px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  span {
    color: #94b4ed;
  }
`;

const LogoutButton = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #f3f4f6;
  border: none;
  color: #9095a1;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 20px;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background-color: #94b4ed;
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

export const Content = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
  overflow-y: hidden;
`;

const ScrollableContainer = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  max-width: 400px;
  margin-bottom: 20px;
`;

export const SquareButton = styled.div<{ $isActive: boolean }>`
  width: 48%;
  aspect-ratio: 4 / 3.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.$isActive ? "#94b4ed" : "#f0f0f0")};
  border: 2px solid #9dbbe9;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: background-color 0.3s;
`;

export const ButtonText = styled.span<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? "#ffffff" : "#171a1f")};
  font-size: 17px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
`;

export const ContiItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 10px;
  width: 90%;
  max-width: 400px;
  margin-bottom: 15px;
  border: 2px solid #9dbbe9;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;

export const ContiImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
`;

export const ContiImage = styled.img`
  position: absolute;
  height: 100px;
  border-radius: 20px;
  width: auto;
  align-items: center;
  justify-content: center;
`;

export const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 13px;
`;

export const ContiTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 7px;
  color: rgba(23, 26, 31, 0.8);
  max-width: 210px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Subtitle = styled.div`
  font-size: 13px;
  margin-bottom: 7px;
  color: rgba(23, 26, 31, 0.5);
`;

export const SongInfo = styled.div`
  font-size: 11px;
  color: rgba(23, 26, 31, 0.5);
`;

export const EmptyStateContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80%;
  width: 100%;
`;

export const EmptyStateImage = styled.img`
  width: auto;
  height: 80px;
  margin-bottom: 20px;
`;

export const EmptyStateText1 = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #171a1f;
  margin-bottom: 10px;
`;

export const EmptyStateText2 = styled.div`
  font-size: 14px;
  color: #828282;
  text-align: center;
`;

const MyPage: React.FC = () => {
  const { data: userProfile } = useQuery("userProfile", getUserProfile, {
    staleTime: 1000 * 60 * 5, // 캐시 시간을 5분으로 단축
    enabled: !!getAccessToken(), // 토큰이 있을 때만 실행
  });
  const username = userProfile?.nickname || "사용자";
  const [activeTab, setActiveTab] = useState<"uploaded" | "favorites">(
    "uploaded"
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleTabClick = (tab: "uploaded" | "favorites") => {
    setActiveTab(tab);
    navigate(`/mypage/${tab}`);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      queryClient.clear();
    } finally {
      setShowLogoutModal(false);
      window.location.href = "/";
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <span>{username}</span> 님의 Conti:ed
        </Title>
        <LogoutButton onClick={handleLogoutClick}>로그아웃</LogoutButton>
      </Header>
      <Content>
        <ButtonContainer>
          <SquareButton
            $isActive={activeTab === "uploaded"}
            onClick={() => handleTabClick("uploaded")}
          >
            <ButtonText $isActive={activeTab === "uploaded"}>
              내가
              <br />
              업로드한 콘티
            </ButtonText>
          </SquareButton>
          <SquareButton
            $isActive={activeTab === "favorites"}
            onClick={() => handleTabClick("favorites")}
          >
            <ButtonText $isActive={activeTab === "favorites"}>
              내가
              <br />
              좋아하는 콘티
            </ButtonText>
          </SquareButton>
        </ButtonContainer>
        <ScrollableContainer>
          <Outlet />
        </ScrollableContainer>
      </Content>
      {window.location.pathname === "/mypage" && (
        <Navigate to="/mypage/uploaded" replace />
      )}
      {showLogoutModal && (
        <ConfirmModal
          title="정말 로그아웃 하시겠습니까?"
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
          confirmText="로그아웃"
          cancelText="취소"
        />
      )}
    </Container>
  );
};

export default MyPage;
