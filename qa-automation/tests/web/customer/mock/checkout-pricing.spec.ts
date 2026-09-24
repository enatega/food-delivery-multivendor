import { expect, test } from '@playwright/test'

import {
  CONFIGURED_UNIT_PRICE,
  RESTAURANT_TAX_PERCENT,
  checkoutHandlers
} from '../support/checkout-fixtures.js'
import {
  addConfiguredBurger,
  clearCartStorage,
  goToCheckout,
  readMoney,
  seedCustomerSession,
  selectDelivery,
  selectPickup,
  visibleTestId
} from '../support/checkout-flow.js'
import { mockGraphql } from '../support/mock-graphql.js'

/**
 * Checkout money math against fully mocked data.
 *
 * Pickup zeroes the delivery charge, which removes the Google Maps distance
 * lookup from the calculation and makes every figure exactly predictable:
 *
 *   subtotal = unit price x quantity
 *   tax      = subtotal x restaurant tax %
 *   total    = subtotal + tax
 *
 * This is the one screen where a regression bills real money incorrectly, so
 * these assertions check the arithmetic rather than that a number rendered.
 */
test.beforeEach(async ({ page }) => {
  await seedCustomerSession(page)
  await clearCartStorage(page)
  await mockGraphql(page, checkoutHandlers)
})

test('CW-P1-100 shows a subtotal matching the configured item price', async ({
  page
}) => {
  await addConfiguredBurger(page)
  await goToCheckout(page)
  await selectPickup(page)

  const subtotal = await readMoney(visibleTestId(page, 'checkout-subtotal'))
  expect(subtotal).toBeCloseTo(CONFIGURED_UNIT_PRICE, 2)
})

test('CW-P1-101 scales the subtotal with item quantity', async ({ page }) => {
  await addConfiguredBurger(page, 3)
  await goToCheckout(page)
  await selectPickup(page)

  await expect(visibleTestId(page, 'checkout-item-quantity')).toHaveText('3')

  const subtotal = await readMoney(visibleTestId(page, 'checkout-subtotal'))
  expect(subtotal).toBeCloseTo(CONFIGURED_UNIT_PRICE * 3, 2)
})

test('CW-P1-102 charges tax at the restaurant tax rate', async ({ page }) => {
  await addConfiguredBurger(page, 2)
  await goToCheckout(page)
  await selectPickup(page)

  const subtotal = await readMoney(visibleTestId(page, 'checkout-subtotal'))
  const tax = await readMoney(visibleTestId(page, 'checkout-tax'))

  expect(tax).toBeCloseTo((subtotal * RESTAURANT_TAX_PERCENT) / 100, 2)
})

test('CW-P1-103 totals subtotal plus tax for a pickup order', async ({
  page
}) => {
  await addConfiguredBurger(page, 2)
  await goToCheckout(page)
  await selectPickup(page)

  const subtotal = await readMoney(visibleTestId(page, 'checkout-subtotal'))
  const tax = await readMoney(visibleTestId(page, 'checkout-tax'))
  const total = await readMoney(visibleTestId(page, 'checkout-total'))

  expect(subtotal).toBeCloseTo(CONFIGURED_UNIT_PRICE * 2, 2)
  expect(total).toBeCloseTo(subtotal + tax, 2)
})

test('CW-P1-104 carries a cart quantity change through to the checkout total', async ({
  page
}) => {
  // The checkout itself has no quantity control, so the change is made in the
  // cart drawer and must be reflected in the checkout summary.
  await addConfiguredBurger(page)

  await page.getByRole('button', { name: /show items/i }).click()
  const cartItem = page.getByTestId('cart-item-mock-burger')
  await cartItem
    .getByRole('button', { name: 'Increase Automation Burger quantity' })
    .click()
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('2')

  await page.getByTestId('go-to-checkout').click()
  await expect(page.getByTestId('checkout-page')).toBeVisible()
  await selectPickup(page)

  await expect(visibleTestId(page, 'checkout-item-quantity')).toHaveText('2')

  const subtotal = await readMoney(visibleTestId(page, 'checkout-subtotal'))
  const tax = await readMoney(visibleTestId(page, 'checkout-tax'))
  const total = await readMoney(visibleTestId(page, 'checkout-total'))

  expect(subtotal).toBeCloseTo(CONFIGURED_UNIT_PRICE * 2, 2)
  expect(total).toBeCloseTo(subtotal + tax, 2)
})

test('CW-P1-105 adds a delivery charge only for delivery orders', async ({
  page
}) => {
  await addConfiguredBurger(page, 2)
  await goToCheckout(page)

  await selectPickup(page)
  const pickupTotal = await readMoney(visibleTestId(page, 'checkout-total'))
  const pickupSubtotal = await readMoney(
    visibleTestId(page, 'checkout-subtotal')
  )

  await selectDelivery(page)
  const deliveryTotal = await readMoney(visibleTestId(page, 'checkout-total'))
  const deliverySubtotal = await readMoney(
    visibleTestId(page, 'checkout-subtotal')
  )

  // The item subtotal is delivery-independent; only the total moves, because
  // the delivery charge (and the tax on it) applies to delivery orders only.
  expect(deliverySubtotal).toBeCloseTo(pickupSubtotal, 2)
  expect(deliveryTotal).toBeGreaterThan(pickupTotal)
})
