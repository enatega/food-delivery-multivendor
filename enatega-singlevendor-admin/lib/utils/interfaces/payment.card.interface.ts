import { IGlobalComponentProps } from './global.interface';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TPaymentType } from '../types/payment-type';

export interface IPaymentCardProps extends IGlobalComponentProps {
  name: string;
  description: string;
  isDetailsSubmitted: boolean;
  onClick: () => void;
  loading: boolean;
  icon: IconDefinition;
  type: TPaymentType;
}

export interface IPaymentHeaderProps extends IGlobalComponentProps {
  setIsAddPaymentVisible: (visible: boolean) => void;
}

export interface IPaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: IconDefinition;
  type: TPaymentType;
  isDetailsSubmitted?: boolean | null;
  onClick: () => void;
}
