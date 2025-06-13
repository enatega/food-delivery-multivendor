export interface IPoint {
  __typename?: "Point";
  coordinates?: [number, number];
}

export interface IRestaurantDetail {
  __typename?: "RestaurantDetail";
  _id?: string;
  name?: string;
  image?: string;
  address?: string;
  location?: IPoint;
  slug?: string;
  shopType?: string;
}

export interface IOrderAddress {
  __typename?: "OrderAddress";
  location?: IPoint;
  deliveryAddress?: string;
  id?: string | null;
}

export interface IVariation {
  id?: string;
  _id: string;
  title: string;
  price: number;
  discounted?: boolean;
  addons: string[];
  isOutOfStock?: boolean;
}

export interface IAddonOption {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  price?: number;
}

export interface IAddon {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  quantityMinimum?: number;
  quantityMaximum?: number;
  options: IAddonOption[];
}

export interface IItem {
  __typename?: "Item";
  _id?: string;
  id?: string;
  title?: string;
  food?: string;
  description?: string;
  quantity?: number;
  image?: string;
  variation?: IVariation;
  addons?: IAddon[];
}

export interface IUser {
  __typename?: "User";
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  token?:string;
}

export interface IRider {
  __typename?: "Rider";
  _id?: string;
  name?: string;
  phone?: string;
}

export interface IReview {
  _id?: string;
  order: {
    _id?: string;
    user: IUser;
  };
  rating?: number;
  description: string;
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "PICKED"
  | "ACCEPTED"
  | "ASSIGNED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export interface IOrder {
  __typename?: "Order";
  _id?: string;
  id?: string;
  orderId?: string;
  restaurant?: IRestaurantDetail;
  deliveryAddress?: IOrderAddress;
  items?: IItem[];
  user?: IUser;
  rider?: IRider;
  review?: IReview | null;
  paymentMethod?: string;
  paidAmount?: number;
  orderAmount?: number;
  orderStatus: OrderStatus;
  paymentStatus?: string;
  tipping?: number;
  taxationAmount?: number;
  createdAt?: string;
  completionTime?: string;
  preparationTime?: string;
  orderDate?: string;
  expectedTime?: string;
  isPickedUp?: boolean;
  deliveryCharges?: number;
  acceptedAt?: string;
  pickedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  assignedAt?: string;
  instructions?: string;
}

export interface IOrdersResponse {
  orders?: IOrder[];
}

export interface IOrdersVariables {
  offset?: number;
}

export interface IOrderCardProps {
  order: IOrder;
  type: "active" | "past";
  className?: string;
  handleTrackOrderClicked?: (id: string | undefined) => void;
  handleReOrderClicked?: (id: string | undefined, slug: string | undefined, shopType: string | undefined) => void;
  handleRateOrderClicked?: (id: string | undefined) => void;
}

export interface IOrderItemsProps {
  order: IOrder;
}

export interface IActiveOrdersProps {
  activeOrders: IOrder[];
  isOrdersLoading: boolean;
}
export interface IPastOrdersProps {
  pastOrders: IOrder[];
  isOrdersLoading: boolean;
}
