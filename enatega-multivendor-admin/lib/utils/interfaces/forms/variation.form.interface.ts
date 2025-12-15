import { IDropdownSelectItem } from '../global.interface';
import { IFoodDealType } from '../food.interface';

export interface IDealFormValues {
  dealName: string;
  discountType: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface IVariationForm {
  _id?: string;
  title: string;
  price: number;
  discounted: number;
  addons: IDropdownSelectItem[] | null;
  isOutOfStock: boolean;
  __typename?: string;
  deal?: IDealFormValues | IFoodDealType | null;
}

export interface IVariationErrors {
  _id?: string[];
  title: string[];
  discounted: string[];
  price: string[];
  addons: string[];
  isOutOfStock: string[];
}
