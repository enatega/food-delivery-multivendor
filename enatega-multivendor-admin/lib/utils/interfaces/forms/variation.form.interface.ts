import { IDropdownSelectItem } from '../global.interface';

export interface IVariationForm {
  _id?: string;
  title: string;
  price: number;
  discounted: number;
  addons: IDropdownSelectItem[] |null;
  isOutOfStock: boolean;
  __typename?:string
}

export interface IVariationErrors {
  _id?: string[];
  title: string[];
  discounted: string[];
  price: string[];
  addons:string[];
  isOutOfStock: string[];
}
