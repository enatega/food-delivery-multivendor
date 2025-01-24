import { IGlobalComponentProps } from './global.interface';

export interface IActionMenuItem<T> extends IGlobalComponentProps {
  label: string;
  command?: (data?: T) => void;
}

export interface IActionMenuProps<T> extends IGlobalComponentProps {
  disabled?: boolean;
  items?: IActionMenuItem<T>[];
  data: T;
}
