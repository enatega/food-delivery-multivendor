import { expect, test } from '@playwright/test'

import {
  type CustomerWebEnvironmentInput,
  validateCustomerWebEnvironment
} from '../../src/config/customer-web-environment.js'

const qaInput: CustomerWebEnvironmentInput = {
  QA_RUN_MODE: 'qa',
  QA_CUSTOMER_WEB_URL: 'https://customer.qa.enatega.test',
  QA_ALLOWED_WEB_HOSTNAMES: 'customer.qa.enatega.test',
  QA_LOCALE: 'en',
  QA_CUSTOMER_LATITUDE: '33.6844',
  QA_CUSTOMER_LONGITUDE: '73.0479',
  QA_AUTOMATION_STORE_ID: 'store-qa-1',
  QA_AUTOMATION_PRODUCT_ID: 'product-qa-1',
  QA_AUTOMATION_COUPON: 'PLAYWRIGHT10'
}

test('uses safe deterministic defaults for local mocked runs', () => {
  expect(validateCustomerWebEnvironment({ QA_RUN_MODE: 'mock' })).toEqual({
    mode: 'mock',
    baseUrl: 'http://localhost:3000',
    locale: 'en',
    latitude: 33.6844,
    longitude: 73.0479,
    storeId: 'mock-store',
    productId: 'mock-product',
    coupon: 'PLAYWRIGHT10'
  })
})

test('uses a distinct local mode for production read-only runs', () => {
  expect(
    validateCustomerWebEnvironment({ QA_RUN_MODE: 'production-readonly' })
  ).toEqual({
    mode: 'production-readonly',
    baseUrl: 'http://localhost:3000',
    locale: 'en',
    latitude: 33.6844,
    longitude: 73.0479,
    storeId: 'mock-store',
    productId: 'mock-product',
    coupon: 'PLAYWRIGHT10'
  })
})

test('accepts an allowlisted HTTPS Customer Web QA target', () => {
  expect(validateCustomerWebEnvironment(qaInput)).toEqual({
    mode: 'qa',
    baseUrl: 'https://customer.qa.enatega.test',
    locale: 'en',
    latitude: 33.6844,
    longitude: 73.0479,
    storeId: 'store-qa-1',
    productId: 'product-qa-1',
    coupon: 'PLAYWRIGHT10'
  })
})

test('rejects a non-allowlisted Customer Web QA hostname', () => {
  expect(() =>
    validateCustomerWebEnvironment({
      ...qaInput,
      QA_CUSTOMER_WEB_URL: 'https://customer.other.test'
    })
  ).toThrow('Customer Web hostname is not allowlisted')
})

test('rejects insecure non-local Customer Web targets', () => {
  expect(() =>
    validateCustomerWebEnvironment({
      ...qaInput,
      QA_CUSTOMER_WEB_URL: 'http://customer.qa.enatega.test'
    })
  ).toThrow('QA_CUSTOMER_WEB_URL must use HTTPS except on localhost')
})

test('rejects invalid coordinates and unsupported run modes', () => {
  expect(() =>
    validateCustomerWebEnvironment({
      ...qaInput,
      QA_CUSTOMER_LATITUDE: '91'
    })
  ).toThrow('QA_CUSTOMER_LATITUDE must be between -90 and 90')

  expect(() =>
    validateCustomerWebEnvironment({ QA_RUN_MODE: 'production' })
  ).toThrow(
    'QA_RUN_MODE must be "mock", "qa", or "production-readonly"'
  )
})
