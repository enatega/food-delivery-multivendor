import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { expect, test } from '@playwright/test'

import { validateMobileE2eEnvironment } from '../../scripts/e2e-environment.js'
import { buildStageRun, readOrderNumber } from '../../scripts/e2e-runner.js'

const e2eEnvironment = {
  QA_MOBILE_ENV: 'production',
  QA_MOBILE_ALLOW_PRODUCTION_WRITES: 'true',
  QA_PLACE_REAL_ORDER: 'true',
  QA_E2E_COMPLETE_REAL_ORDER: 'true',
  QA_MOBILE_GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
  QA_MOBILE_ALLOWED_HOSTNAMES: 'aws-server-v2.enatega.com',
  QA_MOBILE_FULFILLMENT: 'delivery',
  QA_MOBILE_PAYMENT_METHOD: 'COD',
  QA_CUSTOMER_EMAIL: 'maestro-customer@example.test',
  QA_CUSTOMER_PASSWORD: 'not-a-real-secret',
  QA_STORE_USERNAME: 'maestro-store@example.test',
  QA_STORE_PASSWORD: 'not-a-real-secret',
  QA_RIDER_USERNAME: 'maestro-rider@example.test',
  QA_RIDER_PASSWORD: 'not-a-real-secret',
  QA_MOBILE_RESTAURANT_NAME: 'Automation Restaurant',
  QA_MOBILE_PRODUCT_NAME: 'Automation Meal',
  QA_MOBILE_PRODUCT_ID: 'product-456',
  QA_MOBILE_OPTION_ID: 'option-789',
  QA_MOBILE_CURRENCY: 'USD',
  QA_MAX_ORDER_TOTAL: '25.00',
  QA_RUN_ID: 'E2E1',
  QA_CUSTOMER_DEVICE_UDID: 'CD51B8EF-B42F-498C-A4DC-F90A7BD8F96E',
  QA_STORE_DEVICE_UDID: '38D56ADC-F015-4CAD-A4FB-BC539C7396C7',
  QA_RIDER_DEVICE_UDID: '2C82D73D-F806-4FE7-A9CC-AE3959687EA2'
}

test('accepts a fully guarded three-app environment', () => {
  const environment = validateMobileE2eEnvironment(e2eEnvironment)
  expect(environment.fulfillment).toBe('delivery')
  expect(environment.paymentMethod).toBe('COD')
  expect(environment.preparationTime).toBe(20)
  expect(environment.storeAppId).toBe('multivendor.enatega.restaurant')
  expect(environment.riderAppId).toBe('com.enatega.multirider')
  expect(environment.store.usePrefilled).toBe(false)
})

test('rejects a pickup order, which no rider is ever offered', () => {
  expect(() =>
    validateMobileE2eEnvironment({
      ...e2eEnvironment,
      QA_MOBILE_FULFILLMENT: 'pickup'
    })
  ).toThrow(/QA_MOBILE_FULFILLMENT must be exactly "delivery"/)
})

test('requires the extra completion guard, because nothing cancels this order', () => {
  expect(() =>
    validateMobileE2eEnvironment({
      ...e2eEnvironment,
      QA_E2E_COMPLETE_REAL_ORDER: 'false'
    })
  ).toThrow(/QA_E2E_COMPLETE_REAL_ORDER must be exactly "true"/)
})

test('accepts the web suite spelling of the store and rider accounts', () => {
  const { QA_STORE_USERNAME, QA_RIDER_USERNAME, ...rest } = e2eEnvironment
  const environment = validateMobileE2eEnvironment({
    ...rest,
    QA_STORE_EMAIL: QA_STORE_USERNAME,
    QA_RIDER_EMAIL: QA_RIDER_USERNAME
  })
  expect(environment.store.username).toBe(QA_STORE_USERNAME)
  expect(environment.rider.username).toBe(QA_RIDER_USERNAME)
})

test('falls back to the credentials the apps prefill when none are configured', () => {
  const {
    QA_STORE_USERNAME,
    QA_STORE_PASSWORD,
    QA_RIDER_USERNAME,
    QA_RIDER_PASSWORD,
    ...rest
  } = e2eEnvironment
  const environment = validateMobileE2eEnvironment(rest)
  expect(environment.store.usePrefilled).toBe(true)
  expect(environment.rider.usePrefilled).toBe(true)

  const store = buildStageRun('store', environment, 'e2e-run', '1234')
  expect(store.args).toContain('USE_PREFILLED_CREDENTIALS=true')
})

