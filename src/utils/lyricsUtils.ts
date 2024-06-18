export const extractWordsFromLyrics = (
  lyrics: string | null | undefined
): string[] => {
  if (!lyrics) {
    return [];
  }

  const words = lyrics
    .split(/\s+/)
    .map((word) => word.replace(/[^\w가-힣]/g, "").toLowerCase()) // 한국어 처리
    .filter((word) => word.length > 1);
  return words;
};
