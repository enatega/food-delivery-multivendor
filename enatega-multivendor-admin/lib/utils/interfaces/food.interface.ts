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
export interface IFoodTableHeaderProps extends IGlobalTableHeaderProps {}

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
  discounted: number;
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
  __typename: string;
  isOutOfStock: boolean;
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
