import {
  customerRestaurant,
  customerRestaurantPreview,
  customerDiscoveryHandlers
} from './customer-fixtures.js'
import type { GraphqlHandler } from './mock-graphql.js'

/**
 * Shared fixtures for the mocked checkout suites.
 *
 * The deterministic restaurant charges 5% tax and has a $5 minimum order. Its
 * only product is a $10 "Regular" variation plus a required $2 sauce option,
 * so one configured unit is always $12.00. Keeping those numbers here means a
 * fixture change surfaces as one failing constant instead of scattered magic
 * numbers across the specs.
 */
export const CONFIGURED_UNIT_PRICE = 12
export const RESTAURANT_TAX_PERCENT = customerRestaurant.tax
export const RESTAURANT_MINIMUM_ORDER = customerRestaurant.minimumOrder

/** A logged-in profile with one selected address, enough to reach checkout. */
export const checkoutProfile = {
  _id: 'mock-customer',
  name: 'Automation Customer',
  phone: '+920000000001',
  phoneIsVerified: true,
  email: 'qa.customer@example.test',
  emailIsVerified: true,
  notificationToken: '',
  isOrderNotification: true,
  isOfferNotification: true,
  addresses: [
    {
      _id: 'mock-address',
      label: 'Home',
      deliveryAddress: 'Automation Street, Islamabad',
      details: 'Apartment 1',
      location: { coordinates: [73.0479, 33.6844] },
      selected: true
    }
  ],
  favourite: []
}

/**
 * A second restaurant used to prove cart/coupon behaviour when the customer
 * switches vendors. Deliberately priced differently from Automation Kitchen.
 */
export const secondRestaurantPreview = {
  ...customerRestaurantPreview,
  _id: 'mock-restaurant-2',
  name: 'Automation Diner',
  slug: 'automation-diner',
  minimumOrder: 3
}

export const secondRestaurant = {
  ...customerRestaurant,
  ...secondRestaurantPreview,
  username: 'automation-diner',
  categories: [
    {
      _id: 'mock-category-2',
      title: 'Mains',
      foods: [
        {
          _id: 'mock-pizza',
          title: 'Automation Pizza',
          image: '/favicon.png',
          description: 'A deterministic pizza for Customer Web automation.',
          isOutOfStock: false,
          subCategory: null,
          variations: [
            {
              _id: 'mock-pizza-regular',
              title: 'Regular',
              price: 8,
              discounted: 0,
              addons: [],
              isOutOfStock: false
            }
          ]
        }
      ]
    }
  ],
  addons: [],
  options: []
}

/**
 * A restaurant whose minimum order sits above the price of its only item, so
 * a single unit is always below the minimum. Used to exercise the rejection
 * path that the normal fixtures can never reach.
 */
export const highMinimumRestaurantPreview = {
  ...customerRestaurantPreview,
  _id: 'mock-restaurant-min',
  name: 'Automation Minimums',
  slug: 'automation-minimums',
  minimumOrder: 50
}

export const highMinimumRestaurant = {
  ...customerRestaurant,
  ...highMinimumRestaurantPreview,
  username: 'automation-minimums',
  categories: [
    {
      _id: 'mock-category-min',
      title: 'Sides',
      foods: [
        {
          _id: 'mock-fries',
          title: 'Automation Fries',
          image: '/favicon.png',
          description: 'A deterministic side for Customer Web automation.',
          isOutOfStock: false,
          subCategory: null,
          variations: [
            {
              _id: 'mock-fries-regular',
              title: 'Regular',
              price: 4,
              discounted: 0,
              addons: [],
              isOutOfStock: false
            }
          ]
        }
      ]
    }
  ],
  addons: [],
  options: []
}

export const HIGH_MINIMUM_UNIT_PRICE = 4
export const HIGH_MINIMUM_ORDER = highMinimumRestaurantPreview.minimumOrder

export const placedOrder = {
  _id: 'mock-order-1',
  orderId: 'AUT-0001',
  orderStatus: 'PENDING',
  paymentMethod: 'COD',
  paymentStatus: 'PENDING',
  orderAmount: CONFIGURED_UNIT_PRICE,
  paidAmount: 0,
  isPickedUp: true,
  restaurant: {
    _id: customerRestaurant._id,
    name: customerRestaurant.name,
    image: '/favicon.png',
    slug: customerRestaurant.slug,
    address: customerRestaurant.address,
    location: { coordinates: [73.0479, 33.6844] }
  },
  deliveryAddress: {
    location: { coordinates: [73.0479, 33.6844] },
    deliveryAddress: 'Automation Street, Islamabad'
  },
  items: []
}

/** Serves whichever mock restaurant the page asked for by id or slug. */
const restaurantById: GraphqlHandler = (body) => {
  const variables = (body.variables ?? {}) as { id?: string; slug?: string }
  const matched = [secondRestaurant, highMinimumRestaurant].find(
    (candidate) =>
      variables.id === candidate._id || variables.slug === candidate.slug
  )
  return { data: { restaurant: matched ?? customerRestaurant } }
}

export const checkoutHandlers: Record<string, GraphqlHandler> = {
  ...customerDiscoveryHandlers,
  // Customer Web sends the profile query anonymously, so it arrives here as
  // UnknownOperation rather than under a named operation.
  UnknownOperation: () => ({ data: { profile: checkoutProfile } }),
  Tips: () => ({ data: { tips: { tipVariations: [5, 10, 15] } } }),
  Restaurants: () => ({
    data: {
      nearByRestaurantsPreview: {
        restaurants: [
          customerRestaurantPreview,
          secondRestaurantPreview,
          highMinimumRestaurantPreview
        ]
      }
    }
  }),
  RestaurantByIdAndSlug: restaurantById,
  PlaceOrder: () => ({ data: { placeOrder: placedOrder } })
}

/** Seeds the delivery zone Customer Web needs before discovery will render. */
export const automationLocation = {
  latitude: 33.6844,
  longitude: 73.0479,
  deliveryAddress: 'Automation Street, Islamabad'
}
