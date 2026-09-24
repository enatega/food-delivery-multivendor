import type { GraphqlHandler } from './mock-graphql.js'

const alwaysOpen = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN'
].map((day) => ({
  __typename: 'RestaurantOpeningTime',
  day,
  times: [
    {
      __typename: 'OpeningTime',
      startTime: '00:00',
      endTime: '23:59'
    }
  ]
}))

export const customerRestaurantPreview = {
  __typename: 'RestaurantPreview',
  _id: 'mock-restaurant',
  name: 'Automation Kitchen',
  image: '/favicon.png',
  logo: '/favicon.png',
  slug: 'automation-kitchen',
  shopType: 'restaurant',
  minimumOrder: 5,
  deliveryTime: 25,
  location: {
    __typename: 'Point',
    coordinates: [73.0479, 33.6844]
  },
  reviewAverage: 4.8,
  cuisines: ['Burgers'],
  openingTimes: alwaysOpen,
  isAvailable: true,
  isActive: true
}

export const customerRestaurant = {
  ...customerRestaurantPreview,
  orderId: 1,
  orderPrefix: 'AUT',
  username: 'automation-kitchen',
  phone: '+920000000000',
  address: 'Automation Street, Islamabad',
  tax: 5,
  stripeDetailsSubmitted: false,
  reviewData: { total: 1, ratings: 4.8, reviews: [] },
  rating: 4.8,
  zone: { _id: 'mock-zone', title: 'Automation Zone', tax: 5 },
  categories: [
    {
      _id: 'mock-category',
      title: 'Popular',
      foods: [
        {
          _id: 'mock-burger',
          title: 'Automation Burger',
          image: '/favicon.png',
          description: 'A deterministic burger for Customer Web automation.',
          isOutOfStock: false,
          subCategory: null,
          variations: [
            {
              _id: 'mock-burger-regular',
              title: 'Regular',
              price: 10,
              discounted: 0,
              addons: ['mock-sauce-addon'],
              isOutOfStock: false
            }
          ]
        }
      ]
    }
  ],
  addons: [
    {
      _id: 'mock-sauce-addon',
      options: ['mock-sauce-option'],
      title: 'Choose a sauce',
      description: 'Select one sauce',
      quantityMinimum: 1,
      quantityMaximum: 1
    }
  ],
  options: [
    {
      _id: 'mock-sauce-option',
      title: 'Garlic Sauce',
      description: 'Garlic sauce',
      price: 2,
      isOutOfStock: false
    }
  ]
}

export const customerDiscoveryHandlers: Record<string, GraphqlHandler> = {
  UnknownOperation: () => ({
    data: {
      profile: {
        _id: 'mock-customer',
        name: 'Automation Customer',
        phone: '+920000000001',
        phoneIsVerified: true,
        email: 'qa.customer@example.test',
        emailIsVerified: true,
        notificationToken: '',
        isOrderNotification: true,
        isOfferNotification: true,
        addresses: [],
        favourite: []
      }
    }
  }),
  Banners: () => ({
    data: { banners: [] }
  }),
  FetchAllShopTypes: () => ({
    data: { fetchAllShopTypes: { data: [] } }
  }),
  GetRecentOrderRestaurants: () => ({
    data: { recentOrderRestaurantsPreview: [] }
  }),
  RestaurantCuisines: () => ({
    data: { nearByRestaurantsCuisines: [] }
  }),
  GetMostOrderedRestaurants: () => ({
    data: { mostOrderedRestaurantsPreview: [] }
  }),
  Orders: () => ({
    data: { orders: [] }
  }),
  PopularItems: () => ({
    data: { popularItems: [] }
  }),
  Restaurants: () => ({
    data: {
      nearByRestaurantsPreview: {
        restaurants: [customerRestaurantPreview]
      }
    }
  }),
  TopRatedVendors: () => ({
    data: { topRatedVendorsPreview: [] }
  }),
  Zones: () => ({
    data: { zones: [] }
  }),
  RestaurantByIdAndSlug: () => ({
    data: { restaurant: customerRestaurant }
  }),
  GetReviewsByRestaurant: () => ({
    data: { reviewsByRestaurant: { reviews: [], ratings: 0, total: 0 } }
  }),
  RelatedItems: () => ({ data: { relatedItems: [] } })
}
