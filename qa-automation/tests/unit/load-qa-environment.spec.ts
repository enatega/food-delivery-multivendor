import { expect, test } from '@playwright/test'

import { loadQaEnvironment } from '../../src/config/load-qa-environment.js'

test('loads and validates a localhost-only environment file', () => {
  const environment = loadQaEnvironment('tests/fixtures/local.env')

  expect(environment).toEqual({
    graphqlUrl: 'http://127.0.0.1:4000/graphql',
    hostname: '127.0.0.1',
    tenantId: 'AUTOMATION_LOCAL',
    databaseName: 'enatega_qa_local'
  })
})

test('fails closed when the environment file does not exist', () => {
  expect(() => loadQaEnvironment('tests/fixtures/missing.env')).toThrow(
    'Unable to load QA environment file'
  )
})
