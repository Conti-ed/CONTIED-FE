import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { useQueryClient } from "react-query";
import { postContiByAi } from "../utils/axios";
import { ContiType } from "../types";
import AiContiGenerating from "./AiContiGenerating";

interface AiParams {
  keywords: string[];
  bibleVerseRange: string | null;
  createdAt: number;
}

interface RegenerateButtonProps {
  contiId: string;
  isOwner: boolean;
}

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 400;
  color: #4f8eec;
  background-color: transparent;
  border: 1.5px solid #4f8eec;
  border-radius: 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #eef4ff;
  }

  &:active {
    background-color: #d7e4ff;
  }
`;

const RegenerateButton: React.FC<RegenerateButtonProps> = ({
  contiId,
  isOwner,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const rawParams = localStorage.getItem(`conti_ai_params_${contiId}`);
  if (!rawParams || !isOwner) {
    return null;
  }

  let savedParams: AiParams;
  try {
    savedParams = JSON.parse(rawParams) as AiParams;
  } catch {
    return null;
  }

  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      "같은 키워드와 말씀으로 새 콘티를 만들까요? 기존 콘티는 그대로 남아요."
    );
    if (!confirmed) return;

    setIsRegenerating(true);
    try {
      const seed = Date.now() % 1_000_000;
      const data = await postContiByAi(
        savedParams.keywords,
        savedParams.bibleVerseRange,
        seed
      );

      const contiData = {
        id: data.id,
        title: data.title,
        description: data.description,
        userId: data.userId,
        updatedAt: data.updatedAt,
        duration: data.duration,
        thumbnail: data.thumbnail || "/images/WhitePiano.png",
      };
      localStorage.setItem(`conti_${contiData.id}`, JSON.stringify(contiData));
      localStorage.setItem(
        `conti_ai_params_${data.id}`,
        JSON.stringify({
          keywords: savedParams.keywords,
          bibleVerseRange: savedParams.bibleVerseRange,
          createdAt: Date.now(),
        })
      );

      if (data && Array.isArray(data.ContiToSong)) {
        queryClient.setQueryData<ContiType>(
          ["cid", String(data.id)],
          data as ContiType
        );
      }

      queryClient.invalidateQueries(["myContis"]);

      navigate(`/conti/${data.id}`, { state: { fromUpload: true } });
    } catch (error) {
      console.error("Failed to regenerate AI-based conti:", error);
      let message = "서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          message = "생성이 너무 오래 걸렸어요. 다시 시도해주세요.";
        } else if (error.response?.status === 429) {
          message = "요청이 많아요. 잠시 뒤에 다시 시도해주세요.";
        } else if (error.response?.status === 400) {
          message = "키워드나 성경 구절을 다시 확인해주세요.";
        } else if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          message = "로그인이 만료되었어요. 다시 로그인해주세요.";
        }
      }
      alert(message);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isRegenerating) {
    return <AiContiGenerating />;
  }

  return (
    <Button type="button" onClick={handleRegenerate}>
      🔄 다시 만들기
    </Button>
  );
};

export default RegenerateButton;
