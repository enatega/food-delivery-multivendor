import { IDropdownSelectItem } from '../global.interface';

// Errors
export interface IVendorErrors {
  _id: string[];
  name: string[];
  email: string[];
  password: string[];
  confirmPassword: string[];
  image: string[];
  firstName: string[];
  lastName: string[];
  phoneNumber: string[];
}

export interface IVendorForm {
  
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface IRestauransVendorDetailsForm {
  _id: IDropdownSelectItem | null;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
  image?: string;
  phoneNumber?: string;
}
