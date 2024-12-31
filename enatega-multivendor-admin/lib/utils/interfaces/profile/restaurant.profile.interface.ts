import { IGlobalComponentProps } from '../global.interface';
import { IProvider } from '../layout.interface';
import { IQueryResult } from '@/lib/utils/interfaces';

import { IStepperFormProps } from '../global.interface';

export interface IUpdateProfileProps extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}

export interface IProfileProviderProps extends IProvider {}

export interface IProfileHeaderProps extends IGlobalComponentProps {
  setIsUpdateProfileVisible: (visible: boolean) => void;
}

export interface IRestaurantData extends IGlobalComponentProps {
  restaurant: IRestaurantData | undefined;
  restaurantName: string;
  username: string;
  password: string;
  image: string;
  logo: string;
  name: string;
  address: string;
  deliveryTime?: number;
  minimumOrder?: number;
  tax?: number;
  orderPrefix: string;
  shopType: string;
  cuisines: string;
  deliveryInfo?: {
    minDeliveryFee: number;
    deliveryDistance: number;
    deliveryFee: number;
  };
  location: {
    coordinates: number[];
  };
  deliveryBounds: {
    coordinates: [[number]];
  };
}

export interface IRestaurantProfileProps extends IGlobalComponentProps {
  restaurant: IRestaurantData;
}

export interface IInfoItemProps extends IGlobalComponentProps {
  label?: string;
  value?: string;
}

export interface IProfileContextData extends IGlobalComponentProps {
  restaurantId?: string | null;
  isUpdateProfileVisible: boolean;
  loading: boolean;
  setIsUpdateProfileVisible: (visible: boolean) => void;
  handleUpdateProfile: () => void;
  restaurantProfileResponse: IQueryResult<
    IRestaurantProfileProps | undefined,
    undefined
  >;
  activeIndex: number;
  onActiveStepChange: (activeStep: number) => void;
  refetchRestaurantProfile: () => Promise<void>; // Add this line
}

export interface IEditRestaurant extends IGlobalComponentProps {
  _id: string;
  address: string;
  cuisines: string[];
  image: string;
  location: {
    __typename: string;
    coordinates: number[];
  };
  logo: string;
  minimumOrder: number;
  name: string;
  orderId: number;
  orderPrefix: string;
  password: string;
  shopType: string;
  slug: string;
  tax: number;
  username: string;
  __typename: string;
  deliveryTime: number;
  isActive: boolean;
  commissionRate: number;
  owner: {
    _id: string;
    email: string;
    isActive: boolean;
    __typename: string;
  };
}

// The two interfaces are identical. There are no differences between them.
export interface IEditRestaurantResponse {
  data?: {
    editRestaurant?: IEditRestaurant;
  };
}
