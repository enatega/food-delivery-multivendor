import { IGlobalComponentProps } from "./global.interface";
import { ORDER_TYPE } from "../types";

export interface IOrderComponentProps extends IGlobalComponentProps {
  order: IOrder;
  tab: ORDER_TYPE;
  handlePresentModalPress?: (order: IOrder) => void;
}

export interface Location {
  coordinates: [number, number];
}

export interface RestaurantDetail {
  _id: string;
  name: string;
  image: string;
  address: string;
  location: Location;
}

export interface OrderAddress {
  location: Location;
  deliveryAddress: string;
  details?: string;
  label?: string;
}

export interface Variation {
  _id: string;
  id: string;
  title: string;
  price: number;
  discounted?: number;
}

export interface AddonOption {
  _id: string;
  id: string;
  title: string;
  description?: string;
  price: number;
}

export interface Addon {
  _id: string;
  id: string;
  title: string;
  description?: string;
  quantityMinimum: number;
  quantityMaximum: number;
  options: AddonOption[];
}

export interface Item {
  _id: string;
  id: string;
  title: string;
  description?: string;
  image: string;
  quantity: number;
  variation: Variation;
  addons: Addon[];
  specialInstructions?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Rider {
  _id: string;
  name: string;
  username: string;
  available: boolean;
}

export interface Review {
  rating: number;
  comment: string;
}

export interface Zone {
  _id: string;
  name: string;
}

export interface IOrder {
  _id: string;
  id?: string;
  orderId: string;
  restaurant: RestaurantDetail;
  deliveryAddress: OrderAddress;
  items: Item[];
  user: User;
  paymentMethod?: string;
  paidAmount?: number;
  orderAmount?: number;
  status: boolean;
  paymentStatus: string;
  orderStatus?: string;
  reason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deliveryCharges?: number;
  tipping: number;
  taxationAmount: number;
  rider?: Rider;
  review?: Review;
  zone: Zone;
  completionTime?: string;
  orderDate: string;
  expectedTime?: string;
  preparationTime?: string;
  isPickedUp: boolean;
  acceptedAt?: string;
  pickedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  assignedAt?: string;
  isRinged: boolean;
  isRiderRinged: boolean;
  instructions?: string;
}
