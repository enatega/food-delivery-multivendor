import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IDropdownSelectItem, IEditState } from './global.interface';
import { IFilterType } from './table.interface';

export interface IShopType {
  image: string;
  isActive: boolean;
  name: string;
  __typename: string;
  _id: string;
}
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: number;
  hasPrevPage: number;
}

export interface IGetShopTypesData {
  fetchShopTypes: IPaginatedResponse<IShopType>;
}
export interface IGetShopTypesVariables {}

export interface IShopTypesStakProps {
  shopType: IShopType;
  setSelectedData: Dispatch<SetStateAction<IShopType[]>>;
  selectedData: IShopType[];
}
export interface IAddShopTypeProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<
    SetStateAction<{
      bool: boolean;
      data: IShopType;
    }>
  >;
  isEditing: IEditState<IShopType>;
  visible: boolean;
}

export interface IEditPopupVal {
  _id: string;
  bool: boolean;
}

export interface IShopTypesTableProps {
  data: IShopType[] | null | undefined;
  loading: boolean;
  filters?: IFilterType | undefined;
  setIsEditing: Dispatch<SetStateAction<IEditState<IShopType>>>;
  setIsDeleting: Dispatch<SetStateAction<IEditState<IShopType>>>;
  isDeleting: IEditState<IShopType>;
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  setShopTypes: Dispatch<SetStateAction<IShopType[]>>;
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  statusOptions: IDropdownSelectItem[];
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
  selectedStatuses: string[];
}
export interface IShopTypeStatuses {
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

export interface IShopTypesScreenHeaderProps {
  handleButtonClick: () => void;
}

export interface IShopTypesMainProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setIsEditing: Dispatch<SetStateAction<IEditState<IShopType>>>;
  isEditing: IEditState<IShopType>;
}

export interface IShopTypesTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface IUserShopTypeHookProps {
  invoke_now?: boolean;
  transform_to_dropdown_list?: boolean;
}

export interface IUseShopTypesHookResponse {
  data: IGetShopTypesData | undefined | null;
  dropdownList: IDropdownSelectItem[] | undefined
  fetchShopTypes: () => void;
  loading: boolean;
}
