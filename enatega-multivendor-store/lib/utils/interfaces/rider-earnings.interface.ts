import { ApolloQueryResult } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";

export interface IStoreEarningsArray {
  orderDetails: {
    orderType: string;
    orderId: string;
    paymentMethod: string;
  };
  totalOrderAmount: number;
  totalEarnings: number;
  date: string;
}
export interface IStoreEarnings {
  _id: string;
  earningsArray: IStoreEarningsArray[];
  date: string;
  totalEarningsSum: number;
  totalOrderAmount: number;
  totalDeliveries: number;
}
export interface IStoreEarningsResponse {
  storeEarningsGraph: {
    totalCount: number;
    earnings: IStoreEarnings[];
  };
}

export interface IStoreEarningsOrderProps {
  amount: number;
  orderId: string;
  isLast: boolean;
  date: string;
}

export interface IDateFilter {
  startDate: string;
  endDate: string;
}

export interface IEarningDetailsMainProps {
  dateFilter: IDateFilter;
  setDateFilter: Dispatch<SetStateAction<IDateFilter>>;
}
export interface IEarningsDateFilterProps {
  handleFilterSubmit: () => Promise<void>;
  isFiltering: boolean;
  isDateFilterVisible: boolean;
  setIsDateFilterVisible: Dispatch<SetStateAction<boolean>>;
  refetchDeafult: (
    variables?:
      | Partial<{
          storeId: string;
          startDate?: string;
          endDate?: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<IStoreEarningsResponse | undefined>>;
}
