import { IStoreProfile } from "./user.interface";

export interface IStoreEarningsResponse {
  earnings: {
    data: {
      grandTotalEarnings: {
        storeTotal: number;
      };
      earnings: {
        storeEarnings: {
          deliveryFee: number;
          tip: number;
          totalEarnings: number;
        };
      };
    };
  };
}

export interface IStoreTransaction {
  status: string;
  amountTransferred: number;
  createdAt: string;
}

export interface IStoreTransactionHistoryResponse {
  transactionHistory: {
    data: IStoreTransaction[];
  };
}

export interface IStoreByIdResponse {
  restaurant: IStoreProfile;
}

export interface IStoreCurrentWithdrawRequestResponse {
  storeCurrentWithdrawRequest: {
    _id: string;
    requestAmount: number;
    status: string;
    createdAt: string;
  };
}

export interface IStoreCurrentWithdrawRequest {
  _id: string;
  requestAmount: number;
  status: string;
  createdAt: string;
}
