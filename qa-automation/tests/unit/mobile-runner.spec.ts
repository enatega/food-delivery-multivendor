import { expect, test } from '@playwright/test'

import {
  buildMobileRun,
  validateMobileMultiVendorEnvironment,
  validateMobileSmokeEnvironment
} from '../../scripts/mobile-runner.js'

const smokeEnvironment = {
  QA_MOBILE_ENV: 'production',
  QA_MOBILE_GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
  QA_MOBILE_ALLOWED_HOSTNAMES: 'aws-server-v2.enatega.com',
  QA_CUSTOMER_EMAIL: 'maestro-customer@example.test',
  QA_CUSTOMER_PASSWORD: 'not-a-real-secret',
  QA_MOBILE_RESTAURANT_NAME: 'Automation Restaurant',
  QA_MOBILE_PRODUCT_NAME: 'Automation Meal',
  QA_MOBILE_PRODUCT_ID: 'product-456',
  QA_MOBILE_OPTION_ID: 'option-789',
  QA_MOBILE_CURRENCY: 'USD',
  QA_MAX_ORDER_TOTAL: '25.00'
}

test('validates the non-ordering production smoke environment', () => {
  expect(validateMobileSmokeEnvironment(smokeEnvironment)).toEqual({
    appId: 'com.enatega.multivendor.qa',
    graphqlUrl: 'https://aws-server-v2.enatega.com/graphql',
    customerEmail: 'maestro-customer@example.test',
    customerPassword: 'not-a-real-secret',
    restaurantName: 'Automation Restaurant',
    productName: 'Automation Meal',
    productId: 'product-456',
    optionId: 'option-789',
    currency: 'USD',
    maxOrderTotal: 25
  })
})

test('rejects a smoke endpoint outside the exact allowlist', () => {
  expect(() =>
    validateMobileSmokeEnvironment({
      ...smokeEnvironment,
      QA_MOBILE_GRAPHQL_URL: 'https://unexpected.example/graphql'
    })
  ).toThrow('Mobile production hostname is not allowlisted')
})

test('builds a smoke invocation that excludes the production-write flow', () => {
  const run = buildMobileRun('smoke', smokeEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p0-smoke.yaml')
  expect(run.args).toContain('APP_ID=com.enatega.multivendor.qa')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.args).toContain('PRODUCT_ID=product-456')
  expect(run.args).toContain('OPTION_ID=option-789')
  expect(run.reportDirectory).toBe('reports/maestro/run-123')
})

test('builds a regression invocation that runs the read-only P1 directory', () => {
  const run = buildMobileRun('regression', smokeEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p1')
  expect(run.args).toContain('APP_ID=com.enatega.multivendor.qa')
  expect(run.args).toContain('PRODUCT_ID=product-456')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.reportDirectory).toBe('reports/maestro/run-123')
})

test('builds a navigation invocation that runs the read-only P3 directory', () => {
  const run = buildMobileRun('navigation', smokeEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p3')
  expect(run.args).toContain('APP_ID=com.enatega.multivendor.qa')
  expect(run.args).toContain('PRODUCT_ID=product-456')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.reportDirectory).toBe('reports/maestro/run-123')
})

test('rejects a navigation run that fails the read-only environment checks', () => {
  expect(() =>
    buildMobileRun(
      'navigation',
      { ...smokeEnvironment, QA_MOBILE_GRAPHQL_URL: 'https://evil.example.com/graphql' },
      'run-123'
    )
  ).toThrow('Mobile production hostname is not allowlisted')
})

test('rejects a regression run that fails the read-only environment checks', () => {
  expect(() =>
    buildMobileRun(
      'regression',
      { ...smokeEnvironment, QA_MOBILE_ENV: 'staging' },
      'run-123'
    )
  ).toThrow('QA_MOBILE_ENV must be exactly "production"')
})

test('builds the production invocation only after all write guards pass', () => {
  const run = buildMobileRun(
    'production-order',
    {
      ...smokeEnvironment,
      QA_MOBILE_ALLOW_PRODUCTION_WRITES: 'true',
      QA_PLACE_REAL_ORDER: 'true',
      QA_MOBILE_RESTAURANT_ID: 'restaurant-123',
      QA_MOBILE_PRODUCT_ID: 'product-456',
      QA_MOBILE_FULFILLMENT: 'pickup',
      QA_MOBILE_PAYMENT_METHOD: 'COD',
      QA_RUN_ID: 'mobile-20260827-1200-abc1234'
    },
    'run-123'
  )

  expect(run.flow).toBe(
    'maestro/customer/flows/p0-production-order.yaml'
  )
  expect(run.args).toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.args).toContain('RUN_ID=mobile-20260827-1200-abc1234')
})

test('rejects unsafe report path components', () => {
  expect(() => buildMobileRun('smoke', smokeEnvironment, '../escape')).toThrow(
    'report Run ID contains unsupported characters'
  )
})

const multiVendorEnvironment = {
  ...smokeEnvironment,
  QA_MOBILE_SECOND_RESTAURANT_NAME: 'Second Automation Restaurant',
  QA_MOBILE_SECOND_PRODUCT_ID: 'product-999'
}

test('validates the multi-vendor fixtures on top of the read-only environment', () => {
  expect(validateMobileMultiVendorEnvironment(multiVendorEnvironment)).toEqual({
    ...validateMobileSmokeEnvironment(smokeEnvironment),
    secondRestaurantName: 'Second Automation Restaurant',
    secondProductId: 'product-999'
  })
})

test('rejects a multi-vendor run whose second vendor is not a second vendor', () => {
  expect(() =>
    validateMobileMultiVendorEnvironment({
      ...multiVendorEnvironment,
      QA_MOBILE_SECOND_RESTAURANT_NAME: '  automation restaurant  '
    })
  ).toThrow(
    'QA_MOBILE_SECOND_RESTAURANT_NAME must differ from QA_MOBILE_RESTAURANT_NAME'
  )

  expect(() =>
    validateMobileMultiVendorEnvironment({
      ...multiVendorEnvironment,
      QA_MOBILE_SECOND_PRODUCT_ID: 'product-456'
    })
  ).toThrow('QA_MOBILE_SECOND_PRODUCT_ID must differ from QA_MOBILE_PRODUCT_ID')
})

test('rejects a multi-vendor run that is missing its extra fixtures', () => {
  expect(() =>
    validateMobileMultiVendorEnvironment(smokeEnvironment)
  ).toThrow('QA_MOBILE_SECOND_RESTAURANT_NAME is required')
})

test('builds a multi-vendor invocation that stays read-only', () => {
  const run = buildMobileRun('multi-vendor', multiVendorEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p2')
  expect(run.args).toContain('SECOND_RESTAURANT_NAME=Second Automation Restaurant')
  expect(run.args).toContain('SECOND_PRODUCT_ID=product-999')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.args).not.toContain('FULFILLMENT=pickup')
})
