import { atom } from "recoil";
import { ContiType, ModalType, SongType } from "./types";

export const isDarkAtom = atom({ key: "isDark", default: false });

export const isLoginAtom = atom({ key: "isLogin", default: false });

export const isDrawerOpenAtom = atom({ key: "isDrawerOpen", default: false });

export const fileUploadAtom = atom<File | null>({
  key: "fileUpload",
  default: null,
});

export const contiesAtom = atom<ContiType[] | null>({
  key: "conties",
  default: null,
});

export const songsAtom = atom<SongType[]>({ key: "songs", default: [] });

export const modalAtom = atom<{
  isShow: boolean;
  modalType: ModalType;
  id: number | null;
}>({
  key: "isShowModal",
  default: {
    isShow: false,
    modalType: null,
    id: null,
  },
});
