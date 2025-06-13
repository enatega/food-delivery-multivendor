import { IGlobalComponentProps } from "./global.interface";
import { IAddon } from "./orders.interface";
import { ICategory, IDeliveryInfo, IOpeningTime, IOption, IRestaurantLocation, IReviewData, IZone } from "./restaurants.interface";

export interface ISliderCardComponentProps<T> extends IGlobalComponentProps {
  title: string;
  data: T[];
  last?: boolean;
}

export interface ISliderCardItemProps {
  _id: string;
  name: string;
  image: string;
  logo: string;
  address: string;
  shopType: string;
  deliveryTime: number;
  minimumOrder: number;
  rating: number;
  isActive: boolean;
  isAvailable: boolean;
  commissionRate: number;
  tax: number;
  cuisines: string[];
  reviewCount: number;
  reviewAverage: number;
  distanceWithCurrentLocation?: number;
  freeDelivery?: boolean;
  acceptVouchers?: boolean;
  location: IRestaurantLocation;
  orderId: string;
  orderPrefix: string;
  slug: string;
  reviewData: IReviewData;
  categories: ICategory[];
  options: IOption[];
  addons: IAddon[];
  zone: IZone;
  openingTimes: IOpeningTime[];
  deliveryInfo: IDeliveryInfo;
}

export interface ICardProps {
  item: ISliderCardItemProps;
  isModalOpen: {value: boolean, id: string};
  handleUpdateIsModalOpen: (value: boolean, id: string) => void;
}
