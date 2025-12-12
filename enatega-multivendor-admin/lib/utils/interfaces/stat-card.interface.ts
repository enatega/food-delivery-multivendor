import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IGlobalComponentProps } from './global.interface';

export interface IStatsCardProps extends IGlobalComponentProps {
  label: string;
  total: number | string;
  description?: string;
  descriptionIcon?: IconDefinition;
  route?: string;
  icon?: IconDefinition;
  loading?: boolean;
  isClickable?: boolean;
  amountConfig?: {
    format: 'currency' | 'number';
    currency: string;
  };
}
