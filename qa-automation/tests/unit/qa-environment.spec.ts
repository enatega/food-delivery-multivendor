import { expect, test } from '@playwright/test'

import {
  type QaEnvironmentInput,
  validateQaEnvironment
} from '../../src/config/qa-environment.js'

const validEnvironment: QaEnvironmentInput = {
  QA_ENV: 'true',
  QA_GRAPHQL_URL: 'https://api.qa.enatega.test/graphql',
  QA_TENANT_ID: 'AUTOMATION_DAILY',
  QA_DATABASE_NAME: 'enatega_qa',
  QA_ALLOWED_HOSTNAMES: 'api.qa.enatega.test',
  QA_ALLOWED_TENANT_IDS: 'AUTOMATION_DAILY',
  QA_ALLOWED_DATABASE_NAMES: 'enatega_qa'
}

test('accepts an exact dedicated QA environment allowlist match', () => {
  expect(validateQaEnvironment(validEnvironment)).toEqual({
    graphqlUrl: 'https://api.qa.enatega.test/graphql',
    hostname: 'api.qa.enatega.test',
    tenantId: 'AUTOMATION_DAILY',
    databaseName: 'enatega_qa'
  })
})

test('rejects a run unless QA_ENV is explicitly true', () => {
  expect(() =>
    validateQaEnvironment({ ...validEnvironment, QA_ENV: 'false' })
  ).toThrow('QA_ENV must be exactly "true"')
})

test('rejects the currently configured public Enatega endpoint even if allowlisted', () => {
  expect(() =>
    validateQaEnvironment({
      ...validEnvironment,
      QA_GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
      QA_ALLOWED_HOSTNAMES: 'aws-server-v2.enatega.com'
    })
  ).toThrow('is forbidden for QA automation')
})

test('rejects a hostname that is not an exact allowlist member', () => {
  expect(() =>
    validateQaEnvironment({
      ...validEnvironment,
      QA_GRAPHQL_URL: 'https://other.qa.enatega.test/graphql'
    })
  ).toThrow('QA hostname is not allowlisted')
})

test('rejects a tenant or database that is not an exact allowlist member', () => {
  expect(() =>
    validateQaEnvironment({
      ...validEnvironment,
      QA_TENANT_ID: 'OTHER_TENANT',
      QA_DATABASE_NAME: 'other_database'
    })
  ).toThrow('QA tenant is not allowlisted')
})
