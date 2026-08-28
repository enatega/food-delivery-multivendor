import { TTextCase } from '../types';

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const toTextCase = (text: string, type: TTextCase): string => {
  let result: string = '';
  switch (type) {
    case 'lower':
      result = text.toLowerCase();
      break;
    case 'upper':
      result = text.toUpperCase();
      break;
    case 'title':
      result = toTitleCase(text);
      break;
    default:
      result = text;
  }

  return result;
};
