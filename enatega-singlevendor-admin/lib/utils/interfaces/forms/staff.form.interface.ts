import { IDropdownSelectItem } from '../global.interface';

export interface IStaffForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string | number;
  isActive: boolean;
  permissions: IDropdownSelectItem[];
}

export interface IStaffErrors {
  name: string[];
  email: string[];
  password: string[];
  confirmPassword: string[];
  phone: string[];
  isActive: string[];
  permissions: string[];
}
