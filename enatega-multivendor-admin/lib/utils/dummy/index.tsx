// Icons
import {
  faMotorcycle,
  faStore,
  faUsers,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';

// Interfaces
import {
  IAddon,
  IBannersResponse,
  ICategory,
  IDropdownSelectItem,
  IFoodNew,
  IOptions,
  IRestaurantResponse,
  IStaffResponse,
  IStatsCardProps,
  IVendorStoreDetails,
  IZoneResponse,
} from '../interfaces';
import { IRiderResponse } from '../interfaces/rider.interface';
import { IUserResponse } from '../interfaces/users.interface';
import { ICoupon } from '../interfaces/coupons.interface';
import { ICuisine } from '../interfaces/cuisine.interface';
import { INotification } from '../interfaces/notification.interface';
import { IWithDrawRequest } from '../interfaces/withdraw-request.interface';
import { IActiveOrders } from '../interfaces/dispatch.interface';
import { ICouponRestaurantResponse } from '../interfaces/coupons-restaurant.interface';

export const dummyStatsData: IStatsCardProps[] = [
  {
    label: 'Total User',
    total: 40987,
    description: '8.5% up from yesterday',
    icon: faUsers,
    route: '/general/users',
  },
  {
    label: 'Total Vendors',
    total: 7689,
    description: '2.4% up from yesterday',
    icon: faStore,
    route: '/general/vendors',
  },
  {
    label: 'Total Restaurants',
    total: 20689,
    description: '6.1% down from yesterday',
    icon: faUtensils,
    route: '/general/restaurants',
  },
  {
    label: 'Total Riders',
    total: 12689,
    description: '1.9% up from yesterday',
    icon: faMotorcycle,
    route: '/general/riders',
  },
];

export const dummyOrderStatsData: IStatsCardProps[] = [
  {
    label: 'Total Orders',
    total: 40987,
    description: '8.5% up from yesterday',

    route: '/general/users',
  },
  {
    label: 'Total Sales',
    total: 20689,
    description: '6.1% down from yesterday',

    route: '#',
  },
  {
    label: 'COD Orders',
    total: 7689,
    description: '2.4% up from yesterday',
    route: '#',
  },

  {
    label: 'Card Orders',
    total: 12689,
    description: '1.9% up from yesterday',

    route: '#',
  },
];

export const dummyCountriesData: IDropdownSelectItem[] = [
  { label: 'Australia', code: 'AU' },
  { label: 'Brazil', code: 'BR' },
  { label: 'China', code: 'CN' },
  { label: 'Egypt', code: 'EG' },
  { label: 'France', code: 'FR' },
  { label: 'Germany', code: 'DE' },
  { label: 'India', code: 'IN' },
  { label: 'Japan', code: 'JP' },
  { label: 'Spain', code: 'ES' },
  { label: 'United States', code: 'US' },
];

export const generateRandomUserCounts = () => {
  const randomNumbers = new Set();

  while (randomNumbers.size < 12) {
    randomNumbers.add(Math.floor(Math.random() * 101)); // Generates random integer between 0 and 100
  }

  return Array.from(randomNumbers);
};

export const generateDummyRestaurants = (
  count: number = 10
): IRestaurantResponse[] => {
  const restaurants: IRestaurantResponse[] = [];

  for (let i = 0; i < count; i++) {
    restaurants.push({
      unique_restaurant_id: `restaurant_${i + 1}`,
      _id: `restaurant_${i + 1}`,
      name: `Restaurant ${i + 1}`,
      username: `restaurant${i + 1}example`,
      owner: {
        _id: '',
        email: `vendor${i + 1}-something`,
        isActive: false,
        __typename: '',
      },
      address: `${i + 1} Main Street, City`,
      isActive: Math.random() > 0.5,
      image: `/images/restaurant${i + 1}.jpg`,
      orderPrefix: '',
      slug: '',
      deliveryTime: 0,
      minimumOrder: 0,
      commissionRate: 0,
      tax: 0,
      shopType: '',
      __typename: '',
    });
  }

  return restaurants;
};

export const generateDummyRiders = (count: number = 10): IRiderResponse[] => {
  const riders: IRiderResponse[] = [];

  for (let i = 0; i < count; i++) {
    riders.push({
      _id: `rider_${i + 1}`,
      name: `Rider ${i + 1}`,
      username: `rider${i + 1}`,
      password: `password${i + 1}`,
      phone: `+1234567890${i}`,
      zone: {
        title: `Zone ${(i % 5) + 1}`,
        _id: `zone_${(i % 5) + 1}`,
        __typename: 'Zone',
      },
      available: Math.random() > 0.5,
      __typename: 'Rider',
      assigned: [''],
    });
  }

  return riders;
};

export const generateDummyCommissionRates = (
  count: number = 10
): IRestaurantResponse[] => {
  const dummyCommissionRates: IRestaurantResponse[] = [];

  for (let i = 0; i < count; i++) {
    dummyCommissionRates.push({
      _id: `restaurant_${i + 1}`,
      unique_restaurant_id: `restaurant_${i + 1}`,
      name: `Restaurant ${i + 1}`,
      commissionRate: Math.floor(Math.random() * 10) + 5, // Random commission rate between 5 and 15
      isActive: Math.random() > 0.2, // 80% chance of being active
      __typename: 'Restaurant',
      image: '',
      orderPrefix: '',
      slug: '',
      address: '',
      deliveryTime: Math.floor(Math.random() * 60) + 15, // Random delivery time between 15 and 75 minutes
      minimumOrder: Math.floor(Math.random() * 20) + 5, // Random minimum order between $5 and $25
      tax: Math.floor(Math.random() * 10) + 5, // Random tax between 5% and 15%
      username: `restaurant${i + 1}`,
      owner: {
        _id: `owner_${i + 1}`,
        email: `owner${i + 1}@example.com`,
        isActive: true,
        __typename: 'Owner',
      },
      shopType: ['Fast Food', 'Casual Dining', 'Fine Dining'][
        Math.floor(Math.random() * 3)
      ],
    });
  }

  return dummyCommissionRates;
};

export const generateDummyOrderVendor = (
  count: number = 10
): IRestaurantResponse[] => {
  const dummyOrderVendor: IRestaurantResponse[] = [];

  for (let i = 0; i < count; i++) {
    dummyOrderVendor.push({
      _id: `restaurant_${i + 1}`,
      unique_restaurant_id: `restaurant_${i + 1}`,
      name: `Restaurant ${i + 1}`,
      commissionRate: Math.floor(Math.random() * 10) + 5, // Random commission rate between 5 and 15
      isActive: Math.random() > 0.2, // 80% chance of being active
      __typename: 'Restaurant',
      image: '',
      orderPrefix: '',
      slug: '',
      address: '',
      deliveryTime: Math.floor(Math.random() * 60) + 15, // Random delivery time between 15 and 75 minutes
      minimumOrder: Math.floor(Math.random() * 20) + 5, // Random minimum order between $5 and $25
      tax: Math.floor(Math.random() * 10) + 5, // Random tax between 5% and 15%
      username: `restaurant${i + 1}`,
      owner: {
        _id: `owner_${i + 1}`,
        email: `owner${i + 1}@example.com`,
        isActive: true,
        __typename: 'Owner',
      },
      shopType: ['Fast Food', 'Casual Dining', 'Fine Dining'][
        Math.floor(Math.random() * 3)
      ],
    });
  }

  return dummyOrderVendor;
};

export const generateDummyCategories = (count: number = 10): ICategory[] => {
  const categories: ICategory[] = [];

  for (let i = 0; i < count; i++) {
    categories.push({
      _id: `category_${i + 1}`,
      title: `Category ${i + 1}`,
    });
  }

  return categories;
};

export const generateDummyOptions = (count: number = 10): IOptions[] => {
  const options: IOptions[] = [];

  for (let i = 0; i < count; i++) {
    options.push({
      _id: `option_${i + 1}`,
      title: `Option ${i + 1}`,
      description: `Description for Option ${i + 1}`,
      price: Math.floor(Math.random() * 100) + 1,
      __typename: '',
    });
  }

  return options;
};

export const generateDummyAddons = (count: number = 10): IAddon[] => {
  const addons: IAddon[] = [];

  for (let i = 0; i < count; i++) {
    addons.push({
      _id: `addon_${i + 1}`,
      title: `Addon ${i + 1}`,
      description: `Description for Addon ${i + 1}`,
      quantityMinimum: 1,
      quantityMaximum: 1,
      __typename: 'Addon',
      options: [],
    });
  }

  return addons;
};

export const generateDummyUsers = (count: number = 10): IUserResponse[] => {
  const users: IUserResponse[] = [];

  for (let i = 0; i < count; i++) {
    users.push({
      _id: `user_${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      addresses: [],

      createdAt: (
        Date.now() - Math.floor(Math.random() * 31536000000)
      ).toString(),
      __typename: 'User',
    });
  }

  return users;
};

export const generateDummyBanners = (
  count: number = 10
): IBannersResponse[] => {
  const banners: IBannersResponse[] = [];

  for (let i = 0; i < count; i++) {
    banners.push({
      _id: `banner_${i + 1}`,
      title: `Banner ${i + 1}`,
      description: `Description for Banner ${i + 1}`,
      file: `https://example.com/banner${i + 1}.jpg`,
      screen: `Screen ${(i % 3) + 1}`,
      action: 'navigate',
      parameters: '',
    });
  }

  return banners;
};

export const generateDummyZones = (count: number = 10): IZoneResponse[] => {
  const zones: IZoneResponse[] = [];

  for (let i = 0; i < count; i++) {
    zones.push({
      _id: `zone_${i + 1}`,
      title: `Zone ${i + 1}`,
      description: `Description for Zone ${i + 1}`,
      location: {
        coordinates: [[[0, 0]]], // Placeholder coordinates
      },
      isActive: Math.random() > 0.5,
      __typename: 'Zone',
    });
  }

  return zones;
};

export const generateDummyCoupons = (count: number = 10) => {
  const coupons: ICoupon[] = [];
  for (let i = 0; i < count; i++) {
    coupons.push({
      _id: `coupon_${i + 1}`,
      title: `coupon_${i + 1}`,
      __typename: `coupon_${i + 1}`,
      discount: Math.floor(Math.random() * i + 15),
      enabled: Math.random() * 3 > 2,
    });
  }
  return coupons;
};

export const generateDummyCuisines = (count: number = 10) => {
  const cuisines: ICuisine[] = [];
  for (let i = 0; i < count; i++) {
    cuisines.push({
      _id: `cuisine_${i + 1}`,
      shopType: `cuisine_${i + 1}`,
      __typename: `cuisine_${i + 1}`,
      description: `cuisine_${i + 1}`,
      name: `cuisine_${i + 1}`,
    });
  }
  return cuisines;
};

export const generateDummyNotifications = (count: number = 10) => {
  const notifications: INotification[] = [];
  for (let i = 0; i < count; i++) {
    notifications.push({
      _id: `notification_${i + 1}`,
      title: `notification_${i + 1}`,
      createdAt: new Date().toDateString(),
      body: `notification_${i + 1}`,
    });
  }
  return notifications;
};

export const generateDummyWithdrawRequests = (count: number = 10) => {
  const withdrawRequests: IWithDrawRequest[] = [];
  for (let i = 0; i < count; i++) {
    withdrawRequests.push({
      _id: `withdraw_request_${i + 1}`,
      requestAmount: i + 1,
      requestId: `withdraw_request_${i + 1}`,
      status: 'TRANSFERRED',
      requestTime: new Date().toDateString(),
      rider: {
        _id: `rider_${i + 1}`,
        currentWalletAmount: i + 1,
        name: `rider_${i + 1}`,
      },
    });
  }
  return withdrawRequests;
};

export const generateDummyDispatchOrders = (count: number = 10) => {
  const dispatchActiveOrders: IActiveOrders[] = [];
  for (let i = 0; i < count; i++) {
    dispatchActiveOrders.push({
      _id: `active_order_${i + 1}`,
      status: 'TRANSFERRED',
      rider: {
        _id: `rider_${i + 1}`,
        name: `rider_${i + 1}`,
        username: `rider_${i + 1}`,
        available: true,
        assigned:['']
      },
      createdAt: new Date().toDateString(),
      deliveryAddress: {
        deliveryAddress: `active_order_${i + 1}`,
        details: '',
        label: 'Delivery Address',
        location: {
          coordinates: {
            latitude: 0,
            longitude: 0,
          },
        },
      },
      isActive: true,
      orderId: `active_order_${i + 1}`,
      orderStatus: 'DELIVERED',
      paymentMethod: 'COD',
      zone: {
        _id: `active_order_${i + 1}`,
      },
    });
  }
  return dispatchActiveOrders;
};

export const generateDummyFoods = (count: number = 10): IFoodNew[] => {
  const foods: IFoodNew[] = [];

  for (let i = 0; i < count; i++) {
    foods.push({
      _id: `food_${i + 1}`,
      title: `Food ${i + 1}`,
      description: `Description for Food ${i + 1}`,
      image: '',
      category: { label: `food_category_${i + 1}`, code: `${i + 1}` },
      __typename: 'Food',
      isActive: true,
      isOutOfStock: false,
      subCategory: {
        code: `sub-category-${i + 1}`,
        label: `sub-category-${i + 2}`,
      },
      variations: [
        {
          _id: `food_${i + 1}`,
          addons: [] as IDropdownSelectItem[],
          discounted: 0,
          isOutOfStock: false,
          price: i + 23,
          title: `food_${i + 1}`,
          __typename: 'Food',
        },
      ],
    });
  }

  return foods;
};

export const generateDummyCouponsRestaurant = (
  count: number = 10
): ICouponRestaurantResponse[] => {
  const coupons: ICouponRestaurantResponse[] = [];

  for (let i = 0; i < count; i++) {
    coupons.push({
      _id: `rider_${i + 1}`,
      title: `rider${i + 1}`,
      discount: i + 1,
      enabled: Math.random() > 0.5,
      __typename: 'Rider',
    });
  }

  return coupons;
};

export const generateDummyStaff = (count: number = 10): IStaffResponse[] => {
  const staffs: IStaffResponse[] = [];

  for (let i = 0; i < count; i++) {
    staffs.push({
      __typename: 'Staff',
      _id: `staff_${i + 1}`,
      name: `Staff ${i + 1}`,
      email: `staff${i + 1}@example.com`, // updated email to be more realistic
      plainPassword: `password${i + 1}`,
      password: `password${i + 1}`,
      phone: 1234567890 + i,
      permissions: ['Dummy'],
      isActive: Math.random() > 0.5,
    });
  }

  return staffs;
};

export const generateVendorStoreDetails = (
  count: number = 10
): IVendorStoreDetails[] => {
  const details: IVendorStoreDetails[] = [];

  for (let i = 0; i < count; i++) {
    details.push({
      _id: `vendor_store_${i + 1}`,
      totalOrders: Math.floor(Math.random() * 100),
      restaurantName: `Restaurant ${i + 1}`,
      totalSales: Math.floor(Math.random() * 1000),
      pickUpCount: Math.floor(Math.random() * 50),
      deliveryCount: Math.floor(Math.random() * 50),
    });
  }

  return details;
};
