import { TSideBarFormPosition } from '../types/sidebar';
import { IGlobalComponentProps } from './global.interface';

export interface ICouponRestaurantResponse {
  discount: number;
  enabled: boolean;
  title: string;
  __typename: string;
  _id: string;
  endDate: string;
  lifeTimeActive: boolean;
}

export interface ICouponRestaurantGQLResponse {
  restaurantCoupons: ICouponRestaurantResponse[];
}

export interface ICouponRestaurantHeaderProps extends IGlobalComponentProps {
  setIsAddCouponVisible: (visible: boolean) => void;
}

export interface ICouponRestaurantMainComponentsProps
  extends IGlobalComponentProps {
  setIsAddCouponVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCoupon: React.Dispatch<
    React.SetStateAction<ICouponRestaurantResponse | null>
  >;
}

export interface ICouponRestaurantTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ICouponRestaurantAddFormComponentProps
  extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddCouponVisible: boolean;
  onHide: () => void;
  coupon: ICouponRestaurantResponse | null;
}
