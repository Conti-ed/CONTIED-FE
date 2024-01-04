import { atom } from "recoil";
import { SongType } from "./types";

export const isDarkAtom = atom({ key: "isDark", default: true });

export const songsAtom = atom<SongType[]>({ key: "songs", default: [] });
