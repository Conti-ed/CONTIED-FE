export interface UserInfo {
  nickname: string;
  email: string;
}

export type KeywordType = {
  id?: number;
  name: string;
};

export type SongType = {
  id: number;
  title: string;
  artist: string;
  releaseDate?: string;
  youtubeUrl?: string;
  lyrics?: string;
  duration: number;
  order: number;
  tempo: number;
  keyScale: string;
  danceability: number;
};

export type SheetType = {
  id: number;
  filename: string;
  size: number;
};

export type ContiType = null | {
  id: number;
  owner: UserInfo;
  title: string;
  keywords: string[];
  songs: SongType[];
  sheet: SheetType;
  thumbnail: string;
  description: string;
  duration: number;
  youtubeUrl: string;
  updatedAt: string;
  createdAt: string;
};

export type ModalType =
  | "ConfirmDeleteSong"
  | "ConfirmDeleteConti"
  | "ModifyKeywords"
  | "AddToMyConti"
  | "ModifyTitle"
  | null;
