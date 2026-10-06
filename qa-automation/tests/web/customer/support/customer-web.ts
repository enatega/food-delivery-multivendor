import { expect, type Page } from '@playwright/test'

const forbiddenAutomationHosts = new Set([
  'aws-server.enatega.com',
  'aws-server-v2.enatega.com'
])

export async function monitorForbiddenHosts(page: Page): Promise<string[]> {
  const violations: string[] = []

  page.on('request', (request) => {
    const hostname = new URL(request.url()).hostname.toLowerCase()
    if (forbiddenAutomationHosts.has(hostname)) {
      violations.push(request.url())
    }
  })

  return violations
}

export async function openCustomerWeb(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle(/Enatega Multivendor/i)
  // A cold Next.js development compile can take longer than the suite's
  // default assertion timeout before the client layout hydrates.
  await expect(page.locator('html')).toHaveAttribute(
    'data-app-ready',
    'true',
    { timeout: 30_000 }
  )
}

export async function openEmailLogin(page: Page) {
  await page.getByTestId('customer-login-trigger').click()
  const dialog = page.getByRole('dialog').filter({ visible: true }).first()
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: /^login$/i }).click()
  await expect(page.getByPlaceholder('example@domain.com')).toBeVisible()
}
