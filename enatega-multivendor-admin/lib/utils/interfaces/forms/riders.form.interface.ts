import { IDropdownSelectItem } from '../global.interface';

export interface IRiderForm {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  zone: IDropdownSelectItem | null;
  phone: number | null;
  // vehicleType: IDropdownSelectItem | null;
}

export interface IRiderErrors {
  name: string[];
  username: string[];
  password: string[];
  confirmPassword: string[];
  zone: string[];
  phone: string[];
  // vehicleType: string[];
}
