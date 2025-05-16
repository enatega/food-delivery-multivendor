import { IGlobalComponentProps } from './global.interface';

export interface IBannerRestaurantResponse {
  _id: string;
  title: string;
  description: string;
  file: string;
  foodId: string;
  restaurant: string;
  isActive: boolean;
  foodImage?: string;
  foodTitle?: string;
  displayImage?: string;
}

export interface IBannerRestaurantDataResponse {
  bannerRestaurants: IBannerRestaurantResponse[];
}

export interface IBannerRestaurantHeaderComponentsProps extends IGlobalComponentProps {
  setIsAddBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IBannerRestaurantMainComponentsProps extends IGlobalComponentProps {
  setIsAddBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setBanner: React.Dispatch<React.SetStateAction<IBannerRestaurantResponse | null>>;
  restaurantId: string;
}

export interface IBannerRestaurantAddFormComponentProps extends IGlobalComponentProps {
  isAddBannerVisible: boolean;
  banner: IBannerRestaurantResponse | null;
  onHide: () => void;
  restaurantId: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

export interface IBannerRestaurantTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type IBannerRestaurantForm = {
  title: string;
  description: string;
  foodId: { label?: string; code?: string } | null; // Adjusted to match the IDropdownSelectItem structure but without category
  file: string;
}

export interface IBannerRestaurantErrors {
  title: string[];
  description: string[];
  foodId: string[];
  file: string[];
}