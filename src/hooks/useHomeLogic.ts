import { useState, useEffect, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { getConties, getUserNickname } from "../utils/axios";
import { ContiType } from "../types";

export const useHomeLogic = (navigate: NavigateFunction) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<string | null>(null);
  const [contiList, setContiList] = useState<ContiType[]>([]);
  const [selectedConti, setSelectedConti] = useState<ContiType | null>(null);

  const selectRandomConti = useCallback((list: ContiType[]) => {
    if (list.length > 0) {
      const randomIndex = Math.floor(Math.random() * list.length);
      setSelectedConti(list[randomIndex]);
    } else {
      setSelectedConti(null);
    }
  }, []);

  useEffect(() => {
    const fetchContiData = async () => {
      try {
        const [contiesResponse, userNickname] = await Promise.all([
          getConties(),
          getUserNickname(),
        ]);

        const conties = Array.isArray(contiesResponse)
          ? contiesResponse
          : contiesResponse.contiData || [];

        const filteredContiData = conties.filter(
          (conti: ContiType) => conti.User.nickname === userNickname
        );

        setContiList(filteredContiData);
        selectRandomConti(filteredContiData);
      } catch (error) {
        console.error("Failed to fetch conti data:", error);
      }
    };

    fetchContiData();
  }, [selectRandomConti]);

  // 마우스가 버튼 위에 올려졌을 때 호출되는 함수
  const handleMouseEnter = (buttonName: string) => {
    setHoveredButton(buttonName);
  };

  // 마우스가 버튼에서 나갔을 때 호출되는 함수
  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  // 앨범 클릭 시 호출되는 함수
  const handleAlbumClick = (id: number) => {
    navigate(`/conti-detail/${id}`);
  };

  // 버튼 클릭 시 호출되는 함수
  const handleButtonClick = (buttonName: string) => {
    setIsButtonClicked(buttonName);
    setTimeout(() => {
      navigate(`/upload?source=${buttonName}`);
    }, 1500);
  };

  // 선택된 콘티를 새로고침하는 함수
  const refreshSelectedConti = useCallback(() => {
    selectRandomConti(contiList);
  }, [contiList, selectRandomConti]);

  return {
    contiList,
    selectedConti,
    hoveredButton,
    isButtonClicked,
    handleMouseEnter,
    handleMouseLeave,
    handleAlbumClick,
    handleButtonClick,
    refreshSelectedConti,
  };
};
