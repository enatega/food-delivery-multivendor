import { ChangeEvent } from 'react';
import { IGlobalComponentProps } from './global.interface';

export interface ICustomInputSwitchComponentProps
  extends IGlobalComponentProps {
  loading?: boolean;
  disabled?: boolean;
  isActive: boolean;
  label?: string;
  reverse?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
