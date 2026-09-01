import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import { expect, test } from '@playwright/test'

import { createCustomerOnlyAuthState } from '../../../../src/auth/customer-auth-state.js'
import {
  openCustomerWeb,
  openEmailLogin
} from '../support/customer-web.js'

const customerAuthState = 'reports/auth/customer.json'

function requiredSecret(name: 'QA_CUSTOMER_EMAIL' | 'QA_CUSTOMER_PASSWORD') {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required in qa-automation/.env`)
  return value
}

test('save an Enatega session after production email login', async ({
  context,
  page
}) => {
  const email = requiredSecret('QA_CUSTOMER_EMAIL')
  const password = requiredSecret('QA_CUSTOMER_PASSWORD')

  await openCustomerWeb(page)
  await openEmailLogin(page)

  await page.getByPlaceholder('example@domain.com').fill(email)

  const emailExistsResponsePromise = page.waitForResponse(
    (response) => {
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
        return body.operationName === 'EmailExist'
      } catch {
        return false
      }
    },
    { timeout: 15_000 }
  )
  await page.getByRole('button', { name: /continue with email/i }).click()

  const emailExistsResponse = await emailExistsResponsePromise
  expect(emailExistsResponse.ok()).toBe(true)

  const emailExistsResult = (await emailExistsResponse.json()) as {
    data?: { emailExist?: boolean }
    errors?: Array<{ message?: string }>
  }
  const emailExistsErrors = emailExistsResult.errors ?? []
  if (emailExistsErrors.length > 0) {
    throw new Error(
      `Email existence check failed: ${emailExistsErrors
        .map(({ message }) => message ?? 'Unknown GraphQL error')
        .join('; ')}`
    )
  }
  expect(
    emailExistsResult.data?.emailExist,
    'QA_CUSTOMER_EMAIL must belong to an existing customer in the configured backend'
  ).toBe(true)

  await expect(page.getByText(/good to see you again/i)).toBeVisible()
  await page.getByPlaceholder(/password/i).fill(password)
  await page.keyboard.press('Escape')

  const loginResponsePromise = page.waitForResponse((response) => {
    if (!response.url().endsWith('/graphql') || response.request().method() !== 'POST') {
      return false
    }

    try {
      const body = response.request().postDataJSON() as {
        operationName?: string
      }
      return body.operationName === 'Login'
    } catch {
      return false
    }
  })

  await page.getByRole('button', { name: /^continue$/i }).click()
  const loginResponse = await loginResponsePromise
  expect(loginResponse.ok()).toBe(true)

  const loginResult = (await loginResponse.json()) as {
    data?: { login?: { token?: string } }
    errors?: Array<{ message?: string }>
  }
  expect(loginResult.errors ?? []).toEqual([])
  expect(loginResult.data?.login?.token).toBeTruthy()

  await expect(page.getByRole('dialog').filter({ visible: true })).toHaveCount(0)
  await expect(page.getByTestId('customer-login-trigger')).toHaveCount(0)

  const browserState = await context.storageState()
  const customerState = createCustomerOnlyAuthState(
    browserState,
    new URL(page.url()).origin
  )

  expect(
    customerState.origins[0]?.localStorage.some(
      ({ name, value }) => name === 'token' && value.length > 0
    )
  ).toBe(true)

  await mkdir(dirname(customerAuthState), { recursive: true })
  await writeFile(customerAuthState, JSON.stringify(customerState, null, 2), {
    mode: 0o600
  })
})
