export const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str
    .replace(/_/g, ' ') // replace all underscores with spaces
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};