import type { Locator, Page } from '@playwright/test'

export class CartPage {
  readonly showItemsButton: Locator
  readonly checkoutButton: Locator

  constructor(readonly page: Page) {
    this.showItemsButton = page.getByRole('button', { name: /show items/i })
    this.checkoutButton = page.getByTestId('go-to-checkout')
  }

  item(productId: string) {
    return this.page.getByTestId(`cart-item-${productId}`)
  }

  async open() {
    await this.showItemsButton.click()
  }

  async proceedToCheckout() {
    await this.checkoutButton.click()
  }
}
