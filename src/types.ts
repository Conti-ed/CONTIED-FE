export type KeywordType = {
  id?: number;
  name: string;
};

export type SongType = {
  id?: number;
  title: string;
  artist: string;
  releaseDate?: string;
  youtubeUrl?: string;
  lyrics?: string;
};

export type ContiType = null | {
  description: string;
  duration: number;
  id: number;
  keywords: string[];
  owner: number;
  sheet?: number;
  songs: number[];
  thumbnail: string;
  updated_at: string;
  created_at: string;
  youtube_url: string;
};
