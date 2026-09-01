import { expect, test, type Page, type Response } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'
import { installProductionReadOnlyGuard } from '../support/production-read-only.js'

type GraphqlResult<T> = {
  data?: T
  errors?: Array<{ message?: string }>
}

function waitForGraphqlOperation(page: Page, operationName: string) {
  return page.waitForResponse((response) => {
    if (!response.url().endsWith('/graphql') || response.request().method() !== 'POST') {
      return false
    }

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

test('CW-P1-PROD-020 restores the real authenticated customer session', async ({
  page
}) => {
  await openCustomerWeb(page, '/profile')

  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByTestId('customer-login-trigger')).toHaveCount(0)
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('token')))
    .not.toBeNull()

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page).toHaveURL(/\/profile$/)
  await expect(page.getByTestId('customer-login-trigger')).toHaveCount(0)
})

test('CW-P1-PROD-090 displays the real production customer profile', async ({
  page
}) => {
  const profileResponsePromise = page.waitForResponse(async (response) => {
    if (!response.url().endsWith('/graphql') || response.request().method() !== 'POST') {
      return false
    }

    try {
      const body = response.request().postDataJSON() as { query?: string }
      return Boolean(body.query && /\bprofile\s*\{/.test(body.query))
    } catch {
      return false
    }
  })

  await openCustomerWeb(page, '/profile')
  const profileResponse = await profileResponsePromise
  const result = await readGraphql<{
    profile: {
      email: string
      emailIsVerified: boolean
      phone?: string
      phoneIsVerified: boolean
    }
  }>(profileResponse)

  expect(result.profile.email).toBe(process.env.QA_CUSTOMER_EMAIL)
  expect(result.profile.emailIsVerified).toBe(true)
  await expect(page.getByText(result.profile.email, { exact: true })).toBeVisible()

  if (result.profile.phone) {
    expect(result.profile.phoneIsVerified).toBe(true)
    await expect(page.getByText(result.profile.phone, { exact: true })).toBeVisible()
  }
})

test('CW-P1-PROD-092 loads real active and past order history', async ({
  page
}) => {
  const activeResponsePromise = waitForGraphqlOperation(
    page,
    'GetUsersActiveOrders'
  )
  const pastResponsePromise = waitForGraphqlOperation(
    page,
    'GetUsersPastOrders'
  )

  await openCustomerWeb(page, '/profile/order-history')

  const [activeResult, pastResult] = await Promise.all([
    activeResponsePromise.then((response) =>
      readGraphql<{ getUsersActiveOrders: unknown[] }>(response)
    ),
    pastResponsePromise.then((response) =>
      readGraphql<{ getUsersPastOrders: unknown[] }>(response)
    )
  ])

  expect(Array.isArray(activeResult.getUsersActiveOrders)).toBe(true)
  expect(Array.isArray(pastResult.getUsersPastOrders)).toBe(true)
  await expect(page).toHaveURL(/\/profile\/order-history$/)
  await expect(page.getByTestId('customer-login-trigger')).toHaveCount(0)
})
