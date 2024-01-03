import { atom } from "recoil";
import { SongType } from "./types";

export const songsAtom = atom<SongType[]>({ key: "songs", default: [] });
