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
export const parseLocalDateString = (dateString: string): string => {
  const [datePart, timePart] = dateString.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [hourString, minuteString] = timePart.slice(0, -2).split(":");
  const ampm = timePart.slice(-2).toLowerCase();

  let hour = parseInt(hourString);
  const minute = parseInt(minuteString);

  if (ampm === "pm" && hour !== 12) {
    hour += 12;
  } else if (ampm === "am" && hour === 12) {
    hour = 0;
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  return utcDate.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
