import { ReactNode } from 'react';
import { IGlobalComponentProps } from './global.interface';

interface IDialogButton {
  label?: string;
  icon?: string;
  textColor?: string;
  bgColor?: string;
}

interface IDialogButtonConfig {
  primaryButtonProp?: IDialogButton;
  secondaryButtonProp?: IDialogButton;
}
export interface IDialogComponentProps extends IGlobalComponentProps {
  title?: string;
  description?: string;
  buttonConfig?: IDialogButtonConfig;
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  message?: string;
  loading?: boolean;
}

export interface ICustomDialogProps {
  visible: boolean;
  onHide: () => void;
  children: ReactNode;
  width?: string;
  height?: string;
  showCloseButton?: boolean;
  className?: string;
}