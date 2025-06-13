import { IGlobalComponentProps } from './global.interface';

export interface IActionMenuItem<T> extends IGlobalComponentProps {
  label: string;
  command?: (data?: T) => void;
}

export interface IActionMenuProps<T> extends IGlobalComponentProps {
  items?: IActionMenuItem<T>[];
  data: T;
  isOpen?: boolean;
  onToggle?: () => void;
}
