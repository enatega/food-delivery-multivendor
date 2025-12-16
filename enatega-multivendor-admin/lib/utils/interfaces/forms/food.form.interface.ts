import { IDropdownSelectItem } from '../global.interface';
import { IFoodDealType } from '../food.interface'; // IFoodDealType definition
import { IDeal as IAdminDeal } from '@/lib/ui/screens/super-admin/management/deals'; // IDeal definition (aliased)

// Errors
export interface IFoodErrors {
  title: string[];
  description: string[];
  image: string[];
  category: string[];
  subCategory: string[];
  inventory: string[];
  uom: string[];
  minQuantity: string[];
  maxQuantity: string[];
}

export interface IFoodDetailsForm {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: IDropdownSelectItem | null;
  subCategory: IDropdownSelectItem | null;
  inventory?: number | null;
  uom?: string;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  isActive: boolean; // Added
  __typename?: string; // Added
  isOutOfStock: boolean; // Added
}

export interface IDeal {
  dealName: string;
  discountType: string;
  startDate: string; // ISOString
  endDate: string; // ISOString
  discountValue: number;
  isActive: boolean;
}

// Moved from add-deal.tsx
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
  addons: IDropdownSelectItem[] | string[] | null; // Changed to allow null
  isOutOfStock: boolean;
  deal?: IDealFormValues | IFoodDealType | IAdminDeal | null; // Corrected type
}

export interface IFoodNew extends IFoodDetailsForm {
  variations: IVariationForm[];
}

// New interface for Formik initialValues
export interface IFoodNewFormValues extends IFoodDetailsForm {
  variations: IVariationForm[];
}

export interface IDealInput {
  title: string;
  discountType: string;
  startDate: string;
  endDate: string;
  discountValue: number;
  isActive: boolean;
}

export interface IVariationInput {
  id?: string;
  title: string;
  price: number;
  discounted?: number;
  addons: string[];
  isOutOfStock: boolean;
  deal?: IDealInput;
}

export interface IFoodInputFood {
  restaurant?: string; // Made optional as it's not always present in the nested food object
  category: string;
  subCategory?: string;
  title: string;
  description?: string;
  image?: string;
  isActive: boolean;
  isOutOfStock: boolean;
  inventory?: number;
  UOM?: string;
  orderQuantity: {
    min: number;
    max: number;
  };
}

export interface IFoodInput {
  food: IFoodInputFood;
  variations: IVariationInput[];
}
