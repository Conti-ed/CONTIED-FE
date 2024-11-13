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
  releaseDate?: string | null;
  youtubeUrl?: string;
  lyrics?: string;
  duration: number;
  order?: number;
  tempo?: number;
  keyScale?: string;
  danceability?: number;
  thumbnail?: string;
  videoId?: string;
  state: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SheetType = {
  id: number;
  filename: string;
  size: number;
};

export type ContiToSongType = {
  song: SongType;
  id: number;
  contiId: number;
  createdAt: string;
  songId: number;
};

export type ContiType = {
  id: number;
  User: UserInfo;
  title: string;
  keywords?: string[];
  ContiToSong: ContiToSongType[];
  sheet?: SheetType;
  thumbnail: string;
  description: string;
  duration: number;
  youtubeUrl: string;
  state?: string;
  createdAt: string;
  updatedAt: string;
};

export type ModalType =
  | "ConfirmDeleteSong"
  | "ConfirmDeleteConti"
  | "ModifyKeywords"
  | "AddToMyConti"
  | "ModifyTitle"
  | null;
