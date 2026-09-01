import { expect, test } from '@playwright/test'

import {
  monitorForbiddenHosts,
  openCustomerWeb
} from '../support/customer-web.js'
import { mockGraphql } from '../support/mock-graphql.js'

test.beforeEach(async ({ page }) => {
  await mockGraphql(page)
})

test('CW-P1-001 opens Customer Web without a fatal error @mobile @cross-browser', async ({
  page
}) => {
  const forbiddenRequests = await monitorForbiddenHosts(page)

  await openCustomerWeb(page)

  await expect(page.getByText('LIFE TASTES BETTER WITH ENATEGA')).toBeVisible()
  await expect(page.getByTestId('customer-login-trigger')).toBeVisible()
  expect(forbiddenRequests).toEqual([])
})

test('CW-P1-002 and CW-P1-005 navigate to Customer Web static pages', async ({
  page
}) => {
  await openCustomerWeb(page)

  for (const destination of [
    { name: 'About us', path: '/about' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' }
  ]) {
    await page.getByRole('button', { name: destination.name }).click()
    await expect(page).toHaveURL(new RegExp(`${destination.path}/?$`))
    await expect(page.locator('main, body')).not.toBeEmpty()
    await page.goto('/')
  }
})

test('CW-P1-004 persists the selected theme after refresh @mobile', async ({
  page
}) => {
  await openCustomerWeb(page)

  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('CW-P1-006 renders a customer-friendly not-found page', async ({
  page
}) => {
  await openCustomerWeb(page, '/automation-route-that-does-not-exist')

  await expect(page.getByText(/not found|404/i).first()).toBeVisible()
})
