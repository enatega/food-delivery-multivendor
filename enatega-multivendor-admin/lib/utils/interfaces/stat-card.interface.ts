import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IGlobalComponentProps } from './global.interface';

export interface IStatsCardProps extends IGlobalComponentProps {
  label: string;
  total: number;
  description?: string;
  route: string;
  icon?: IconDefinition;
  loading?: boolean;
  amountConfig?: {
    format: 'currency' | 'number';
    currency: string;
  };
}
