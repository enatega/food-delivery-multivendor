import { expect, test } from '../../../fixtures/customer-test.js'
import { mockGraphql } from '../support/mock-graphql.js'

test('CW-P1-022 rejects an invalid email without an authentication request @mobile', async ({
  page,
  customerApp
}) => {
  const graphql = await mockGraphql(page)
  await customerApp.base.open()
  await customerApp.login.open()

  await customerApp.login.submitEmail('invalid-email')

  await expect(customerApp.login.message(/valid email/i)).toBeVisible()
  expect(
    graphql.operations.filter(({ operationName }) => operationName === 'EmailExist')
  ).toHaveLength(0)
})

test('CW-P1-021 displays an error for an invalid password', async ({
  page,
  customerApp
}) => {
  await mockGraphql(page, {
    EmailExist: () => ({ data: { emailExist: true } }),
    Login: () => ({ errors: [{ message: 'Invalid credentials' }] })
  })
  await customerApp.base.open()
  await customerApp.login.open()

  await customerApp.login.submitEmail('qa.customer@example.test')
  await customerApp.login.submitPassword('wrong-password')

  await expect(customerApp.login.message(/invalid credentials/i)).toBeVisible()
})

test('CW-P1-025 closes authentication without creating a session', async ({
  page,
  customerApp
}) => {
  await mockGraphql(page)
  await customerApp.base.open()
  await customerApp.login.open()

  await customerApp.login.close()

  await expect(customerApp.login.visibleDialog).toHaveCount(0)
  await expect(customerApp.login.trigger).toBeVisible()
})
