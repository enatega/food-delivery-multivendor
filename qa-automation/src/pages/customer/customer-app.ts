import type { Page } from '@playwright/test'

import { BasePage } from './base-page.js'
import { CartPage } from './cart-page.js'
import { CheckoutPage } from './checkout-page.js'
import { DiscoveryPage } from './discovery-page.js'
import { LoginPage } from './login-page.js'
import { OrderTrackingPage } from './order-tracking-page.js'
import { RestaurantPage } from './restaurant-page.js'

export class CustomerApp {
  readonly base: BasePage
  readonly cart: CartPage
  readonly checkout: CheckoutPage
  readonly discovery: DiscoveryPage
  readonly login: LoginPage
  readonly orderTracking: OrderTrackingPage
  readonly restaurant: RestaurantPage

  constructor(page: Page) {
    this.base = new BasePage(page)
    this.cart = new CartPage(page)
    this.checkout = new CheckoutPage(page)
    this.discovery = new DiscoveryPage(page)
    this.login = new LoginPage(page)
    this.orderTracking = new OrderTrackingPage(page)
    this.restaurant = new RestaurantPage(page)
  }
}
