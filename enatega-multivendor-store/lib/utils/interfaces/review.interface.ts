import { IGlobalComponentProps } from "./global.interface";

export interface IReview extends IGlobalComponentProps {
  _id: string;
  order: {
    _id: string;
    orderId: string;
    items: Array<{ title: string }>;
    user: {
      _id: string;
      name: string;
      email: string;
    };
  };
  restaurant: {
    _id: string;
    name: string;
    image: string;
  };
  rating: number;
  description: string;
  createdAt: string;
}
