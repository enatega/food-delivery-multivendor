import { expect, test } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'
import { customerDiscoveryHandlers } from '../support/customer-fixtures.js'
import { mockGraphql } from '../support/mock-graphql.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-customer-token')
    localStorage.setItem(
      'location',
      JSON.stringify({
        latitude: 33.6844,
        longitude: 73.0479,
        deliveryAddress: 'Automation mock location'
      })
    )
  })
  await mockGraphql(page, customerDiscoveryHandlers)
})

test('CW-P1-060 finds the deterministic restaurant by search query', async ({
  page
}) => {
  await openCustomerWeb(page, '/discovery')
  await expect(
    page.getByTestId('restaurant-card-mock-restaurant')
  ).toBeVisible()

  await page.locator('#search-input').fill('Automation Kitchen')

  await expect(
    page
      .getByText('Automation Kitchen', { exact: true })
      .filter({ visible: true })
      .first()
  ).toBeVisible()
})

test('CW-P1-062 opens the language menu without leaving discovery @mobile', async ({
  page
}) => {
  await openCustomerWeb(page, '/discovery')

  await page.getByTestId('language-menu-trigger').first().click()

  // The trigger reveals the localisation menu while keeping the user in place.
  await expect(page).toHaveURL(/\/discovery\/?$/)
  await expect(page.getByRole('menu').or(page.getByRole('listbox')).first())
    .toBeVisible()
})

test('CW-P1-064 shows an empty cart before any item is added', async ({
  page
}) => {
  await openCustomerWeb(page, '/discovery')

  await page
    .getByTestId('customer-cart-trigger')
    .filter({ visible: true })
    .first()
    .click()

  await expect(page.getByText(/your cart is empty/i)).toBeVisible()
})
