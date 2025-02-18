import { Dispatch, SetStateAction } from 'react';
import { TSideBarFormPosition } from '../types/sidebar';
import {
  IGlobalComponentProps,
  IGlobalTableHeaderProps,
} from './global.interface';
import { IOptions } from './options.interface';

export interface IAddonHeaderProps extends IGlobalComponentProps {
  setIsAddAddonVisible: (visible: boolean) => void;
}
export interface IAddonTableHeaderProps extends IGlobalTableHeaderProps {}

export interface IAddonAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddAddonVisible: boolean;
  onHide: () => void;
  addon: IAddon | null;
  isAddOptionsVisible:boolean;
  setIsAddOptionsVisible:Dispatch<SetStateAction<boolean>>;
  option:IOptions | null;
  setOption:Dispatch<SetStateAction<IOptions | null>>;
}

export interface IAddonMainComponentsProps extends IGlobalComponentProps {
  setIsAddAddonVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setAddon: React.Dispatch<React.SetStateAction<IAddon | null>>;
}

/*  */
export interface IAddon {
  _id: string;
  options: string[];
  title: string;
  description: string;
  quantityMinimum: number;
  quantityMaximum: number;
  __typename: string;
}
export interface IAddonByRestaurantResponse {
  restaurant: {
    _id: string;
    addons: IAddon[];
    __typename: string;
  };
}
