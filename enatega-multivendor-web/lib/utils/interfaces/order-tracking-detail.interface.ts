interface Coordinates {
  coordinates: [string, string];
  __typename: string;
}

interface Restaurant {
  _id: string;
  name: string;
  image: string;
  slug: string;
  address: string;
  location: Coordinates;
  shopType: string;
  __typename: string;
}

interface DeliveryAddress {
  location: Coordinates;
  deliveryAddress: string;
  __typename: string;
}

interface ItemOption {
  _id: string;
  title: string;
  description: string;
  price: number;
  __typename: string;
}

interface ItemAddon {
  _id: string;
  title: string;
  description: string;
  quantityMinimum: number;
  quantityMaximum: number;
  options: ItemOption[];
  __typename: string;
}

interface ItemVariation {
  _id: string;
  title: string;
  price: number;
  discounted: number;
  __typename: string;
}

interface OrderItem {
  image: string;
  specialInstructions: any;
  _id: string;
  title: string;
  food: string;
  description: string;
  quantity: number;
  variation: ItemVariation;
  addons: ItemAddon[];
  __typename: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  __typename: string;
}

export interface IOrderTrackingDetail {
  selectedPrepTime: number;
  reason?: string;
  _id: string;
  orderId: string;
  restaurant: Restaurant;
  deliveryAddress: DeliveryAddress;
  items: OrderItem[];
  user: User;
  rider: null | any;
  review: null | any;
  paymentMethod: string;
  paidAmount: number;
  orderAmount: number;
  orderStatus: string;
  deliveryCharges: number;
  tipping: number;
  taxationAmount: number;
  orderDate: string;
  expectedTime: string;
  isPickedUp: boolean;
  createdAt: string;
  completionTime: string;
  cancelledAt: string;
  assignedAt: string;
  deliveredAt: string;
  acceptedAt: string;
  pickedAt: string;
  preparationTime: string;
  __typename: string;
}
