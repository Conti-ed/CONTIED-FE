// Set Duration
export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${minutes}:${formattedSeconds}`;
  }
};

// Set Overall Duration
export const formatTotalDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else {
    return `${minutes}분`;
  }
};

// Adjust Date by Region upon Registration
export const parseLocalDateString = (dateString: string): Date => {
  if (!dateString) return new Date();

  // Z가 없고 타임존 정보(+/-)도 없는 경우 UTC로 간주하도록 'Z'를 붙여줍니다.
  const hasTimezone =
    dateString.includes("Z") ||
    (dateString.includes("T") &&
      (dateString.includes("+") ||
        dateString.lastIndexOf("-") > dateString.indexOf("T")));

  const normalizedString = hasTimezone ? dateString : `${dateString}Z`;
  return new Date(normalizedString);
};

// Utility function to format time
export const formatRelativeTime = (updatedAt: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - updatedAt.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds}초 전`;
  } else if (minutes < 60) {
    return `${minutes}분 전`;
  } else if (hours < 24) {
    return `${hours}시간 전`;
  } else if (days < 7) {
    return `${days}일 전`;
  } else if (weeks < 4) {
    return `${weeks}주 전`;
  } else if (months < 12) {
    return `${months}달 전`;
  } else {
    return `${years}년 전`;
  }
};
