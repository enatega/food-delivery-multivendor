import { BasePage } from './base-page.js'

export class DiscoveryPage extends BasePage {
  restaurantCard(restaurantId: string) {
    return this.page.getByTestId(`restaurant-card-${restaurantId}`)
  }

  async open() {
    await super.open('/discovery')
  }

  async openRestaurant(restaurantId: string) {
    await this.restaurantCard(restaurantId).click()
  }
}
