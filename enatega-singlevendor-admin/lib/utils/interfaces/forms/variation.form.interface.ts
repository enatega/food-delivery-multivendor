import { IDropdownSelectItem } from '../global.interface';
import { IFoodDealType } from '../food.interface';
import { IDeal as IAdminDeal } from '@/lib/ui/screens/super-admin/management/deals';

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
  discounted?: number;
  addons: IDropdownSelectItem[] | string[] | null;
  isOutOfStock: boolean;
  __typename?: string;
  deal?: IDealFormValues | IFoodDealType | IAdminDeal | null;
}

export interface IVariationErrors {
  _id?: string[];
  title: string[];
  discounted: string[];
  price: string[];
  addons: string[];
  isOutOfStock: string[];
}
