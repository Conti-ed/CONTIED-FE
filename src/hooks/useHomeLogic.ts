// hooks/useHomeLogic.ts
import { useState, useEffect } from "react";
import { NavigateFunction } from "react-router-dom";

interface Conti {
  id: string;
  title: string;
  thumbnail: string;
}

export const useHomeLogic = (navigate: NavigateFunction) => {
  const userName = "준석";
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState<string | null>(null);
  const [contiList, setContiList] = useState<Conti[]>([]);
  const [selectedConti, setSelectedConti] = useState<Conti | null>(null);

  useEffect(() => {
    const storedContiData = Object.keys(localStorage)
      .filter((key) => key.startsWith("conti_"))
      .map((key) => JSON.parse(localStorage.getItem(key)!));

    setContiList(storedContiData);
    if (storedContiData.length > 0) {
      setSelectedConti(
        storedContiData[Math.floor(Math.random() * storedContiData.length)]
      );
    }
  }, []);

  const handleMouseEnter = (buttonName: string) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleAlbumClick = (id: string) => {
    navigate(`/conti-detail/${id}`);
  };

  const handleButtonClick = (buttonName: string) => {
    setIsButtonClicked(buttonName);
    setTimeout(() => {
      navigate(`/upload?source=${buttonName}`);
    }, 1500);
  };

  return {
    userName,
    selectedConti,
    hoveredButton,
    isButtonClicked,
    handleMouseEnter,
    handleMouseLeave,
    handleAlbumClick,
    handleButtonClick,
  };
};
