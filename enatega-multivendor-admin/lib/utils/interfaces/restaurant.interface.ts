import {
  IGlobalComponentProps,
  IQueryResult,
  IStepperFormProps,
} from './global.interface';

export interface IAddRestaurantComponentProps extends IGlobalComponentProps {
  stepperProps?: IStepperFormProps;
}
export interface IRestaurantCardProps extends IGlobalComponentProps {
  restaurant: IRestaurantByOwner;
}

export interface IRestaurantContextProps {
  // Vendor and Restaurant Data
  vendorId: string | null;
  restaurantContextData: IVendorLayoutRestaurantContextData;
  restaurantByOwnerResponse: IQueryResult<
    IRestaurantsByOwnerResponseGraphQL | undefined,
    undefined
  >;

  // Form Visibility
  isRestaurantFormVisible: boolean;
  onSetRestaurantFormVisible: (status: boolean) => void;

  // Form Navigation
  activeIndex: number;
  onActiveStepChange: (activeStep: number) => void;
  onClearRestaurntsData: () => void;

  // Context Data Management
  onSetRestaurantContextData: (data: Partial<IRestaurantContextData>) => void;
  isRestaurantModifed: boolean;
  setRestaurantModifed: (status: boolean) => void;
}

export interface IRestaurantContextData {
  id: string | null;
  filtered: IRestaurantByOwner[] | undefined;
  globalFilter: string;
  isEditing: boolean;
  autoCompleteAddress: string;
  unique_restaurant_id: string;
}

export interface IVendorLayoutRestaurantContextData {
  id: string | null;
  filtered: IRestaurantByOwner[] | undefined;
  globalFilter: string;
  isEditing: boolean;
  autoCompleteAddress: string;
}

export interface IRestaurantResponse {
  _id: string;
  unique_restaurant_id: string;
  name: string;
  image: string;
  orderPrefix: string;
  slug: string;
  address: string;
  deliveryTime: number;
  minimumOrder: number;
  isActive: boolean;
  commissionRate: number;
  tax: number;
  username: string;
  owner: {
    _id: string;
    email: string;
    isActive: boolean;
    __typename: string;
  };
  shopType: string;
  __typename: string;
}

export interface IRestaurantsResponseGraphQL {
  restaurants?: IRestaurantResponse[];
  getClonedRestaurants?: IRestaurantResponse[];
}

export interface IDeliveryInfo{
  minDeliveryFee: number;
  deliveryFee: number;
  deliveryDistance:number;
}

export interface IRestaurantByOwner {
  _id: string;
  unique_restaurant_id: string;
  orderId: string;
  orderPrefix: string;
  name: string;
  slug: string;
  image: string;
  address: string;
  isActive: boolean;
  username: string;
  password: string;
  deliveryTime: number;
  minimumOrder: number;
  deliveryInfo: IDeliveryInfo;
  location: {
    coordinates: number[];
  };
  shopType: string;
}

export interface IRestaurantsByOwnerResponseGraphQL {
  restaurantByOwner: {
    _id: string;
    email: string;
    userType: string;
    restaurants: IRestaurantByOwner[];
  };
}

export interface ICreateRestaurant {
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
export interface ICreateRestaurantResponse {
  data?: {
    createRestaurant?: ICreateRestaurant;
  };
}

/* Get Restaurant By ID Profile */
export interface IRestaurantProfile {
  _id: string;
  orderId: number;
  orderPrefix: string;
  slug: string;
  name: string;
  image: string;
  logo: string;
  address: string;
  location: {
    coordinates: string[];
    __typename: string;
  };
  deliveryBounds: {
    coordinates: number[][][];
    __typename: string;
  };
  username: string;
  password: string;
  deliveryTime: number;
  minimumOrder: number;
  tax: number;
  isAvailable: boolean;
  stripeDetailsSubmitted: boolean;
  openingTimes: {
    day: string;
    times: {
      startTime: string[];
      endTime: string[];
      __typename: string;
    }[];
    __typename: string;
  }[];
  owner: {
    _id: string;
    email: string;
    __typename: string;
  };
  shopType: string;
  cuisines: string[];
  __typename: string;
}
export interface IRestaurantProfileResponse {
  data: {
    restaurant: IRestaurantProfile;
  };
}

export interface IRestaurantProfileResponseGQL {
  restaurant: IRestaurantProfile;
}

export interface IRestaurantDeliveryZoneInfo {
  boundType: string;
  deliveryBounds: {
    coordinates: number[][][];
    __typename: string;
  };
  location: {
    coordinates: number[];
    __typename: string;
  };
  circleBounds: {
    radius: number;
    __typename: string;
  };
  address: string;
  city: string;
  postCode: string;
  __typename: string;
}

export interface IRestaurantDeliveryZoneInfoResponse {
  data: {
    getRestaurantDeliveryZoneInfo: IRestaurantDeliveryZoneInfo;
  };
}
