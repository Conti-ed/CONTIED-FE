import { atom } from "recoil";
import { SongType } from "./types";

export const isDarkAtom = atom({ key: "isDark", default: true });

export const isDrawerOpenAtom = atom({ key: "isDrawerOpen", default: false });

export const fileUploadAtom = atom<File | null>({
  key: "fileUpload",
  default: null,
});

export const songsAtom = atom<SongType[]>({ key: "songs", default: [] });
