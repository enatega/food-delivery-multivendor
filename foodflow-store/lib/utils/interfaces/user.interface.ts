/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ApolloError, NetworkStatus } from "@apollo/client";
import { LocationPermissionResponse } from "expo-location";
import { Dispatch, SetStateAction } from "react";
import { TWeekDays } from "../types/restaurant";
import { IGlobalProviderProps } from "./global.interface";
import { IOrder } from "./order.interface";
import {
  IStoreEarnings,
  IStoreEarningsArray,
} from "./rider-earnings.interface";

export interface IUserContextProps {
  loadingProfile?: boolean;
  errorProfile?: ApolloError | undefined;
  dataProfile?: IStoreProfile | null;
  userId?: string | null;
  loadingAssigned?: boolean;
  errorAssigned?: ApolloError | undefined;
  assignedOrders?: IOrder[] | null;
  refetchAssigned?: () => void;
  refetchProfile?: () => void;
  networkStatusAssigned?: NetworkStatus;
  requestForegroundPermissionsAsync?: () => Promise<LocationPermissionResponse>;
  modalVisible: IStoreEarnings & { bool: boolean };
  setModalVisible: Dispatch<SetStateAction<IStoreEarnings & { bool: boolean }>>;
  setStoreOrderEarnings: Dispatch<SetStateAction<IStoreEarningsArray[] | null>>;
  storeOrdersEarnings: IStoreEarningsArray[] | null;
}
export interface IUserProviderProps extends IGlobalProviderProps {}

interface Zone {
  __typename: string;
  _id: string;
}

export interface IStoreProfile {
  __typename: string;
  _id: string;
  unique_restaurant_id: string;
  orderId: number;
  orderPrefix: string;
  name: string;
  image: string;
  logo: string;
  address: string;
  location: {
    coordinates: string;
  };
  zone: Zone;
  username: string;
  password: string;
  minimumOrder: number;
  sections: string;
  rating: number;
  isActive: string;
  isAvailable: boolean;
  openingTimes: ITimingResponseGQL[];
  slug: string;
  stripeDetailsSubmitted: string;
  commissionRate: string;
  owner: {
    email: string;
    _id: string;
  };
  deliveryBounds: {
    coordinates: string;
  };
  deliveryTime: string;
  tax: number;
  notificationToken: string;
  enableNotification: boolean;
  shopType: string;
  tags: string;
  phone: string;
  available: boolean;

  currentWalletAmount: number;
  totalWalletAmount: number;
  withdrawnWalletAmount: number;

  bussinessDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    accountCode: string;
  };
}

export interface ITimeSlot {
  startTime: string | null;
  endTime: string | null;
}

export interface ITimingForm {
  day: TWeekDays;
  times: ITimeSlot[];
}

export interface ITimeSlotResponseGQL {
  startTime: string[];
  endTime: string[];
}

export interface ITimingResponseGQL {
  day: TWeekDays;
  times: ITimeSlotResponseGQL[];
}

export interface IStoreProfileResponse {
  restaurant: IStoreProfile;
}

export interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  acceptedAt?: string;
  pickedAt?: string;
  assignedAt?: string;
  isPickedUp: boolean;
  deliveredAt?: string;
  expectedTime?: string;
  deliveryCharges: number;
  restaurant: {
    _id: string;
    name: string;
    address: string;
    location: {
      coordinates: [number, number];
    };
  };
  deliveryAddress: {
    location: {
      coordinates: [number, number];
    };
    deliveryAddress: string;
    label?: string;
    details?: string;
  };
  items: {
    _id: string;
    title: string;
    food: string;
    description?: string;
    quantity: number;
    variation: {
      _id: string;
      title: string;
      price: number;
    };
    addons?: {
      _id: string;
      title: string;
      description?: string;
      quantityMinimum: number;
      quantityMaximum: number;
      options: {
        _id: string;
        title: string;
        price: number;
      }[];
    }[];
    isActive: boolean;
    createdAt: string;
  }[];
  user: {
    _id: string;
    name: string;
    phone: string;
  };
  paymentMethod: string;
  paidAmount: number;
  orderAmount: number;
  paymentStatus: string;
  orderStatus: string;
  tipping: number;
  taxationAmount: number;
  reason?: string;
  isRiderRinged: boolean;
  preparationTime?: string;
  rider?: {
    _id: string;
    name: string;
    username: string;
  };
}

export interface IStoreOnCompletedResponsee {
  restaurant: IStoreProfile;
  assignedOrders: Order[];
}
