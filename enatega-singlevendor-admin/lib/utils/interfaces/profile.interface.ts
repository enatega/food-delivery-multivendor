import { IGlobalComponentProps } from './global.interface';

export interface IProfileHeaderProps extends IGlobalComponentProps {
  setIsUpdateProfileVisible: (visible: boolean) => void;
}

export interface IRestaurantProfileProps extends IGlobalComponentProps {
  restaurantName: string;
  userName: string;
  password: string;
  name: string;
  address: string;
  deliveryTime: number;
  minOrder: number;
  salesTax: number;
  orderPrefix: string;
  shopCategory: string;
  cuisines: string;
}

export interface IInfoItemProps extends IGlobalComponentProps {
  label: string;
  value: string | number;
}
