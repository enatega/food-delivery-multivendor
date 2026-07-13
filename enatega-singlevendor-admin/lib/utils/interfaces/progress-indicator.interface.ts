import { IGlobalComponentProps } from './global.interface';

export interface CustomProgressIndicatorComponentProps
  extends IGlobalComponentProps {
  size?: string;
  strokeWidth?: string;
  fill?: string;
  animationDuration?: string;
}
