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
    IS_QA_AUTOMATION_BUILD: true
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

