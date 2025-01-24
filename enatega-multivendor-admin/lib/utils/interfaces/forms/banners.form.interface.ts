import { IDropdownSelectItem } from '../global.interface';

export type IBannersForm = {
  title: string;
  description: string;
  action: IDropdownSelectItem | null;
  screen: IDropdownSelectItem | null;
  file: string;
};

export interface IBannersErrors {
  title: string[];
  description: string[];
  action: string[];
  screen: string[];
  file: string[];
}
