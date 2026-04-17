import { useEffect, useMemo, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { ContiType } from "../types";
import {
  getConti,
  getUserProfile,
  deleteContiById,
  patchConti,
  PatchContiDto,
  getLikedContis,
  likeConti,
  unlikeConti,
} from "../utils/axios";
import { getAccessToken } from "../utils/auth";

interface Params {
  contiId: string | undefined;
  navigate: NavigateFunction;
  isFromUpload: boolean;
}

const useContiDetailLogic = ({ contiId, navigate, isFromUpload }: Params) => {
  const queryClient = useQueryClient();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddSongLoading] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: contiData, isLoading: isContiLoading } = useQuery<ContiType>(
    ["cid", contiId],
    () => (contiId ? getConti(Number(contiId)) : Promise.resolve(null)),
    {
      staleTime: 1000 * 60 * 5,
      retry: false,
      onError: (error) => {
        console.error("Failed to fetch conti data:", error);
      },
    }
  );

  const { data: userProfile } = useQuery("userProfile", getUserProfile, {
    retry: false,
    staleTime: 1000 * 60 * 30,
    enabled: !!getAccessToken(),
  });

  const isOwner = useMemo(() => {
    if (!userProfile || !contiData?.User) return false;
    if (userProfile.id && contiData.User.id) {
      const matchId = userProfile.id === contiData.User.id;
      if (matchId) return true;
    }
    const myEmail = userProfile.email?.toLowerCase().trim();
    const creatorEmail = contiData.User.email?.toLowerCase().trim();
    const matchEmail = myEmail && creatorEmail && myEmail === creatorEmail;
    return !!matchEmail;
  }, [userProfile, contiData]);

  const { data: likedContis } = useQuery<ContiType[]>("likedContis", getLikedContis, {
    staleTime: 1000 * 60 * 5,
    enabled: !!getAccessToken(),
  });

  useEffect(() => {
    if (contiId && likedContis) {
      setIsFavorite(likedContis.some((c) => c.id === Number(contiId)));
    }
  }, [contiId, likedContis]);

  // 편집 진입 시점에 최신 contiData 로 입력값 채우기 (race condition 방지)
  useEffect(() => {
    if (isEditMode && contiData) {
      setEditedTitle(contiData.title ?? "");
      setEditedDescription(contiData.description ?? "");
    }
  }, [isEditMode, contiData]);

  const totalDuration = useMemo(() => {
    if (!contiData || !contiData.ContiToSong) return 0;
    return contiData.ContiToSong.reduce((sum, item) => {
      return sum + (item.song.duration || 0);
    }, 0);
  }, [contiData]);

  const handleHeartClick = async () => {
    if (!contiId || !contiData) return;

    const prevIsFavorite = isFavorite;
    const newIsFavorite = !prevIsFavorite;
    const numericId = Number(contiId);

    await queryClient.cancelQueries("likedContis");
    const prevLiked = queryClient.getQueryData<ContiType[]>("likedContis");

    setIsFavorite(newIsFavorite);
    queryClient.setQueryData<ContiType[]>("likedContis", (old = []) => {
      if (newIsFavorite) {
        if (old.some((c) => c.id === numericId)) return old;
        return [contiData, ...old];
      }
      return old.filter((c) => c.id !== numericId);
    });

    try {
      if (newIsFavorite) {
        await likeConti(numericId);
      } else {
        await unlikeConti(numericId);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setIsFavorite(prevIsFavorite);
      if (prevLiked !== undefined) {
        queryClient.setQueryData("likedContis", prevLiked);
      }
      setNotification({
        message: "좋아요 반영에 실패했어요. 다시 시도해주세요.",
        type: "error",
      });
    }
  };

  const handleEditConti = () => {
    if (contiData) {
      setEditedTitle(contiData.title ?? "");
      setEditedDescription(contiData.description ?? "");
    }
    setIsEditMode(true);
  };

  const handleDeleteConti = async () => {
    if (!contiId) return;

    const numericId = Number(contiId);
    const prevLiked = queryClient.getQueryData<ContiType[]>("likedContis");

    // 낙관적: 캐시에서 제거 후 이동
    queryClient.setQueryData<ContiType[]>("likedContis", (old = []) =>
      old.filter((c) => c.id !== numericId)
    );
    queryClient.removeQueries(["cid", contiId]);

    try {
      await deleteContiById(numericId);
      queryClient.invalidateQueries(["myContis"]);
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete conti:", error);
      if (prevLiked !== undefined) {
        queryClient.setQueryData("likedContis", prevLiked);
      }
      setNotification({
        message: "콘티 삭제에 실패했습니다. 다시 시도해 주세요.",
        type: "error",
      });
    }
  };

  const handleBackClick = () => {
    if (isFromUpload) {
      navigate("/home");
    } else {
      navigate(-1);
    }
  };

  const handleAddSongClick = () => {
    navigate("/search", {
      state: { isFocused: true, query: "", contiId: contiId },
    });
  };

  const handleDescriptionClick = () => {
    setIsDescriptionOpen(true);
  };

  const handleCloseModal = () => {
    setIsDescriptionOpen(false);
  };

  const applyOptimisticPatch = (patch: Partial<ContiType>) => {
    queryClient.setQueryData<ContiType | undefined>(["cid", contiId], (old) =>
      old ? { ...old, ...patch, updatedAt: new Date().toISOString() } : old
    );
    // 좋아요 목록에도 제목/설명 변경 반영
    queryClient.setQueryData<ContiType[] | undefined>("likedContis", (old) => {
      if (!old) return old;
      return old.map((c) =>
        c.id === Number(contiId) ? { ...c, ...patch } : c
      );
    });
  };

  const handleSaveEdit = async () => {
    if (!contiId || !contiData) return;

    if (!editedTitle.trim()) {
      setEditError("제목은 필수입니다!");
      return;
    }

    setEditError(null);

    const trimmedTitle = editedTitle.trim();
    const trimmedDesc = editedDescription.trim();
    const prevConti = contiData;

    const dto: PatchContiDto = {
      title: trimmedTitle,
      description: trimmedDesc,
      songs: contiData.ContiToSong.map((cts) => cts.songId),
    };

    // 1) 낙관적 반영 + 즉시 뷰 모드 전환
    applyOptimisticPatch({ title: trimmedTitle, description: trimmedDesc });
    setIsEditMode(false);
    setNotification({ message: "콘티가 업데이트되었어요!", type: "success" });

    try {
      const saved = await patchConti(Number(contiId), dto);
      if (saved) {
        queryClient.setQueryData(["cid", contiId], saved);
      }
      // 목록 갱신은 백그라운드로만
      queryClient.invalidateQueries(["myContis"]);
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error("콘티 수정 실패:", error);

      // 롤백
      queryClient.setQueryData(["cid", contiId], prevConti);
      setIsEditMode(true);
      setEditError(axiosError.response?.data?.message || "콘티 수정에 실패했습니다.");
      setNotification({
        message: "콘티 수정에 실패했어요...",
        type: "error",
      });
    }
  };

  const handleCancelEdit = () => {
    if (contiData) {
      setEditedTitle(contiData.title ?? "");
      setEditedDescription(contiData.description ?? "");
    }
    setEditError(null);
    setIsEditMode(false);
    setSelectedSongs(new Set());
  };

  const handleSongSelect = (id: number, selected: boolean) => {
    setSelectedSongs((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelectedSongs = async () => {
    if (selectedSongs.size === 0) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelectedSongs = async () => {
    if (!contiData || !contiId) {
      return;
    }

    const prevConti = contiData;
    const keptContiToSong = contiData.ContiToSong.filter(
      (item) => !selectedSongs.has(item.song.id)
    );
    const updatedSongIds = keptContiToSong.map((item) => item.song.id);

    const dto: PatchContiDto = {
      title: contiData.title,
      description: contiData.description,
      songs: updatedSongIds,
    };

    // 1) 낙관적: ContiToSong 배열 즉시 갱신
    applyOptimisticPatch({ ContiToSong: keptContiToSong });
    setSelectedSongs(new Set());
    setIsDeleteModalOpen(false);
    setNotification({
      message: "선택한 곡들이 삭제되었습니다.",
      type: "success",
    });

    try {
      const saved = await patchConti(Number(contiId), dto);
      if (saved) {
        queryClient.setQueryData(["cid", contiId], saved);
      }
      queryClient.invalidateQueries(["myContis"]);
    } catch (error) {
      console.error("삭제 과정에서 오류가 있나봐요...", error);
      queryClient.setQueryData(["cid", contiId], prevConti);
      setNotification({
        message: "곡 삭제에 실패했습니다. 다시 시도해 주세요.",
        type: "error",
      });
    }
  };

  const cancelDeleteSelectedSongs = () => {
    setIsDeleteModalOpen(false);
  };

  return {
    contiData,
    isContiLoading,
    isOwner,
    isFavorite,
    isAddSongLoading,
    isDescriptionOpen,
    isEditMode,
    editedTitle,
    setEditedTitle,
    editedDescription,
    setEditedDescription,
    editError,
    selectedSongs,
    notification,
    setNotification,
    isDeleteModalOpen,
    totalDuration,
    handleHeartClick,
    handleEditConti,
    handleDeleteConti,
    handleBackClick,
    handleAddSongClick,
    handleDescriptionClick,
    handleCloseModal,
    handleSaveEdit,
    handleCancelEdit,
    handleSongSelect,
    handleDeleteSelectedSongs,
    confirmDeleteSelectedSongs,
    cancelDeleteSelectedSongs,
  };
};

export default useContiDetailLogic;
