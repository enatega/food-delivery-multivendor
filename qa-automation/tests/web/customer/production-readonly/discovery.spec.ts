import { expect, test, type Page } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'
import { installProductionReadOnlyGuard } from '../support/production-read-only.js'

type LiveRestaurant = { _id: string; name: string; slug: string }

function observeLiveRestaurant(page: Page): () => LiveRestaurant | undefined {
  let liveRestaurant: LiveRestaurant | undefined

  page.on('response', async (response) => {
    try {
      const requestBody = response.request().postDataJSON() as {
        operationName?: string
      }
      if (requestBody.operationName !== 'Restaurants' || !response.ok()) return

      const responseBody = (await response.json()) as {
        data?: {
          nearByRestaurantsPreview?: {
            restaurants?: Array<{
              _id?: string
              name?: string
              slug?: string
            }>
          }
        }
      }
      const candidate =
        responseBody.data?.nearByRestaurantsPreview?.restaurants?.find(
          (restaurant) =>
            restaurant._id && restaurant.name && restaurant.slug
        )
      if (candidate?._id && candidate.name && candidate.slug) {
        liveRestaurant = {
          _id: candidate._id,
          name: candidate.name,
          slug: candidate.slug
        }
      }
    } catch {
      // Ignore non-JSON responses; only the Restaurants payload is relevant.
    }
  })

  return () => liveRestaurant
}

test('CW-P1-PROD-001 loads discovery data without a business mutation', async ({
  page
}) => {
  const monitor = await installProductionReadOnlyGuard(page)
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

  await openCustomerWeb(page, '/discovery')

  expect(monitor.blockedOperations).toEqual([])
  await expect(page.getByText('Discovery', { exact: true }).first()).toBeVisible()
  await expect(page.locator('body')).not.toBeEmpty()
})

test('CW-P1-PROD-002 reads configuration from the configured backend', async ({
  request
}) => {
  const graphqlUrl = process.env.QA_READ_ONLY_GRAPHQL_URL
  if (!graphqlUrl) throw new Error('QA_READ_ONLY_GRAPHQL_URL is required')

  const nonce = `playwright-readonly-${Date.now()}`
  const metricsResponse = await request.post(graphqlUrl, {
    headers: { nonce, 'Content-Type': 'application/json' },
    data: {
      query:
        'mutation MetricsGeneral { metricsGeneral { experience hehe } }'
    }
  })
  expect(metricsResponse.ok()).toBeTruthy()

  const metricsBody = (await metricsResponse.json()) as {
    data?: { metricsGeneral?: { experience?: string } }
  }
  const metricsToken = metricsBody.data?.metricsGeneral?.experience
  expect(metricsToken).toBeTruthy()

  const configurationResponse = await request.post(graphqlUrl, {
    headers: {
      nonce,
      'bop-auth': `Bearer ${metricsToken}`,
      'X-Client-Type': 'web',
      'Content-Type': 'application/json'
    },
    data: {
      query:
        'query Configuration { configuration { _id currency currencySymbol } }'
    }
  })
  expect(configurationResponse.ok()).toBeTruthy()

  const configurationBody = (await configurationResponse.json()) as {
    data?: { configuration?: { _id?: string } }
  }
  expect(configurationBody.data?.configuration?._id).toBeTruthy()
})

