import { Dispatch, SetStateAction } from "react";
import { IGlobalComponentProps } from "./global.interface";
import { IFood, IOption, IRestaurant } from "./restaurants.interface";
import { IAddon } from "./orders.interface";

export interface IFoodItemDetalComponentProps extends IGlobalComponentProps {
  foodItem: IFood | null;
  addons: IAddon[];
  options: IOption[];
  restaurant?: IRestaurant;
  onClose?: () => void;
}

export interface Option {
  _id: string;
  title: string;
  price: number;
  isOutOfStock?: boolean;
}

export interface SectionProps<T extends { _id: string }> {
  title?: string | undefined;
  options: T[];
  name: string;

  singleSelected?: T | null;
  multiSelected?: T[] | null;
  onSingleSelect?: Dispatch<SetStateAction<T | null>>;
  onMultiSelect?: Dispatch<SetStateAction<T[] | null>>;
  multiple?: boolean;
  requiredTag?: string;
  showTag?: boolean;
}
export interface AddonSectionProps<T extends { _id: string }> {
  title: string;
  addonOptions: T;
  name: string;

  multiSelected: T[] | null;
  onMultiSelect: Dispatch<SetStateAction<T[] | null>>;
  multiple?: boolean;
}
