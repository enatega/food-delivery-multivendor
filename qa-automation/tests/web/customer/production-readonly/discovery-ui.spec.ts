import { expect, test, type Page } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'
import { installProductionReadOnlyGuard } from '../support/production-read-only.js'

type NamedVendor = { _id?: string; name?: string; slug?: string }

function waitForOperation(page: Page, operationName: string) {
  return page.waitForResponse((response) => {
    if (!response.url().endsWith('/graphql')) return false
    try {
      const body = response.request().postDataJSON() as {
        operationName?: string
      }
      return body.operationName === operationName
    } catch {
      return false
    }
  })
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'location',
      JSON.stringify({
        latitude: 33.6844,
        longitude: 73.0479,
        deliveryAddress: 'Automation read-only location'
      })
    )
  })
})

test('CW-P1-PROD-011 renders a real top-rated vendor returned by production GraphQL', async ({
  page
}) => {
  const monitor = await installProductionReadOnlyGuard(page)
  const topRatedPromise = waitForOperation(page, 'TopRatedVendors')

  await openCustomerWeb(page, '/discovery')

  const topRatedResponse = await topRatedPromise
  expect(topRatedResponse.ok()).toBe(true)
  const body = (await topRatedResponse.json()) as {
    data?: { topRatedVendorsPreview?: NamedVendor[] }
  }
  const vendor = body.data?.topRatedVendorsPreview?.find(
    (candidate) => candidate.name && candidate.name.trim().length > 0
  )
  if (!vendor?.name) {
    test.skip(true, 'Production returned no named top-rated vendor')
    return
  }

  await expect(
    page.getByText(vendor.name, { exact: true }).filter({ visible: true }).first()
  ).toBeVisible({ timeout: 20_000 })
  expect(monitor.blockedOperations).toEqual([])
})

test('CW-P1-PROD-012 filters real restaurants by search and restores the list when cleared', async ({
  page
}) => {
  const monitor = await installProductionReadOnlyGuard(page)
  const restaurantsPromise = waitForOperation(page, 'Restaurants')

  await openCustomerWeb(page, '/discovery')

  const restaurantsResponse = await restaurantsPromise
  expect(restaurantsResponse.ok()).toBe(true)
  const body = (await restaurantsResponse.json()) as {
    data?: { nearByRestaurantsPreview?: { restaurants?: NamedVendor[] } }
  }
  const restaurants = (
    body.data?.nearByRestaurantsPreview?.restaurants ?? []
  ).filter((restaurant) => restaurant.name && restaurant.name.trim().length > 0)
  if (restaurants.length < 2) {
    test.skip(true, 'Production returned fewer than two named restaurants')
    return
  }

  const [target, other] = restaurants
  const searchInput = page.locator('#search-input')

  await searchInput.fill(target.name as string)
  await expect(
    page
      .getByText(target.name as string, { exact: true })
      .filter({ visible: true })
      .first()
  ).toBeVisible()

  await searchInput.fill('')
  // Clearing the query restores the broader catalog, including other vendors.
  await expect
    .poll(async () =>
      page
        .getByText(other.name as string, { exact: true })
        .filter({ visible: true })
        .count()
    )
    .toBeGreaterThan(0)

  expect(monitor.blockedOperations).toEqual([])
})
