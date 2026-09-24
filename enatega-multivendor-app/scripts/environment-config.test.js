const assert = require('node:assert/strict')
const test = require('node:test')

const {
  getEnvironmentConfig,
  normalizeEnvironment
} = require('../environment.config')
const { getAppVariantConfig } = require('../app-variant.config')

test('requires an explicit supported mobile environment', () => {
  assert.throws(() => normalizeEnvironment(undefined), /is required/)
  assert.throws(() => normalizeEnvironment('preview'), /Unsupported mobile/)
})

test('defines the intentionally production-backed QA automation environment', () => {
  assert.deepEqual(getEnvironmentConfig('qa-production'), {
    GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
    WS_GRAPHQL_URL: 'wss://aws-server-v2.enatega.com/graphql',
    SERVER_URL: 'https://aws-server-v2.enatega.com/graphql',
    SERVER_REST_URL: 'https://aws-server-v2.enatega.com/',
    CLARITY_ENABLED: false,
    IS_QA_AUTOMATION_BUILD: true,
    PUBLIC_ACCESS_REQUIRED: true,
    SINGLE_VENDOR_ENABLED: getEnvironmentConfig('qa-production', 'SINGLE').SINGLE_VENDOR_ENABLED
  })
})

test('uses a distinct app identity for the production QA simulator build', () => {
  assert.deepEqual(getAppVariantConfig('qa-production'), {
    name: 'Enatega QA • PROD',
    bundleIdentifier: 'com.enatega.multivendor.qa',
    packageName: 'com.enatega.multivendor.qa',
    scheme: 'enategamultivendorqa'
  })
})

test('keeps the normal identity for non-QA builds', () => {
  assert.deepEqual(getAppVariantConfig('production'), {
    name: 'Enatega Multi',
    bundleIdentifier: 'com.enatega.multivendor',
    packageName: 'com.enatega.multivendor',
    scheme: 'enategamultivendor'
  })
})

test('wires the QA identity into the Expo build configuration', () => {
  const previous = process.env.EXPO_PUBLIC_APP_ENV
  process.env.EXPO_PUBLIC_APP_ENV = 'qa-production'
  try {
    const config = require('../app.config')()
    assert.equal(config.name, 'Enatega QA • PROD')
    assert.equal(config.scheme, 'enategamultivendorqa')
    assert.equal(config.ios.bundleIdentifier, 'com.enatega.multivendor.qa')
    assert.equal(config.android.package, 'com.enatega.multivendor.qa')
  } finally {
    if (previous === undefined) delete process.env.EXPO_PUBLIC_APP_ENV
    else process.env.EXPO_PUBLIC_APP_ENV = previous
  }
})