test('rejects half a credential, which would type into a prefilled field', () => {
  const { QA_STORE_PASSWORD, ...rest } = e2eEnvironment
  expect(() => validateMobileE2eEnvironment(rest)).toThrow(
    /Set both the store username and password, or neither/
  )
})

test('rejects two stages pointed at the same simulator', () => {
  expect(() =>
    validateMobileE2eEnvironment({
      ...e2eEnvironment,
      QA_STORE_DEVICE_UDID: e2eEnvironment.QA_CUSTOMER_DEVICE_UDID
    })
  ).toThrow(/three different simulators/)
})

test('rejects a preparation time the store sheet never renders', () => {
  expect(() =>
    validateMobileE2eEnvironment({
      ...e2eEnvironment,
      QA_STORE_PREPARATION_TIME: '17'
    })
  ).toThrow(/QA_STORE_PREPARATION_TIME must be one of/)
})

test('targets each stage at its own device and flow', () => {
  const environment = validateMobileE2eEnvironment(e2eEnvironment)
  const customer = buildStageRun('customer', environment, 'e2e-run', null)
  expect(customer.args).toContain(
    `--device=${e2eEnvironment.QA_CUSTOMER_DEVICE_UDID}`
  )
  expect(customer.flow).toBe(
    'maestro/customer/flows/p0-e2e-customer-place-order.yaml'
  )
  expect(customer.args).toContain('METRO_URL=http://localhost:8083')

  const store = buildStageRun('store', environment, 'e2e-run', '1234')
  expect(store.args).toContain(`--device=${e2eEnvironment.QA_STORE_DEVICE_UDID}`)
  expect(store.args).toContain('ORDER_NUMBER=1234')
  expect(store.args).toContain('PREPARATION_TIME=20')
  expect(store.args).toContain('METRO_URL=http://localhost:8081')

  const rider = buildStageRun('rider', environment, 'e2e-run', '1234')
  expect(rider.args).toContain(`--device=${e2eEnvironment.QA_RIDER_DEVICE_UDID}`)
  expect(rider.args).toContain('ORDER_NUMBER=1234')
  expect(rider.args).toContain('METRO_URL=http://localhost:8082')
})

test('normalises a configured Metro URL to the spelling the dev launcher shows', () => {
  const environment = validateMobileE2eEnvironment({
    ...e2eEnvironment,
    QA_RIDER_METRO_URL: 'http://127.0.0.1:8090/'
  })
  expect(environment.riderMetroUrl).toBe('http://127.0.0.1:8090')
})

test('refuses to run a downstream stage without an order number', () => {
  const environment = validateMobileE2eEnvironment(e2eEnvironment)
  expect(() => buildStageRun('store', environment, 'e2e-run', null)).toThrow(
    /cannot run without an order number/
  )
  expect(() =>
    buildStageRun('rider', environment, 'e2e-run', '12; rm -rf /')
  ).toThrow(/letters, digits and hyphens only/)
})

test('recovers the order number the customer stage left behind', () => {
  const root = mkdtempSync(join(tmpdir(), 'qa-e2e-'))
  const screenshots = join(root, 'artifacts', '2026-09-16_000000', 'flow')
  mkdirSync(screenshots, { recursive: true })
  writeFileSync(join(screenshots, 'qa-order-number-987654.png'), '')
  expect(readOrderNumber(root)).toBe('987654')
})

test('refuses to guess when the customer stage left no order number', () => {
  const root = mkdtempSync(join(tmpdir(), 'qa-e2e-'))
  mkdirSync(join(root, 'artifacts'), { recursive: true })
  expect(() => readOrderNumber(root)).toThrow(/no qa-order-number/)
})

test('refuses to guess when more than one order number was captured', () => {
  const root = mkdtempSync(join(tmpdir(), 'qa-e2e-'))
  const screenshots = join(root, 'artifacts')
  mkdirSync(screenshots, { recursive: true })
  writeFileSync(join(screenshots, 'qa-order-number-111.png'), '')
  writeFileSync(join(screenshots, 'qa-order-number-222.png'), '')
  expect(() => readOrderNumber(root)).toThrow(/more than one order number/)
})
