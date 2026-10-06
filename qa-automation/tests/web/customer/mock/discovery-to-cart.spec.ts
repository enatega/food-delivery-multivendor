import { expect, test } from '@playwright/test'

import {
  monitorForbiddenHosts,
  openCustomerWeb
} from '../support/customer-web.js'
import { customerDiscoveryHandlers } from '../support/customer-fixtures.js'
import { mockGraphql } from '../support/mock-graphql.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-customer-token')
  })
  await mockGraphql(page, customerDiscoveryHandlers)
})

test('CW-P1-030 lists a serviceable restaurant without contacting production', async ({
  page
}) => {
  const forbiddenRequests = await monitorForbiddenHosts(page)

  await openCustomerWeb(page, '/discovery')

  await expect(
    page.getByTestId('restaurant-card-mock-restaurant')
  ).toContainText('Automation Kitchen')
  expect(forbiddenRequests).toEqual([])
})

test('CW-P1-035 opens restaurant details and loads its menu', async ({
  page
}) => {
  await openCustomerWeb(page, '/discovery')

  await page.getByTestId('restaurant-card-mock-restaurant').click()

  await expect(page).toHaveURL(
    /\/restaurant\/automation-kitchen\/mock-restaurant\/?$/
  )
  await expect(page.getByText('Automation Kitchen').first()).toBeVisible()
  await expect(page.getByTestId('product-card-mock-burger')).toContainText(
    'Automation Burger'
  )
})

test('CW-P1-041 requires the configured product option before adding', async ({
  page
}) => {
  await openCustomerWeb(
    page,
    '/restaurant/automation-kitchen/mock-restaurant'
  )

  await page.getByTestId('product-card-mock-burger').click()

  const addToOrder = page.getByRole('button', { name: /add to order/i })
  await expect(page.getByText('Choose a sauce')).toBeVisible()
  await expect(addToOrder).toBeDisabled()

  await page.getByLabel(/garlic sauce/i).check()

  await expect(addToOrder).toBeEnabled()
  await expect(addToOrder).toContainText('$12.00')
})

test('CW-P1-044 and CW-P1-045 recalculate quantity and add the configured product', async ({
  page
}) => {
  await openCustomerWeb(
    page,
    '/restaurant/automation-kitchen/mock-restaurant'
  )

  await page.getByTestId('product-card-mock-burger').click()
  await page.getByLabel(/garlic sauce/i).check()
  await page.getByRole('button', { name: 'Increase product quantity' }).click()

  const addToOrder = page.getByRole('button', { name: /add to order/i })
  await expect(addToOrder).toContainText('$24.00')
  await addToOrder.click()

  await page.getByRole('button', { name: /show items/i }).click()
  const cartItem = page.getByTestId('cart-item-mock-burger')
  await expect(cartItem).toContainText('Automation Burger')
  await expect(cartItem).toContainText('$12.00')
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('2')
})

test('CW-P1-051 and CW-P1-053 update quantity and remove the final cart item', async ({
  page
}) => {
  await openCustomerWeb(
    page,
    '/restaurant/automation-kitchen/mock-restaurant'
  )

  await page.getByTestId('product-card-mock-burger').click()
  await page.getByLabel(/garlic sauce/i).check()
  await page.getByRole('button', { name: /add to order/i }).click()
  await page.getByRole('button', { name: /show items/i }).click()

  const cartItem = page.getByTestId('cart-item-mock-burger')
  await cartItem.getByRole('button', {
    name: 'Increase Automation Burger quantity'
  }).click()
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('2')

  await cartItem.getByRole('button', {
    name: 'Decrease Automation Burger quantity'
  }).click()
  await expect(cartItem.getByTestId('cart-item-quantity')).toHaveText('1')

  await cartItem.getByRole('button', {
    name: 'Decrease Automation Burger quantity'
  }).click()
  await expect(page.getByText(/your cart is empty/i)).toBeVisible()
})
