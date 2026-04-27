/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Dispatch, SetStateAction } from "react";
import { IGlobalProviderProps } from "./global.interface";
import {
  IRiderEarnings,
  IRiderEarningsArray,
} from "./rider-earnings.interface";
import { ApolloError, NetworkStatus } from "@apollo/client";
import { IOrder } from "./order.interface";
import { LocationPermissionResponse } from "expo-location";

export interface IUserContextProps {
  loadingProfile: boolean;
  errorProfile: ApolloError | undefined;
  dataProfile: IRiderProfile | null;
  userId: string | null;
  loadingAssigned: boolean;
  errorAssigned: ApolloError | undefined;
  assignedOrders: IOrder[] | null;
  refetchAssigned: () => void;
  refetchProfile: () => Promise<any>;
  networkStatusAssigned: NetworkStatus;
  requestForegroundPermissionsAsync: () => Promise<LocationPermissionResponse>;
  modalVisible: IRiderEarnings & { bool: boolean };
  setModalVisible: Dispatch<SetStateAction<IRiderEarnings & { bool: boolean }>>;
  riderOrderEarnings: IRiderEarningsArray[];
  setRiderOrderEarnings: Dispatch<SetStateAction<IRiderEarningsArray[]>>;
}
export interface IUserProviderProps extends IGlobalProviderProps {}

interface Zone {
  __typename: string;
  _id: string;
}

export interface WorkSchedule {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
  __typename: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  __typename: string;
}

export interface IRiderProfile {
  __typename: string;
  _id: string;
  accountNumber: string | null;
  available: boolean;
  currentWalletAmount: number;
  email: string | null;
  name: string;
  totalWalletAmount: number;
  username: string;
  withdrawnWalletAmount: number;
  zone: Zone;
  vehicleType: string;
  image: string | null;
  phone: string;
  licenseDetails: {
    expiryDate: string;
    image: string;
    number: number;
  };
  vehicleDetails: {
    image: string;
    number: string;
  };
  location: {
    coordinates: string[];
  };
  isAvailable: boolean;
  password: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assigned: string[];
  bussinessDetails: {
    bankName: string;
    accountName: string;
    accountCode: string;
    accountNumber: string;
  };
  timeZone: string;
  workSchedule: WorkSchedule[];
}

export interface IRiderProfileResponse {
  rider: IRiderProfile;
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

export interface IRidersOnCompletedResponsee {
  rider: IRiderProfile;
  assignedOrders: Order[];
}
