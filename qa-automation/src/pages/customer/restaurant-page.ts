import type { Locator, Page } from '@playwright/test'

export class RestaurantPage {
  readonly addToOrderButton: Locator

  constructor(readonly page: Page) {
    this.addToOrderButton = page.getByRole('button', {
      name: /add to order/i
    })
  }

  productCard(productId: string) {
    return this.page.getByTestId(`product-card-${productId}`)
  }

  async selectProduct(productId: string) {
    await this.productCard(productId).click()
  }

  async chooseOption(name: string | RegExp) {
    await this.page.getByLabel(name).check()
  }

  async addSelectedProduct() {
    await this.addToOrderButton.click()
  }
}
