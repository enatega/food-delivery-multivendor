import { IAddon, IReview, IVariation } from "./orders.interface";

// Define types for the GraphQL query response
export interface IRestaurantLocation {
  coordinates: [number, number];
}

export interface IRestaurant {
  _id: string;
  name: string;
  image: string;
  logo: string;
  address: string;
  deliveryTime: number;
  minimumOrder: number;
  rating: number;
  isActive: boolean;
  isAvailable: boolean;
  commissionRate: number;
  tax: number;
  shopType: string;
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

export interface IDeliveryInfo {
  deliveryFee: number;
  deliveryTime: number;
  minimumOrder: number;
}

export interface INearByRestaurantsPreviewData {
  nearByRestaurantsPreview: {
    restaurants: IRestaurant[];
  };}

  export interface ITopRatedVendorData {
    topRatedVendorsPreview: IRestaurant[];
  }
  export interface IMostOrderedRestaurantsData {
    mostOrderedRestaurantsPreview: IRestaurant[];
  }

  export interface IRecentOrderedRestaurantsData {
    recentOrderRestaurantsPreview: IRestaurant[];
  }

export interface IReviewData {
  total: number;
  ratings: number;
  reviews: IReview[];
}

export interface ICategory {
  _id: string;
  title: string;
  foods: IFood[];
}

export interface ISubCategory {
  _id: string;
  title: string;
  parentCategoryId: string;
}

export interface IFood {
  _id: string;
  title: string;
  image: string;
  description: string;
  subCategory: string;
  restaurant: string;
  variations: IVariation[];
  isOutOfStock?: boolean;
}

export interface ISelectedVariation {
  _id: string;
  title: string;
  price: number;
  discounted: boolean;
  addons: {
    _id: string;
    options?: {
      _id: string;
      title: string;
      description: string;
      price: number;
    }[];

    title?: string;
    description?: string;
    quantityMinimum?: number;
    quantityMaximum?: number;
  }[];
}

export interface IOption {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export interface IZone {
  _id: string;
  title: string;
  tax: number;
}

export interface IOpeningTime {
  day: string;
  times: ITimeSlot[];
}

export interface ITimeSlot {
  startTime: string[];
  endTime: string[];
}

// Double Category
export interface ISubCategoryV2 extends ISubCategory {
  foods: IFood[];
}
export interface ICategoryV2 {
  _id: string;
  title: string;
  subCategories: ISubCategoryV2[];
}

export interface ICategoryDetailsResponse {
  id: string;
  label: string;
  url: string;
  icon?: string;
  items?: ICategoryDetailsResponse[];
  __typename: string;
}

export interface IMainSectionProps {
  title: string;
  data: IRestaurant[];
  loading: boolean;
  error: boolean;
  search?: boolean
  hasMore?: boolean
}