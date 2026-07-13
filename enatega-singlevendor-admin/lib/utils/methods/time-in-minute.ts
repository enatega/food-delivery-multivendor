export const getTimeInMinutesFromString = (
  time: string | null
): number | null => {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
