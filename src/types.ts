export type UserType = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  created_at: string;
  updated_at: string;
};

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
};

export type SheetType = {
  id: number;
  filename: string;
  size: number;
};

export type ContiType = null | {
  id: number;
  owner: UserType;
  keywords: string[];
  songs: SongType[];
  sheet: SheetType;
  thumbnail: string;
  description: string;
  duration: number;
  youtube_url: string;
  updated_at: string;
  created_at: string;
};
