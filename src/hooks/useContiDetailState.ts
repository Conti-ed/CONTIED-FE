import { useCallback, useState } from "react";
import { SERVER_URL } from "../api";
import { ContiType, SongType } from "../types";

interface OptionsPosition {
  x: number;
  y: number;
}

export interface ContiDetailState {
  activeOptions: number | null;
  optionsPosition: OptionsPosition;
  contiData: ContiType | undefined;
  isOwner: boolean;
  isFavorite: boolean;
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
  isFavorite: false,
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

  const toggleFavorite = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setState((prevState) => ({
      ...prevState,
      isFavorite: !prevState.isFavorite,
    }));
    const res = await fetch(`${SERVER_URL}/api/save?uid=${uid}&cid=${cid}`, {
      method: "POST",
    });
    const data = await res.json();

    console.log(res.status, data);
  };

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

  return { state, updateState, onDragEnd, toggleFavorite, songOptionsClick };
};

export default useContiDetailState;
