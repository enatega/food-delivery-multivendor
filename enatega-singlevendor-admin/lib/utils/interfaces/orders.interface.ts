import { IExtendedOrder } from './orders/order-vendor.interface';

export interface ILocation {
  coordinates: number[];
}

export interface IDeliveryAddress {
  deliveryAddress: string;
  details: string;
  label: string;
  location: ILocation;
}

export interface IVariation {
  _id: string;
  title: string;
  price: number;
}

export interface IAddonOption {
  _id: string;
  title: string;
  price: number;
}

export interface IAddon {
  _id: string;
  title: string;
  options: IAddonOption[];
}

export interface IItem {
  _id: string;
  title: string;
  description: string;
  quantity: number;
  image: string;
  specialInstructions: string;
  variation: IVariation;
  addons: IAddon[];
}

export interface IRestaurant {
  __typename?: 'Restaurant';
  _id: string;
  name: string;
}

export interface IOrder {
  __typename?: 'Order';
  _id: string;
  orderId: string;
  orderAmount: number;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;
  restaurant: IRestaurant;
  deliveryAddress: IDeliveryAddress;
  items: IItem[];
}

export interface IOrdersByUserResponse {
  __typename?: 'OrdersByUserResponse';
  orders: IExtendedOrder[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
}
