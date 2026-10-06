import type { Page } from '@playwright/test'

export class OrderTrackingPage {
  constructor(readonly page: Page) {}

  urlFor(orderId: string) {
    return new RegExp(`/order/${orderId}/tracking/?$`)
  }
}
