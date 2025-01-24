import { TSideBarFormPosition } from '../types/sidebar';
import {
  IGlobalComponentProps,
  IGlobalTableHeaderProps,
} from './global.interface';

export interface IOptionsHeaderProps extends IGlobalComponentProps {
  setIsAddOptionsVisible: (visible: boolean) => void;
}
export interface IOptionsTableHeaderProps extends IGlobalTableHeaderProps {}

export interface IOptionsAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddOptionsVisible: boolean;
  onHide: () => void;
  option: IOptions | null;
}

export interface IOptionsMainComponentsProps extends IGlobalComponentProps {
  setIsAddOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setOption: React.Dispatch<React.SetStateAction<IOptions | null>>;
}

/*  */
export interface IOptions {
  _id: string;
  title: string;
  description: string;
  price: number;
  __typename: string;
}
export interface IOptionsByRestaurantResponse {
  restaurant: {
    _id: string;
    options: IOptions[];
    __typename: string;
  };
}
