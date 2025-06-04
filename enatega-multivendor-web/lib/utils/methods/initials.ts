export const getInitials = (name: string | null | undefined): string => {
  // Handle null or undefined input
  if (name == null) {
    return '';
  }

  // Ensure input is a string
  const nameToParse = String(name);

  const words = nameToParse.trim().split(/\s+/);

  // Handle empty string after trimming
  if (words.length === 0) {
    return '';
  }

  if (words.length > 1) {
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  return words[0].charAt(0).toUpperCase();
};