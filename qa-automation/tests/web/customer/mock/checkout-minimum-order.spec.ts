import { expect, test } from '@playwright/test'

import {
  HIGH_MINIMUM_ORDER,
  HIGH_MINIMUM_UNIT_PRICE,
  checkoutHandlers
} from '../support/checkout-fixtures.js'
import {
  addConfiguredBurger,
  addFriesBelowMinimum,
  clearCartStorage,
  goToCheckout,
  readMoney,
  seedCustomerSession,
  selectPickup,
  visibleTestId
} from '../support/checkout-flow.js'
import { mockGraphql, type MockGraphql } from '../support/mock-graphql.js'

/**
 * Minimum-order enforcement.
 *
 * Customer Web does not disable the order button for an under-minimum cart --
 * it validates inside the click handler and surfaces a toast (see the checkout
 * screen's order validation). So the meaningful assertion is that no PlaceOrder
 * mutation reaches the backend, not that a control is disabled. Asserting on
 * the mutation is also what makes this test resistant to copy changes.
 */
let graphql: MockGraphql

test.beforeEach(async ({ page }) => {
  await seedCustomerSession(page)
  await clearCartStorage(page)
  graphql = await mockGraphql(page, checkoutHandlers)
})

function placeOrderCalls() {
  return graphql.operations.filter(
    (operation) => operation.operationName === 'PlaceOrder'
  )
}

test('CW-P1-120 refuses to place an order below the restaurant minimum', async ({
  page
}) => {
  await addFriesBelowMinimum(page)
  await goToCheckout(page)
  await selectPickup(page)
  await page.locator('input[name="payment"]').first().check()

  const subtotal = await readMoney(visibleTestId(page, 'checkout-subtotal'))
  expect(subtotal).toBeLessThan(HIGH_MINIMUM_ORDER)

  await visibleTestId(page, 'place-order').click()

  // The minimum-order warning must block the mutation outright.
  await expect(page.getByText(/minimum amount/i).first()).toBeVisible()
  await expect(page).toHaveURL(/\/order\/checkout$/)
  expect(placeOrderCalls()).toHaveLength(0)
})

test('CW-P1-121 keeps blocking while the cart stays under the minimum', async ({
  page
}) => {
  // Still short of the $50 minimum even at four units.
  await addFriesBelowMinimum(page, 4)
  await goToCheckout(page)
  await selectPickup(page)
  await page.locator('input[name="payment"]').first().check()

  const subtotal = await readMoney(visibleTestId(page, 'checkout-subtotal'))
  expect(subtotal).toBeCloseTo(HIGH_MINIMUM_UNIT_PRICE * 4, 2)
  expect(subtotal).toBeLessThan(HIGH_MINIMUM_ORDER)

  await visibleTestId(page, 'place-order').click()

  await expect(page.getByText(/minimum amount/i).first()).toBeVisible()
  expect(placeOrderCalls()).toHaveLength(0)
})

test('CW-P1-122 places the order once the cart clears the minimum', async ({
  page
}) => {
  // The control case: Automation Kitchen's $5 minimum is cleared by one $12
  // burger, so the same flow must reach the backend.
  await addConfiguredBurger(page)
  await goToCheckout(page)
  await selectPickup(page)
  await page.locator('input[name="payment"]').first().check()

  await expect(visibleTestId(page, 'place-order')).toBeEnabled()
  await visibleTestId(page, 'place-order').click()

  await expect(page).toHaveURL(/\/order\/mock-order-1\/tracking\/?$/, {
    timeout: 20_000
  })
  expect(placeOrderCalls()).toHaveLength(1)
})

test('CW-P1-123 disables the order button for an empty cart', async ({
  page
}) => {
  await addConfiguredBurger(page)

  await page.getByRole('button', { name: /show items/i }).click()
  await page
    .getByTestId('cart-item-mock-burger')
    .getByRole('button', { name: 'Decrease Automation Burger quantity' })
    .click()
  await expect(page.getByText(/your cart is empty/i)).toBeVisible()

  await page.goto('/order/checkout', { waitUntil: 'domcontentloaded' })

  // An empty cart is the one case the checkout does gate on the button itself.
  await expect(visibleTestId(page, 'place-order')).toBeDisabled()
  expect(placeOrderCalls()).toHaveLength(0)
})
