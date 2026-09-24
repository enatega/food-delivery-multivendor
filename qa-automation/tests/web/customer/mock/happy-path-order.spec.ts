import { expect, test } from '../../../fixtures/customer-test.js'

import {
  customerRestaurant,
  customerRestaurantPreview,
  customerDiscoveryHandlers
} from '../support/customer-fixtures.js'
import { mockGraphql, type GraphqlHandler } from '../support/mock-graphql.js'

// A logged-in customer profile with one selected delivery address, so the
// checkout can build a valid AddressInput for the (mocked) PlaceOrder call.
const profileWithAddress = {
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

const placedOrder = {
  _id: 'mock-order-1',
  orderId: 'AUT-0001',
  orderStatus: 'PENDING',
  paymentMethod: 'COD',
  paymentStatus: 'PENDING',
  orderAmount: 12,
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

const happyPathHandlers: Record<string, GraphqlHandler> = {
  ...customerDiscoveryHandlers,
  // Anonymous `query { profile { ... } }` resolves to UnknownOperation.
  UnknownOperation: () => ({ data: { profile: profileWithAddress } }),
  EmailExist: () => ({ data: { emailExist: true } }),
  Login: () => ({
    data: {
      login: {
        userId: 'mock-customer',
        token: 'mock-customer-token',
        tokenExpiration: '3600',
        name: 'Automation Customer',
        phone: '+920000000001',
        phoneIsVerified: true,
        email: 'qa.customer@example.test',
        emailIsVerified: true,
        picture: '',
        addresses: profileWithAddress.addresses,
        isNewUser: false,
        userTypeId: 'mock-type',
        isActive: true
      }
    }
  }),
  Tips: () => ({ data: { tips: { tipVariations: [5, 10, 15] } } }),
  Restaurants: () => ({
    data: {
      nearByRestaurantsPreview: {
        restaurants: [customerRestaurantPreview]
      }
    }
  }),
  RestaurantByIdAndSlug: () => ({ data: { restaurant: customerRestaurant } }),
  PlaceOrder: () => ({ data: { placeOrder: placedOrder } })
}

test('CW-P1-070 completes the happy path from login to a placed (mocked) order', async ({
  page,
  customerApp
}) => {
  test.setTimeout(90_000)

  await page.addInitScript(() => {
    localStorage.setItem(
      'location',
      JSON.stringify({
        latitude: 33.6844,
        longitude: 73.0479,
        deliveryAddress: 'Automation Street, Islamabad'
      })
    )
  })
  await mockGraphql(page, happyPathHandlers)

  // 1. Log in through the UI (starts logged out).
  await customerApp.base.open()
  await customerApp.login.login(
    'qa.customer@example.test',
    'automation-password'
  )
  await expect(customerApp.login.trigger).toHaveCount(0)

  // 2. Browse discovery with the selected location and open the restaurant.
  await customerApp.discovery.open()
  await expect(
    customerApp.discovery.restaurantCard('mock-restaurant')
  ).toContainText('Automation Kitchen')
  await customerApp.discovery.openRestaurant('mock-restaurant')
  await expect(customerApp.discovery.page).toHaveURL(
    /\/restaurant\/automation-kitchen\/mock-restaurant\/?$/
  )

  // 3. Configure and add the product to the cart.
  await customerApp.restaurant.selectProduct('mock-burger')
  await customerApp.restaurant.chooseOption(/garlic sauce/i)
  await expect(customerApp.restaurant.addToOrderButton).toBeEnabled()
  await customerApp.restaurant.addSelectedProduct()

  // 4. Open the cart and continue to checkout.
  await customerApp.cart.open()
  await expect(customerApp.cart.item('mock-burger')).toContainText(
    'Automation Burger'
  )
  await customerApp.cart.proceedToCheckout()
  await expect(customerApp.checkout.page).toHaveURL(/\/order\/checkout$/)
  await expect(customerApp.checkout.root).toBeVisible()

  // 5. Choose pickup + cash (COD) and place the order.
  await customerApp.checkout.selectPickup()
  await customerApp.checkout.selectFirstPaymentMethod()
  await expect(customerApp.checkout.placeOrderButton).toBeEnabled()
  await customerApp.checkout.placeOrder()

  // 6. COD success redirects to the order tracking screen.
  await expect(customerApp.orderTracking.page).toHaveURL(
    customerApp.orderTracking.urlFor('mock-order-1'),
    {
      timeout: 20_000
    }
  )
})
