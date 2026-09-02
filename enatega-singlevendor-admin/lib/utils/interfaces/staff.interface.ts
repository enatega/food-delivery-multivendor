import { TSideBarFormPosition } from '../types/sidebar';
import { IGlobalComponentProps } from './global.interface';

export interface IStaffMainComponentsProps extends IGlobalComponentProps {
  setIsAddStaffVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setStaff: React.Dispatch<React.SetStateAction<IStaffResponse | null>>;
}

export interface IStaffResponse {
  __typename: 'Staff';
  _id: string;
  name: string;
  email: string;
  password: string;
  plainPassword: string;
  phone: number;
  isActive: boolean;
  permissions: string[];
}

export interface IStaffHeaderProps extends IGlobalComponentProps {
  setIsAddStaffVisible: (visible: boolean) => void;
}

export interface IStaffAddFormComponentProps extends IGlobalComponentProps {
  position?: TSideBarFormPosition;
  isAddStaffVisible: boolean;
  onHide: () => void;
  staff: IStaffResponse | null;
}

export interface IStaffGQLResponse {
  staffs: IStaffResponse[];
}

export interface IStaffTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
