import {
  IDropdownSelectItem,
  IGlobalComponentProps,
} from '../global.interface';

export interface ILevelFormProps extends IGlobalComponentProps {}

export interface ILevelForm {
  type: IDropdownSelectItem | null;
  value: number;
}

export interface ITierForm {
  type: IDropdownSelectItem | null;
  value: number;
}

export interface IBreakdownForm {
  min: number;
  max: number;
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

// Error
export interface ILevelError {
  type: string[];
  value: string[];
}

export interface ITierError {
  type: string[];
  value: string[];
}

export interface IBreakdownError {
  min: string[];
  max: string[];
  bronze: string[];
  silver: string[];
  gold: string[];
  platinum: string[];
}
