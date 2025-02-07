import { ChangeEvent, CSSProperties } from 'react';

export interface ICustomTextAreaField {
  label?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  showLabel?: boolean;
  value: string | undefined;
  name?: string;
  style?: CSSProperties;
  maxLength?: number;
  error?:string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}
