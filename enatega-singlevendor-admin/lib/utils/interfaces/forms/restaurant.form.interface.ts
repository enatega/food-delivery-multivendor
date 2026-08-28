import { IDropdownSelectItem } from '../global.interface';

// Errors
export interface IRestaurantFormErrors {
  name: string[];
  username: string[];
  password: string[];
  confirmPassword: string[];
  address: string[];
  deliveryTime: string[];
  minOrder: string[];
  salesTax: string[];
  shopType: string[];
  cuisines: string[];
  image: string[];
  logo: string[];
  phoneNumber: string[];
}

export interface IRestaurantForm {
  name: string;
  username: string;
  password: string;
  phoneNumber?:string;
  confirmPassword: string;
  address: string;
  deliveryTime: number;
  minOrder: number;
  salesTax: number;
  shopType: IDropdownSelectItem | null;
  cuisines: IDropdownSelectItem[];
  image: string;
  logo: string;
}


export interface IRestaurantDeliveryForm {
  minDeliveryFee: number | null;
  deliveryDistance: number | null;
  deliveryFee: number | null;
}

export interface IRestaurantDeliveryFormErrors {
  minDeliveryFee: string[];
  deliveryDistance: string[];
  deliveryFee: string[];
}