test('CW-P1-PROD-003 reads real restaurants and menu items from production GraphQL', async ({
  request
}) => {
  const graphqlUrl = process.env.QA_READ_ONLY_GRAPHQL_URL
  if (!graphqlUrl) throw new Error('QA_READ_ONLY_GRAPHQL_URL is required')

  const nonce = `playwright-readonly-${Date.now()}`
  const metricsResponse = await request.post(graphqlUrl, {
    headers: { nonce, 'Content-Type': 'application/json' },
    data: {
      query:
        'mutation MetricsGeneral { metricsGeneral { experience hehe } }'
    }
  })
  expect(metricsResponse.ok()).toBeTruthy()

  const metricsBody = (await metricsResponse.json()) as {
    data?: { metricsGeneral?: { experience?: string } }
  }
  const metricsToken = metricsBody.data?.metricsGeneral?.experience
  expect(metricsToken).toBeTruthy()

  const catalogResponse = await request.post(graphqlUrl, {
    headers: {
      nonce,
      'bop-auth': `Bearer ${metricsToken}`,
      'X-Client-Type': 'web',
      'Content-Type': 'application/json'
    },
    data: {
      operationName: 'ProductionCatalog',
      variables: {
        latitude: 33.6844,
        longitude: 73.0479,
        page: 1,
        limit: 25
      },
      query: `query ProductionCatalog(
        $latitude: Float!
        $longitude: Float!
        $page: Int!
        $limit: Int!
      ) {
        nearByRestaurantsPreview(
          latitude: $latitude
          longitude: $longitude
          page: $page
          limit: $limit
        ) {
          restaurants {
            _id
            name
            slug
            isActive
            isAvailable
          }
        }
      }`
    }
  })
  const catalogResponseText = await catalogResponse.text()
  expect(
    catalogResponse.ok(),
    `Production catalog returned HTTP ${catalogResponse.status()}: ${catalogResponseText}`
  ).toBeTruthy()

  const catalogBody = JSON.parse(catalogResponseText) as {
    errors?: Array<{ message?: string }>
    data?: {
      nearByRestaurantsPreview?: {
        restaurants?: Array<{
          _id?: string
          name?: string
          slug?: string
        }>
      }
    }
  }

  expect(catalogBody.errors).toBeUndefined()
  const restaurants =
    catalogBody.data?.nearByRestaurantsPreview?.restaurants ?? []
  expect(restaurants.length).toBeGreaterThan(0)
  const restaurant = restaurants.find(
    (candidate) => candidate._id && candidate.name && candidate.slug
  )
  expect(restaurant).toBeTruthy()

  const menuResponse = await request.post(graphqlUrl, {
    headers: {
      nonce,
      'bop-auth': `Bearer ${metricsToken}`,
      'X-Client-Type': 'web',
      'Content-Type': 'application/json'
    },
    data: {
      operationName: 'ProductionMenu',
      variables: { id: restaurant?._id },
      query: `query ProductionMenu($id: String!) {
        restaurant(id: $id) {
          _id
          name
          slug
          categories {
            _id
            title
            foods {
              _id
              title
              isOutOfStock
              variations {
                _id
                title
                price
                isOutOfStock
              }
            }
          }
        }
      }`
    }
  })
  const menuResponseText = await menuResponse.text()
  expect(
    menuResponse.ok(),
    `Production menu returned HTTP ${menuResponse.status()}: ${menuResponseText}`
  ).toBeTruthy()

  const menuBody = JSON.parse(menuResponseText) as {
    errors?: Array<{ message?: string }>
    data?: {
      restaurant?: {
        _id?: string
        name?: string
        categories?: Array<{
          foods?: Array<{ _id?: string; title?: string }>
        }>
      }
    }
  }
  expect(menuBody.errors).toBeUndefined()
  expect(menuBody.data?.restaurant?._id).toBe(restaurant?._id)
  expect(
    menuBody.data?.restaurant?.categories?.some((category) =>
      category.foods?.some((food) => food._id && food.title)
    )
  ).toBeTruthy()
})

test('CW-P1-PROD-004 opens a real production restaurant and renders its menu', async ({
  page
}) => {
  const monitor = await installProductionReadOnlyGuard(page)
  const getLiveRestaurant = observeLiveRestaurant(page)

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

  await openCustomerWeb(page, '/discovery')

  await expect
    .poll(() => monitor.allowedOperations)
    .toContain('Restaurants')
  await expect.poll(getLiveRestaurant).toBeTruthy()
  const liveRestaurant = getLiveRestaurant()
  if (!liveRestaurant) throw new Error('Production returned no restaurant')

  await openCustomerWeb(
    page,
    `/restaurant/${liveRestaurant.slug}/${liveRestaurant._id}`
  )

  await expect(page).toHaveURL(/\/restaurant\/[^/]+\/[^/]+\/?$/)
  await expect
    .poll(() => monitor.allowedOperations)
    .toContain('RestaurantByIdAndSlug')
  await expect(
    page.locator('[data-testid^="product-card-"]:visible').first()
  ).toBeVisible({ timeout: 20_000 })
  expect(monitor.blockedOperations).toEqual([])
})

test('CW-P1-PROD-005 searches real production restaurant data', async ({
  page
}) => {
  const monitor = await installProductionReadOnlyGuard(page)
  const getLiveRestaurant = observeLiveRestaurant(page)
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

  await openCustomerWeb(page, '/discovery')

  await expect.poll(getLiveRestaurant).toBeTruthy()
  const liveRestaurant = getLiveRestaurant()
  if (!liveRestaurant) throw new Error('Production returned no restaurant')

  await page.locator('#search-input').fill(liveRestaurant.name)
  await expect(
    page
      .getByText(liveRestaurant.name, { exact: true })
      .filter({ visible: true })
      .first()
  ).toBeVisible()
  expect(monitor.blockedOperations).toEqual([])
})
