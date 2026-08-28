import { ReactNode } from "react";
import { ORDER_TYPE } from "../types";
import { IGlobalComponentProps } from "./global.interface";
import { IRestaurantProfile } from "./resturant.interface";
import { IRiderProfile } from "./user.interface";

export interface IOrderComponentProps extends IGlobalComponentProps {
  tab: ORDER_TYPE;
  _id: IOrder['_id'];
  orderId: IOrder['orderId'];
  orderStatus: IOrder['orderStatus'];
  restaurant: IOrder['restaurant'];
  deliveryAddress: IOrder['deliveryAddress'];
  paymentMethod: IOrder['paymentMethod'];
  orderAmount: IOrder['orderAmount'];
  paymentStatus: IOrder['paymentStatus'];
  acceptedAt: IOrder['acceptedAt'];
  user: IOrder['user'];
  eta?: IOrder['eta'];
}

export interface IOrder {
  _id: string;
  orderId: string;
  paymentMethod?: string;
  items: Array<{
    variation: {
      price: number;
      title: string;
    };
    addons?: Array<{
      _id: string;
      options: Array<{
        _id: string;
        price: number;
        title: string;
      }>;
    }>;
    description: ReactNode;
    image: string;
    title: string;
    quantity: number;
  }>;
  user: {
    _id: string;
    name: string;
    phone: string;
  };
  paymentStatus: string;
  createdAt: string;
  acceptedAt: string;
  deliveryAddress: {
    deliveryAddress: string;
    location: {
      coordinates: Array<number>;
    };
  };
  orderAmount: number;
  orderStatus: string;
  orderState?: string;
  preparationTime: string;
  completionTime: string;
  eta?: {
    phase?: string;
    source?: string;
    readyAt?: string;
    estimatedArrivalAt?: string;
    windowStartAt?: string;
    windowEndAt?: string;
    durationSeconds?: number;
    distanceMeters?: number;
    calculatedAt?: string;
    lastLocationAt?: string;
  };
  isPickedUp: boolean;
  isRiderRinged: boolean;
  rider: IRiderProfile;
  restaurant: IRestaurantProfile;
}
