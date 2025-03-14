import { ChangeEvent } from 'react';
import { UserTypeEnum } from '.';

export interface ITransactionHistoryTableHeaderProps {
  globalFilterValue: string;
  onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dateFilters: {
    startingDate: string;
    endingDate: string;
    userType?: UserTypeEnum;
    userId: string;
  };
  setDateFilters: React.Dispatch<
    React.SetStateAction<{
      startingDate: string;
      endingDate: string;
      userType?: UserTypeEnum;
      userId: string;
    }>
  >;
}

export interface ITransactionHistory {
  _id: string;
  amountCurrency: string;
  status: string;
  transactionId: string;
  userType: UserTypeEnum;
  userId: string;
  amountTransferred: number;
  createdAt: string;
  toBank?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    accountCode: string;
  };
  rider?: {
    _id: string;
    name: string;
    email: string;
    username: string;
    password: string;
    phone: string;
    image?: string;
    available: boolean;
    isActive: boolean;
    // isSuperAdminRider: boolean;
    accountNumber: string;
    currentWalletAmount: number;
    totalWalletAmount: number;
    withdrawnWalletAmount: number;
    createdAt: string;
    updatedAt: string;
  };
  store?: {
    _id: string;
    unique_restaurant_id: string;
    name: string;
    rating: number;
    isActive: boolean;
    isAvailable: boolean;
    slug: string;
    stripeDetailsSubmitted: boolean;
    phone: string;
    city: string;
    postCode: string;
  };
}

export interface ITransactionHistoryResponse {
  transactionHistory: {
    data: ITransactionHistory[];
    pagination: {
      total: number;
    };
  };
}

export interface ITransactionHistoryFilters {
  startingDate: string;
  endingDate: string;
  userType?: UserTypeEnum;
  userId: string;
}

export interface ITransactionHistoryVariables {
  pageSize: number;
  pageNo: number;
  startingDate?: string;
  endingDate?: string;
  userType?: UserTypeEnum;
  userId?: string;
}
