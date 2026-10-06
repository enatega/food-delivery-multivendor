import { expect, type Locator, type Page } from '@playwright/test'

export class LoginPage {
  readonly trigger: Locator
  readonly visibleDialog: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator

  constructor(readonly page: Page) {
    this.trigger = page.getByTestId('customer-login-trigger')
    this.visibleDialog = page.getByRole('dialog').filter({ visible: true })
    this.emailInput = page.getByPlaceholder('example@domain.com')
    this.passwordInput = page.getByPlaceholder(/password/i)
  }

  message(text: string | RegExp) {
    return this.page.getByText(text).last()
  }

  async open() {
    await this.trigger.click()
    const dialog = this.visibleDialog.first()
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: /^login$/i }).click()
    await expect(this.emailInput).toBeVisible()
  }

  async submitEmail(email: string) {
    await this.emailInput.fill(email)
    await this.page
      .getByRole('button', { name: /continue with email/i })
      .click()
  }

  async submitPassword(password: string) {
    await this.passwordInput.fill(password)
    await this.page.keyboard.press('Escape')
    await this.page.getByRole('button', { name: /^continue$/i }).click()
  }

  async login(email: string, password: string) {
    await this.open()
    await this.submitEmail(email)
    await this.submitPassword(password)
  }

  async close() {
    await this.visibleDialog.first().getByTestId('auth-close').click()
  }
}
