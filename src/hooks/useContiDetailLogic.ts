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
      onSuccess: (data) => {
        setEditedTitle(data.title);
        setEditedDescription(data.description || "");
      },
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
  });

  useEffect(() => {
    if (contiId && likedContis) {
      setIsFavorite(likedContis.some((c) => c.id === Number(contiId)));
    }
  }, [contiId, likedContis]);

  const totalDuration = useMemo(() => {
    if (!contiData || !contiData.ContiToSong) return 0;
    return contiData.ContiToSong.reduce((sum, item) => {
      return sum + (item.song.duration || 0);
    }, 0);
  }, [contiData]);

  const handleHeartClick = async () => {
    if (!contiId) return;

    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);

    queryClient.setQueryData<ContiType[] | undefined>("likedContis", (old) => {
      if (!old || !contiData) return old;
      if (newIsFavorite) {
        return [...old, contiData];
      } else {
        return old.filter((c) => c.id !== Number(contiId));
      }
    });

    try {
      if (newIsFavorite) {
        await likeConti(Number(contiId));
      } else {
        await unlikeConti(Number(contiId));
      }
      queryClient.invalidateQueries("likedContis");
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setIsFavorite(!newIsFavorite);
      queryClient.invalidateQueries("likedContis");
    }
  };

  const handleEditConti = () => {
    setIsEditMode(true);
  };

  const handleDeleteConti = async () => {
    if (contiId) {
      try {
        await deleteContiById(Number(contiId));

        const allContis = JSON.parse(localStorage.getItem("allContis") || "[]");
        const updatedContis = allContis.filter(
          (conti: ContiType) => conti.id !== Number(contiId)
        );
        localStorage.setItem("allContis", JSON.stringify(updatedContis));
        localStorage.removeItem(`conti_${contiId}`);

        const favoriteContis = JSON.parse(localStorage.getItem("favoriteContis") || "{}");
        delete favoriteContis[contiId];
        localStorage.setItem("favoriteContis", JSON.stringify(favoriteContis));

        queryClient.removeQueries(["cid", contiId]);
        queryClient.invalidateQueries(["myContis"]);
        queryClient.invalidateQueries("likedContis");

        navigate(-1);
      } catch (error) {
        console.error("Failed to delete conti:", error);
        alert("콘티 삭제에 실패했습니다. 다시 시도해 주세요.");
      }
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

  const handleSaveEdit = async () => {
    if (!contiId) return;

    if (!editedTitle.trim()) {
      setEditError("제목은 필수입니다!");
      return;
    }

    setEditError(null);

    const dto: PatchContiDto = {
      title: editedTitle.trim(),
      description: editedDescription.trim(),
      songs: contiData?.ContiToSong.map((cts) => cts.songId) || [],
    };

    try {
      await patchConti(Number(contiId), dto);
      queryClient.invalidateQueries(["cid", contiId]);
      queryClient.invalidateQueries(["myContis"]);
      queryClient.invalidateQueries("allConties");
      queryClient.invalidateQueries("likedContis");

      const updatedContiData = await getConti(Number(contiId));
      localStorage.setItem(`conti_${contiId}`, JSON.stringify(updatedContiData));

      setNotification({ message: "콘티가 업데이트되었어요!", type: "success" });
      setIsEditMode(false);
    } catch (error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error("콘티 수정 실패:", error);
      setEditError(axiosError.response?.data?.message || "콘티 수정에 실패했습니다.");
      setNotification({ message: "콘티 수정에 실패했어요...", type: "error" });
    }
  };

  const handleCancelEdit = () => {
    if (contiData) {
      setEditedTitle(contiData.title);
      setEditedDescription(contiData.description || "");
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
    if (!contiData) {
      alert("콘티 데이터를 불러오는 중입니다.");
      return;
    }

    try {
      const updatedSongIds = contiData.ContiToSong.filter(
        (item) => !selectedSongs.has(item.song.id)
      ).map((item) => item.song.id);

      const dto: PatchContiDto = {
        title: contiData.title,
        description: contiData.description,
        songs: updatedSongIds,
      };
      await patchConti(Number(contiId), dto);

      const updatedContiData = await getConti(Number(contiId));
      localStorage.setItem(`conti_${contiId}`, JSON.stringify(updatedContiData));

      queryClient.setQueryData(["cid", contiId], updatedContiData);
      queryClient.invalidateQueries(["myContis"]);
      queryClient.invalidateQueries("allConties");
      queryClient.invalidateQueries("likedContis");

      setSelectedSongs(new Set());
      setNotification({ message: "선택한 곡들이 삭제되었습니다.", type: "success" });
    } catch (error) {
      console.error("삭제 과정에서 오류가 있나봐요...", error);
      setNotification({ message: "곡 삭제에 실패했습니다. 다시 시도해 주세요.", type: "error" });
    } finally {
      setIsDeleteModalOpen(false);
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
