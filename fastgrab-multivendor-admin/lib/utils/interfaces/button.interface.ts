import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IGlobalComponentProps } from './global.interface';
import { MouseEventHandler } from 'react';

export interface ICustomButtonProps extends IGlobalComponentProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  rounded?: boolean;
  outlined?: boolean;
  icon?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  loading?: boolean;
}

interface IIconStyles {
  color: string;
}

export interface TextIconClickableProps extends IGlobalComponentProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  icon?: IconProp;
  iconStyles?: IIconStyles;
  title?: string;
  route?: string;
  loading?: boolean;
}
