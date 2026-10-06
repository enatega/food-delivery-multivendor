import type { Locator, Page } from '@playwright/test'

export class CheckoutPage {
  readonly root: Locator
  readonly placeOrderButton: Locator

  constructor(readonly page: Page) {
    this.root = page.getByTestId('checkout-page')
    this.placeOrderButton = page
      .getByTestId('place-order')
      .filter({ visible: true })
      .first()
  }

  async selectPickup() {
    await this.page.getByRole('button', { name: /pickup/i }).click()
  }

  async selectFirstPaymentMethod() {
    await this.page.locator('input[name="payment"]').first().check()
  }

  async placeOrder() {
    await this.placeOrderButton.click()
  }
}
