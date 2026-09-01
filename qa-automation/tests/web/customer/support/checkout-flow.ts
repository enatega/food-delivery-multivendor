import { expect, type Locator, type Page } from '@playwright/test'

import { automationLocation } from './checkout-fixtures.js'
import { openCustomerWeb } from './customer-web.js'

/** Reads a `$12.00`-style money label as a number. */
export async function readMoney(locator: Locator): Promise<number> {
  const text = (await locator.innerText()).trim()
  const amount = text.match(/-?\d+(?:\.\d+)?/)?.[0]
  expect(amount, `no numeric amount in "${text}"`).toBeTruthy()
  return Number(amount)
}

/**
 * Puts the browser in the state Customer Web expects for a mocked session: a
 * logged-in token and a selected delivery zone, both set before first paint so
 * discovery does not bounce to the location prompt.
 */
export async function seedCustomerSession(page: Page) {
  await page.addInitScript((location) => {
    localStorage.setItem('token', 'mock-customer-token')
    localStorage.setItem('location', JSON.stringify(location))
  }, automationLocation)
}

const cartStorageKeys = [
  'cartItems',
  'restaurant',
  'restaurant-slug',
  'cart-product-store-id',
  'cart-product-store-slug',
  'currentShopType',
  'orderInstructions',
  'newOrderInstructions',
  'applied_coupon',
  'coupon_text',
  'is_coupon_applied',
  'coupon_restaurant_id'
]

/**
 * Clears every cart/coupon key so each test starts from an empty cart.
 *
 * Deliberately a one-shot clear rather than an init script: `addInitScript`
 * re-runs on every navigation, which would wipe the cart on the very reloads
 * the persistence specs are trying to observe.
 */
export async function clearCartStorage(page: Page) {
  await page.addInitScript((keys) => {
    const alreadyCleared = '__qaCartCleared'
    if (sessionStorage.getItem(alreadyCleared)) return
    sessionStorage.setItem(alreadyCleared, 'true')
    for (const key of keys) localStorage.removeItem(key)
  }, cartStorageKeys)
}

/**
 * Adds `quantity` of Automation Kitchen's only product, choosing the required
 * sauce option so the add button enables.
 */
export async function addConfiguredBurger(page: Page, quantity = 1) {
  await openCustomerWeb(page, '/restaurant/automation-kitchen/mock-restaurant')
  await page.getByTestId('product-card-mock-burger').click()

  const dialog = page.getByRole('dialog').filter({ visible: true }).last()
  await expect(dialog).toBeVisible()
  await page.getByLabel(/garlic sauce/i).check()

  for (let added = 1; added < quantity; added += 1) {
    await page.getByRole('button', { name: 'Increase product quantity' }).click()
  }

  const addToOrder = page.getByRole('button', { name: /add to order/i })
  await expect(addToOrder).toBeEnabled()
  await addToOrder.click()
  await expect(dialog).toBeHidden()
}

/** Adds Automation Diner's add-on-free product. */
export async function addPizzaFromSecondRestaurant(page: Page) {
  await openCustomerWeb(page, '/restaurant/automation-diner/mock-restaurant-2')
  await page.getByTestId('product-card-mock-pizza').click()

  const dialog = page.getByRole('dialog').filter({ visible: true }).last()
  await expect(dialog).toBeVisible()

  const addToOrder = page.getByRole('button', { name: /add to order/i })
  await expect(addToOrder).toBeEnabled()
  await addToOrder.click()
}

/**
 * Adds `quantity` of the cheap side from the high-minimum restaurant, used to
 * build a cart that sits deliberately below the vendor's minimum order.
 */
export async function addFriesBelowMinimum(page: Page, quantity = 1) {
  await openCustomerWeb(
    page,
    '/restaurant/automation-minimums/mock-restaurant-min'
  )
  await page.getByTestId('product-card-mock-fries').click()

  const dialog = page.getByRole('dialog').filter({ visible: true }).last()
  await expect(dialog).toBeVisible()

  for (let added = 1; added < quantity; added += 1) {
    await page.getByRole('button', { name: 'Increase product quantity' }).click()
  }

  const addToOrder = page.getByRole('button', { name: /add to order/i })
  await expect(addToOrder).toBeEnabled()
  await addToOrder.click()
  await expect(dialog).toBeHidden()
}

/** Opens the cart drawer and continues to the checkout screen. */
export async function goToCheckout(page: Page) {
  await page.getByRole('button', { name: /show items/i }).click()
  await page.getByTestId('go-to-checkout').click()
  await expect(page).toHaveURL(/\/order\/checkout$/)
  await expect(page.getByTestId('checkout-page')).toBeVisible()
}

/**
 * The checkout renders desktop and mobile summaries with the same test ids, so
 * every money assertion must scope to the one that is actually visible.
 */
export function visibleTestId(page: Page, testId: string) {
  return page.getByTestId(testId).filter({ visible: true }).first()
}

/**
 * Switches the checkout to Pickup, which zeroes the delivery charge and skips
 * the address requirement. The toggle carries no test id, so it is matched by
 * its accessible name.
 */
export async function selectPickup(page: Page) {
  await page.getByRole('button', { name: /pickup/i }).click()
}

/** Switches the checkout back to Delivery. */
export async function selectDelivery(page: Page) {
  await page.getByRole('button', { name: /^delivery$/i }).click()
}
