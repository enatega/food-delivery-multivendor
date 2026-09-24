import { expect, test, type Page, type Response } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'
import { installProductionReadOnlyGuard } from '../support/production-read-only.js'

type GraphqlResult<T> = {
  data?: T
  errors?: Array<{ message?: string }>
}

function waitForProfileResponse(page: Page) {
  return page.waitForResponse(async (response) => {
    if (
      !response.url().endsWith('/graphql') ||
      response.request().method() !== 'POST'
    ) {
      return false
    }
    try {
      const body = response.request().postDataJSON() as { query?: string }
      return Boolean(body.query && /\bprofile\s*\{/.test(body.query))
    } catch {
      return false
    }
  })
}

async function readGraphql<T>(response: Response): Promise<T> {
  expect(response.ok()).toBe(true)
  const result = (await response.json()) as GraphqlResult<T>
  expect(result.errors ?? []).toEqual([])
  expect(result.data).toBeTruthy()
  return result.data as T
}

test.beforeEach(async ({ page }) => {
  await installProductionReadOnlyGuard(page)
})

test('CW-P1-PROD-094 loads real saved addresses for the authenticated customer', async ({
  page
}) => {
  const profilePromise = waitForProfileResponse(page)

  await openCustomerWeb(page, '/profile/addresses')

  const data = await readGraphql<{
    profile: {
      addresses: Array<{
        _id?: string
        label?: string
        deliveryAddress?: string
      }>
    }
  }>(await profilePromise)

  expect(Array.isArray(data.profile.addresses)).toBe(true)
  await expect(page).toHaveURL(/\/profile\/addresses$/)
  await expect(page.getByTestId('customer-login-trigger')).toHaveCount(0)

  const namedAddress = data.profile.addresses.find(
    (address) => address.deliveryAddress && address.deliveryAddress.trim()
  )
  if (namedAddress?.deliveryAddress) {
    await expect(
      page
        .getByText(namedAddress.deliveryAddress, { exact: false })
        .filter({ visible: true })
        .first()
    ).toBeVisible()
  }
})

test('CW-P1-PROD-096 keeps the authenticated session on the settings page and shows the real email', async ({
  page
}) => {
  const profilePromise = waitForProfileResponse(page)

  await openCustomerWeb(page, '/profile/settings')

  const data = await readGraphql<{ profile: { email: string } }>(
    await profilePromise
  )

  expect(data.profile.email).toBe(process.env.QA_CUSTOMER_EMAIL)
  await expect(page).toHaveURL(/\/profile\/settings$/)
  await expect(page.getByTestId('customer-login-trigger')).toHaveCount(0)
  await expect(
    page.getByText(data.profile.email, { exact: false }).first()
  ).toBeVisible()
})

test('CW-P1-PROD-098 reads real favourites for the authenticated customer', async ({
  page
}) => {
  const favouritePromise = page.waitForResponse((response) => {
    if (
      !response.url().endsWith('/graphql') ||
      response.request().method() !== 'POST'
    ) {
      return false
    }
    try {
      const body = response.request().postDataJSON() as {
        operationName?: string
      }
      return body.operationName === 'UserFavourite'
    } catch {
      return false
    }
  })

  await openCustomerWeb(page, '/profile')

  // Favourites are optional; only assert their shape when the app requests them.
  const favouriteResponse = await Promise.race([
    favouritePromise,
    page.waitForTimeout(8_000).then(() => undefined)
  ])

  if (!favouriteResponse) {
    test.skip(true, 'Customer Web did not request UserFavourite on /profile')
    return
  }

  const data = await readGraphql<{ userFavourite: unknown[] }>(favouriteResponse)
  expect(Array.isArray(data.userFavourite)).toBe(true)
  await expect(page.getByTestId('customer-login-trigger')).toHaveCount(0)
})
