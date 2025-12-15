import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IGlobalComponentProps } from './global.interface';

export interface IStatsCardProps extends IGlobalComponentProps {
  label: string;
  total: number;
  description?: string;
  route: string;
  currencySymbol?: string;
  icon?: IconDefinition;
  loading?: boolean;
  isClickable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SvgIcon?: React.ComponentType<any>;
  positiveTrending?: boolean;
  trendChange?: string;
  amountConfig?: {
    format: 'currency' | 'number';
    currency: string;
  };
}
