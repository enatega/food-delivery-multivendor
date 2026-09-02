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

export interface IEtaCoordinate {
  latitude: number;
  longitude: number;
}

export interface IOrderEta {
  phase?: string | null;
  source?: string | null;
  readyAt?: string | null;
  baseArrivalAt?: string | null;
  estimatedArrivalAt?: string | null;
  windowStartAt?: string | null;
  windowEndAt?: string | null;
  durationSeconds?: number | null;
  distanceMeters?: number | null;
  encodedPolyline?: string | null;
  origin?: IEtaCoordinate | null;
  destination?: IEtaCoordinate | null;
  calculatedAt?: string | null;
  lastLocationAt?: string | null;
  version?: number | null;
}

export interface IRiderTrackingLocation {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
  recordedAt: string;
}

export interface IOrderTracking {
  orderId: string;
  status: string;
  riderLocation?: IRiderTrackingLocation | null;
  eta?: IOrderEta | null;
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
  eta?: IOrderEta | null;
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
