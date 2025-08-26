import { Dispatch, SetStateAction } from "react";
import {
  IStoreEarnings,
  IStoreEarningsArray,
} from "./rider-earnings.interface";

export interface IEarningStackProps {
  earning: number;
  date: string;
  setModalVisible: Dispatch<SetStateAction<IStoreEarnings & { bool: boolean }>>;
  _id: string;
  earningsArray: IStoreEarningsArray[];
  totalDeliveries: number;
  totalOrderAmount: number;
  isLast?: boolean;
}
export interface IEarningBottomProps {
  totalEarnings: number;
  totalDeliveries: number;
  modalVisible: IStoreEarnings & { bool: boolean };
  setModalVisible: Dispatch<SetStateAction<IStoreEarnings & { bool: boolean }>>;
}

export interface IStoreEarningsDetailProps {
  setModalVisible: Dispatch<SetStateAction<IStoreEarnings & { bool: boolean }>>;
  userId: string | undefined | null;
  storeEarnings?: IStoreEarnings[];
  isLoading: boolean;
}
