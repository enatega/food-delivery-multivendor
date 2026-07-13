import { MouseEventHandler } from 'react';
import { IGlobalComponentProps } from './global.interface';

export interface IRippleComponentProps extends IGlobalComponentProps {
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}
