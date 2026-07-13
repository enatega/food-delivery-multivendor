import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IGlobalComponentProps } from './global.interface';

export interface IPopupMenuItem<T> {
  fn: () => void;
  title?: string;
  icon?: IconDefinition;
  color: string;
  data: T;
}

export interface IPopupMenuComponentProps<T> extends IGlobalComponentProps {
  close: () => void;
  items: IPopupMenuItem<T>[];
}
