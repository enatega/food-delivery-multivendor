import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IDropdownSelectItem, IEditState } from './global.interface';
import { IFilterType } from './table.interface';

export interface ICoupon {
  discount: number;
  enabled: boolean;
  title: string;
  __typename: string;
  _id: string;
  endDate: string | null;
  lifeTimeActive: boolean;
}
export interface IGetCouponsData {
  coupons: ICoupon[];
}
export interface IGetCouponsVariables {}

export interface ICouponsStakProps {
  coupon: ICoupon;
  setSelectedData: Dispatch<SetStateAction<ICoupon[]>>;
  selectedData: ICoupon[];
}
export interface IAddCouponProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<
    SetStateAction<{
      bool: boolean;
      data: ICoupon;
    }>
  >;
  isEditing: IEditState<ICoupon>;
  visible: boolean;
}

export interface IEditPopupVal {
  _id: string;
  bool: boolean;
}

export interface ICouponsTableProps {
  data: ICoupon[] | null | undefined;
  loading: boolean;
  filters?: IFilterType | undefined;
  setIsEditing: Dispatch<SetStateAction<IEditState<ICoupon>>>;
  setIsDeleting: Dispatch<SetStateAction<IEditState<ICoupon>>>;
  isDeleting: IEditState<ICoupon>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  setCoupons: Dispatch<SetStateAction<ICoupon[]>>;
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  statusOptions: IDropdownSelectItem[];
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
  selectedStatuses: string[];
}
export interface ICouponStatuses {
  enabled: {
    total: null | undefined | number;
    status: boolean;
  };
  disabled: {
    total: null | undefined | number;
    status: boolean;
  };
  all: {
    total: null | undefined | number;
    status: boolean;
  };
}

export interface ICouponScreenHeaderProps {
  handleButtonClick: () => void;
}

export interface ICouponMainProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<SetStateAction<IEditState<ICoupon>>>;
  isEditing: IEditState<ICoupon>;
}

export interface ICouponTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedActions: string[];
  setSelectedActions: Dispatch<SetStateAction<string[]>>;
}
