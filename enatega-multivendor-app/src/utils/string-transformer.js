export const toTitleCase = (str) => {
  return str
    .replace(/_/g, ' ') // replace all underscores with spaces
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};