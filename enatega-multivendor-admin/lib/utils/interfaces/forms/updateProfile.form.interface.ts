import { IDropdownSelectItem } from '../global.interface';

// Errors
export interface IUpdateProfileFormErrors {
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
  email: string[];
  orderprefix: string[];
}

export interface IUpdateProfileForm {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  address: string;
  deliveryTime: number;
  minOrder: number;
  salesTax: number;
  shopType: IDropdownSelectItem | null;
  cuisines: IDropdownSelectItem[];
  image: string;
  logo: string;
  email: string;
  orderprefix: string;
}
