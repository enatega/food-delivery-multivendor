import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import {
  IDropdownSelectItem,
  IEditState,
  IGlobalComponentProps,
} from './global.interface';
import { IFilterType } from './table.interface';

export interface IWithDrawRequestAdminHeaderProps
  extends IGlobalComponentProps {
  setIsAddWithdrawRequestVisible: (visible: boolean) => void;
}

export interface IWithDrawRequestMainProps {
  setVisible: (value: boolean) => void;
  setSelectedRequest: (request: IWithDrawRequest | undefined) => void;
}

// Business Details Interface
interface IBusinessDetails {
  bankName: string;
  accountName: string;
  accountCode: string;
  accountNumber: string;
  bussinessRegNo: string;
  companyRegNo: string;
  taxRate: number;
}

// Rider Interface
interface IRider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  available: boolean;
  isActive: boolean;
  // isSuperAdminRider: boolean;
  accountNumber: string;
  currentWalletAmount: number;
  totalWalletAmount: number;
  withdrawnWalletAmount: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  bussinessDetails: IBusinessDetails;
}

// Store Interface
interface IStore {
  unique_restaurant_id: string;
  _id: string;
  image: string;
  logo: string;
  address: string;
  username: string;
  password: string;
  slug: string;
  stripeDetailsSubmitted: boolean;
  commissionRate: number;
  bussinessDetails: IBusinessDetails;
}

export interface IWithDrawRequest {
  _id: string;
  requestId: string;
  requestAmount: number;
  requestTime: string;
  status: string;
  createdAt: string;
  rider?: IRider;
  store?: IStore;
}

export interface IGetWithDrawRequestsData {
  withdrawRequests: {
    success: boolean;
    message: string | null;
    pagination: {
      total: number;
    };
    data: IWithDrawRequest[];
  };
}

export interface IWithDrawRequestFormProps {
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  setWithDrawRequests: Dispatch<SetStateAction<IWithDrawRequest[]>>;
  withdrawRequests: IWithDrawRequest[];
  isEditing: IEditState<IWithDrawRequest>;
  setIsEditing: Dispatch<
    SetStateAction<{
      bool: boolean;
      data: IWithDrawRequest;
    }>
  >;
  addWithdrawRequestsLocally: (withdraw_request: IWithDrawRequest) => void;
}

export interface IWithDrawRequestsTableProps {
  data: IWithDrawRequest[] | undefined | null;
  loading: boolean;
  filters?: IFilterType;
  globalFilterValue: string;
  statusOptions: IDropdownSelectItem[];
  selectedStatuses: string[];
  setRequests: Dispatch<SetStateAction<IWithDrawRequest[]>>;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setSelectedStatuses: Dispatch<SetStateAction<string[]>>;
}
export interface IWithdrawRequestsTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedActions: string[];
  setSelectedActions: Dispatch<SetStateAction<string[]>>;
}
