import { expect, type Page } from '@playwright/test'

export class BasePage {
  constructor(readonly page: Page) {}

  async open(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' })
    await expect(this.page).toHaveTitle(/Enatega Multivendor/i)
    // AppLayout sets this after hydration. A cold Next.js dev compile can take
    // longer than the default 10s assertion timeout, so this matches the 30s
    // openCustomerWeb already allows for the same wait.
    await expect(this.page.locator('html')).toHaveAttribute(
      'data-app-ready',
      'true',
      { timeout: 30_000 }
    )
  }
}
