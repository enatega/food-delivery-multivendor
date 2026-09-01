import { expect, test } from '@playwright/test'

import { checkoutHandlers } from '../support/checkout-fixtures.js'
import {
  addConfiguredBurger,
  addPizzaFromSecondRestaurant,
  clearCartStorage,
  seedCustomerSession
} from '../support/checkout-flow.js'
import { openCustomerWeb } from '../support/customer-web.js'
import { mockGraphql } from '../support/mock-graphql.js'

/**
 * Cart durability and the cart/restaurant coupling.
 *
 * The cart lives in localStorage under `cartItems` alongside a `restaurant`
 * key, and adding an item from a different vendor replaces the cart outright
 * rather than merging or prompting. Both behaviours are load-bearing and were
 * previously unverified, which is why the production order suite has to clear
 * a long list of storage keys before it can trust the cart it builds.
 */
test.beforeEach(async ({ page }) => {
  await seedCustomerSession(page)
  await clearCartStorage(page)
  await mockGraphql(page, checkoutHandlers)
})

test('CW-P1-110 keeps cart contents after a page reload', async ({ page }) => {
  await addConfiguredBurger(page, 2)

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true')

  await page.getByRole('button', { name: /show items/i }).click()
  const cartItem = page.getByTestId('cart-item-mock-burger')
  await expect(cartItem).toContainText('Automation Burger')
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('2')
})

test('CW-P1-111 keeps the cart when navigating back to discovery', async ({
  page
}) => {
  await addConfiguredBurger(page)

  await openCustomerWeb(page, '/discovery')

  await page.getByRole('button', { name: /show items/i }).click()
  await expect(page.getByTestId('cart-item-mock-burger')).toBeVisible()
})

test('CW-P1-112 stores the cart against the originating restaurant', async ({
  page
}) => {
  await addConfiguredBurger(page)

  const storedRestaurant = await page.evaluate(() =>
    localStorage.getItem('restaurant')
  )
  expect(storedRestaurant).toBe('mock-restaurant')

  const storedCart = await page.evaluate(() => localStorage.getItem('cartItems'))
  expect(storedCart).toContain('mock-burger')
})

test('CW-P1-113 replaces the cart when adding from a different restaurant', async ({
  page
}) => {
  await addConfiguredBurger(page, 2)
  await addPizzaFromSecondRestaurant(page)

  await page.getByRole('button', { name: /show items/i }).click()

  // The second vendor's item wins outright: no merge, no leftover burger.
  await expect(page.getByTestId('cart-item-mock-pizza')).toBeVisible()
  await expect(page.getByTestId('cart-item-mock-burger')).toHaveCount(0)

  const storedRestaurant = await page.evaluate(() =>
    localStorage.getItem('restaurant')
  )
  expect(storedRestaurant).toBe('mock-restaurant-2')
})

test('CW-P1-114 clears cart storage once the last item is removed', async ({
  page
}) => {
  await addConfiguredBurger(page)

  await page.getByRole('button', { name: /show items/i }).click()
  await page
    .getByTestId('cart-item-mock-burger')
    .getByRole('button', { name: 'Decrease Automation Burger quantity' })
    .click()
  await expect(page.getByText(/your cart is empty/i)).toBeVisible()

  // An emptied cart must not leave a stale item behind for the next session.
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true')
  await page.getByRole('button', { name: /show items/i }).click()
  await expect(page.getByTestId('cart-item-mock-burger')).toHaveCount(0)
})
