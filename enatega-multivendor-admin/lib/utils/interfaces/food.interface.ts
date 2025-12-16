import { TSideBarFormPosition } from '../types/sidebar';
import { IVariationForm } from './forms';
import {
  IDropdownSelectItem,
  IGlobalComponentProps,
  IGlobalTableHeaderProps,
  IStepperFormProps,
} from './global.interface';
import { IProvider } from './layout.interface';

// Context
export interface IFoodContextPropData {
  food?: {
    _id: string;
    data: IFoodNew;
    variations: IVariationForm[];
  };
  isEditing?: boolean;
}

export interface IFoodContextProps {
  isFoodFormVisible: boolean;
  onFoodFormVisible: (status: boolean) => void;
  activeIndex: number;
  onActiveStepChange: (activeStep: number) => void;
  onClearFoodData: () => void;
  foodContextData: IFoodContextPropData | null;
  onSetFoodContextData: (data: Partial<IFoodContextPropData>) => void;
}

export interface IFoodProvider extends IProvider {}

///////////
export interface IFoodHeaderProps extends IGlobalComponentProps {
  setIsAddFoodVisible: (visible: boolean) => void;
}
export interface IFoodTableHeaderProps extends IGlobalTableHeaderProps {
  onClearFilter?: () => void;
}

export interface IFoodAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
}

export interface IFoodMainComponentsProps extends IGlobalComponentProps {}

// Components
export interface IFoodDetailsComponentProps extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
  isFoodFormVisible: boolean;
}
export interface IFoodVariationsAddRestaurantComponentProps
  extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}
export interface IFoodAddonsRestaurantLocationComponentProps
  extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}

/* API */
export interface IFoodGridItem {
  _id: string;
  title: string;
  description: string;
  category: IDropdownSelectItem | null;
  image: string;
  variations?: IVariation[];
  isOutOfStock: boolean;
  subCategory?: IDropdownSelectItem | null;
}

export interface IVariation {
  _id: string;
  title: string;
  price: number;
  discounted?: number;
  addons: string[];
  isOutOfStock: boolean;
  __typename?: string;
}

export interface IFood {
  _id: string;
  title: string;
  description: string;
  variations: IVariationForm[];
  subCategory: string;
  image: string;
  isActive: boolean;
  __typename: string;
  isOutOfStock: boolean;
}

export interface IFoodNew {
  _id: string;
  title: string;
  description: string;
  variations: IVariationForm[];
  category: IDropdownSelectItem | null;
  subCategory: IDropdownSelectItem | null;
  image: string;
  isActive: boolean;
  __typename?: string; // Changed to optional string
  isOutOfStock: boolean;
  inventory?: number | null; // Changed to optional number or null
  uom?: string;
  minQuantity?: number | null;
  maxQuantity?: number | null;
}

export interface IFoodCategory {
  _id: string;
  title: string;
  foods: IFood[];
  __typename: string;
}

export interface IRestaurant {
  _id: string;
  name?: string;
  categories: IFoodCategory[];
  __typename: string;
}

export interface IFoodByRestaurantResponse {
  restaurant: IRestaurant;
}

// Paginated Food API Interfaces
export interface IFoodDealType {
  id: string;
  name: string;
  type: string;
  value: number;
  startDate: number; // Unix timestamp in milliseconds
  endDate: number; // Unix timestamp in milliseconds
  isActive: boolean;
}

export interface IFoodAddon {
  title: string;
  description?: string;
  isActive?: boolean;
}

export interface IFoodVariation {
  id: string;
  title: string;
  price: number;
  outofstock?: boolean;
  deal?: IFoodDealType | null;
  addons?: IFoodAddon[];
}

export interface IOrderQuantity {
  min?: number;
  max?: number;
}

export interface IFoodCategoryInfo {
  id: string;
  title: string;
  subCategory?: string;
}

export interface IFoodItem {
  id: string;
  title: string;
  image: string;
  isActive?: boolean;
  UOM?: string;
  inventory?: number;
  isOutOfStock?: boolean;
  orderQuantity?: IOrderQuantity;
  variations: IFoodVariation[];
  deal: IFoodDealType | null;
  subCategory?: string;
}

export interface IFoodWithCategory {
  category: IFoodCategoryInfo;
  food: IFoodItem;
}

export interface IFoodPaginationResponse {
  page: number;
  limit: number;
  hasnext: boolean;
  hasprev: boolean;
  totalFoods: number;
  foods: IFoodWithCategory[];
}

export interface IGetAllFoodsPaginatedResponse {
  getAllfoodsPaginated: IFoodPaginationResponse;
}
