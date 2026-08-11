import { ApolloQueryResult } from "@apollo/client";
import { Dispatch, SetStateAction } from "react";

export interface IRiderEarningsArray {
  tip: number;
  orderDetails: {
    orderType: string;
    orderId: string;
    paymentMethod: string;
  };
  totalEarnings: number;
  deliveryFee: number;
  date: string;
}
export interface IRiderEarnings {
  _id: string;
  earningsArray: IRiderEarningsArray[];
  date: string;
  totalEarningsSum: number;
  totalTipsSum: number;
  totalDeliveries: number;
}
export interface IRiderEarningsResponse {
  riderEarningsGraph: {
    totalCount: number;
    earnings: IRiderEarnings[];
  };
}

export interface IRiderEarningsOrderProps {
  amount: number;
  orderId: string;
  isLast: boolean;
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
          riderId: string;
          startDate?: string;
          endDate?: string;
        }>
      | undefined,
  ) => Promise<ApolloQueryResult<IRiderEarningsResponse | undefined>>;
}
