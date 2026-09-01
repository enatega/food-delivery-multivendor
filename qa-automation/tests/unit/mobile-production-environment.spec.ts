import { expect, test } from '@playwright/test'

import {
  validateMobileProductionEnvironment
} from '../../scripts/mobile-production-environment.js'

const validEnvironment = {
  QA_MOBILE_ENV: 'production',
  QA_MOBILE_ALLOW_PRODUCTION_WRITES: 'true',
  QA_PLACE_REAL_ORDER: 'true',
  QA_MOBILE_GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
  QA_MOBILE_ALLOWED_HOSTNAMES: 'aws-server-v2.enatega.com',
  QA_CUSTOMER_EMAIL: 'maestro-customer@example.test',
  QA_CUSTOMER_PASSWORD: 'not-a-real-secret',
  QA_MOBILE_RESTAURANT_ID: 'restaurant-123',
  QA_MOBILE_RESTAURANT_NAME: 'Automation Restaurant',
  QA_MOBILE_PRODUCT_ID: 'product-456',
  QA_MOBILE_OPTION_ID: 'option-789',
  QA_MOBILE_PRODUCT_NAME: 'Automation Meal',
  QA_MOBILE_CURRENCY: 'USD',
  QA_MAX_ORDER_TOTAL: '25.00',
  QA_MOBILE_FULFILLMENT: 'pickup',
  QA_MOBILE_PAYMENT_METHOD: 'COD',
  QA_RUN_ID: 'mobile-20260827-1200-abc1234'
}

test('accepts an exact, fully opted-in production order environment', () => {
  expect(validateMobileProductionEnvironment(validEnvironment)).toEqual({
    appId: 'com.enatega.multivendor.qa',
    graphqlUrl: 'https://aws-server-v2.enatega.com/graphql',
    hostname: 'aws-server-v2.enatega.com',
    customerEmail: 'maestro-customer@example.test',
    customerPassword: 'not-a-real-secret',
    restaurantId: 'restaurant-123',
    restaurantName: 'Automation Restaurant',
    productId: 'product-456',
    optionId: 'option-789',
    productName: 'Automation Meal',
    currency: 'USD',
    maxOrderTotal: 25,
    fulfillment: 'pickup',
    paymentMethod: 'COD',
    runId: 'mobile-20260827-1200-abc1234'
  })
})

for (const key of [
  'QA_MOBILE_ALLOW_PRODUCTION_WRITES',
  'QA_PLACE_REAL_ORDER'
] as const) {
  test(`rejects production writes unless ${key} is exactly true`, () => {
    expect(() =>
      validateMobileProductionEnvironment({
        ...validEnvironment,
        [key]: 'false'
      })
    ).toThrow(`${key} must be exactly "true"`)
  })
}

test('rejects any environment other than production', () => {
  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_MOBILE_ENV: 'staging'
    })
  ).toThrow('QA_MOBILE_ENV must be exactly "production"')
})

test('rejects a production endpoint that is not exactly allowlisted', () => {
  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_MOBILE_GRAPHQL_URL: 'https://attacker.example/graphql'
    })
  ).toThrow('Mobile production hostname is not allowlisted')
})

test('rejects URL credentials and a non-GraphQL path', () => {
  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_MOBILE_GRAPHQL_URL:
        'https://user:password@aws-server-v2.enatega.com/graphql'
    })
  ).toThrow('QA_MOBILE_GRAPHQL_URL must not contain credentials')

  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_MOBILE_GRAPHQL_URL: 'https://aws-server-v2.enatega.com/'
    })
  ).toThrow('QA_MOBILE_GRAPHQL_URL must target /graphql')
})

test('permits pickup and COD only', () => {
  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_MOBILE_FULFILLMENT: 'delivery'
    })
  ).toThrow('QA_MOBILE_FULFILLMENT must be exactly "pickup"')

  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_MOBILE_PAYMENT_METHOD: 'STRIPE'
    })
  ).toThrow('QA_MOBILE_PAYMENT_METHOD must be exactly "COD"')
})

test('requires a finite positive order ceiling with no default', () => {
  for (const value of ['', '0', '-1', 'NaN', 'Infinity']) {
    expect(() =>
      validateMobileProductionEnvironment({
        ...validEnvironment,
        QA_MAX_ORDER_TOTAL: value
      })
    ).toThrow('QA_MAX_ORDER_TOTAL must be a finite number greater than zero')
  }
})

test('rejects identifiers and Run IDs containing unsafe characters', () => {
  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_MOBILE_PRODUCT_ID: '../../unexpected'
    })
  ).toThrow('QA_MOBILE_PRODUCT_ID contains unsupported characters')

  expect(() =>
    validateMobileProductionEnvironment({
      ...validEnvironment,
      QA_RUN_ID: 'mobile run with spaces'
    })
  ).toThrow('QA_RUN_ID contains unsupported characters')
})
