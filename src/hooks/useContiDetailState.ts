import { useCallback, useState } from "react";
import { SERVER_URL } from "../api";
import { ContiType, SongType } from "../types";

interface OptionsPosition {
  x: number;
  y: number;
}

interface ContiDetailState {
  activeOptions: number | null;
  optionsPosition: OptionsPosition;
  contiData: ContiType | undefined;
  isOwner: boolean;
  songs: SongType[];
  showTitleModal: boolean;
  editTitleValue: string;
  showKeywordModal: boolean;
  showNewKeywordInput: boolean;
  editKeywordIndex: number | null;
  editValue: string;
  showOwnerMenu: boolean;
  ownerPosition: OptionsPosition;
  showDeleteConfirmModal: boolean;
  deletingSongId: number | null;
  mode: string;
}

const initialState: ContiDetailState = {
  activeOptions: null,
  optionsPosition: { x: 0, y: 0 },
  contiData: undefined,
  isOwner: false,
  songs: [],
  showTitleModal: false,
  editTitleValue: "",
  showKeywordModal: false,
  showNewKeywordInput: false,
  editKeywordIndex: null,
  editValue: "",
  showOwnerMenu: false,
  ownerPosition: { x: 0, y: 0 },
  showDeleteConfirmModal: false,
  deletingSongId: null,
  mode: "",
};

const useContiDetailState = (cid: number, uid: number) => {
  const [state, setState] = useState<ContiDetailState>(initialState);

  const updateState = (updates: Partial<ContiDetailState>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  };

  // When a Song is Dragged and Dropped
  const onDragEnd = useCallback(
    (result: any) => {
      const { destination, source } = result;
      if (!destination || source.index === destination.index) return;

      setState((prevState) => {
        const newSongs = Array.from(prevState.songs);
        const [reorderedItem] = newSongs.splice(source.index, 1);
        newSongs.splice(destination.index, 0, reorderedItem);

        return { ...prevState, songs: newSongs };
      });

      const updateOrder = async () => {
        try {
          const response = await fetch(
            `${SERVER_URL}/api/order?cid=${cid}&uid=${uid}&start=${source.index}&end=${destination.index}`,
            {
              method: "PUT",
            }
          );
          const data = await response.json();
          console.log(response.status, data);
        } catch (error) {
          console.error("Failed to update song order", error);
        }
      };
      updateOrder();
    },
    [cid, uid]
  );

  const songOptionsClick = (
    songId: number,
    event: React.MouseEvent<HTMLElement>
  ) => {
    const { x, y } = ((event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      return { x: rect.left - 88, y: rect.top + 10 };
    })(event);

    setState((prevState) => ({
      ...prevState,
      optionsPosition: { x, y },
      activeOptions: prevState.activeOptions === songId ? null : songId,
    }));
  };

  // Delete Confirmation Modal
  const deleteSong = useCallback(
    async (sid: number | undefined) => {
      const token = localStorage["accessToken"];
      updateState({ activeOptions: null });

      const res = await fetch(
        `${SERVER_URL}/api/song/${sid}?cid=${cid}&uid=${uid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setState((prevState) => ({
          ...prevState,
          songs: prevState.songs.filter((song) => song.id !== sid),
          contiData: data,
        }));
      }
    },
    [cid, uid]
  );

  return { state, updateState, onDragEnd, songOptionsClick, deleteSong };
};

export default useContiDetailState;
