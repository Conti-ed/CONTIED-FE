import { useState, useEffect, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";

interface Conti {
  id: string;
  title: string;
  thumbnail: string;
}

export const useHomeLogic = (navigate: NavigateFunction) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<string | null>(null);
  const [contiList, setContiList] = useState<Conti[]>([]);
  const [selectedConti, setSelectedConti] = useState<Conti | null>(null);

  // 콘티 목록 중에서 랜덤으로 하나 선택하는 함수
  const selectRandomConti = useCallback((list: Conti[]) => {
    if (list.length > 0) {
      const randomIndex = Math.floor(Math.random() * list.length);
      setSelectedConti(list[randomIndex]);
    } else {
      setSelectedConti(null); // 콘티 목록이 비어 있을 경우
    }
  }, []);

  // 로컬 스토리지에서 콘티 데이터를 불러오고, 없을 경우 안전하게 처리
  useEffect(() => {
    const storedContiData = Object.keys(localStorage)
      .filter((key) => key.startsWith("conti_"))
      .map((key) => {
        const conti = localStorage.getItem(key);
        return conti ? JSON.parse(conti) : null; // null인 경우 안전하게 처리
      })
      .filter((conti): conti is Conti => conti !== null); // null 값을 제외

    setContiList(storedContiData); // 콘티 목록 설정
    selectRandomConti(storedContiData); // 랜덤으로 콘티 선택
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
  const handleAlbumClick = (id: string) => {
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
