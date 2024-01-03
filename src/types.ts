export type KeywordType = {
  id?: number;
  name: string;
};

export type SongType = {
  id?: number;
  title: string;
  singer: string;
  releaseDate?: Date;
  youtubeUrl?: string;
  lyrics?: string;
  conti_id?: number;
};
