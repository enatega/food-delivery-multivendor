import { expect, type Page } from '@playwright/test'

export class BasePage {
  constructor(readonly page: Page) {}

  async open(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' })
    await expect(this.page).toHaveTitle(/Enatega Multivendor/i)
    await expect(this.page.locator('html')).toHaveAttribute(
      'data-app-ready',
      'true'
    )
  }
}
