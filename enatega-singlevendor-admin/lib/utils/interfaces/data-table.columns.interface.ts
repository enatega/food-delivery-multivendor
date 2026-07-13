import { IGlobalComponentProps } from './global.interface';

export interface ICommissionColumnProps extends IGlobalComponentProps {
  handleSave: (restaurantId: string) => void;
  handleCommissionRateChange: (restaurantId: string, value: number) => void;
}
