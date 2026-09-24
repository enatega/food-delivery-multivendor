import { expect, test } from '@playwright/test'

import { loadQaEnvironment } from '../../src/config/load-qa-environment.js'

test('local QA target passes every mutation safety guard', () => {
  const environment = loadQaEnvironment()

  expect(environment.hostname).toBe('127.0.0.1')
  expect(environment.tenantId).toBe('AUTOMATION_LOCAL')
  expect(environment.databaseName).toBe('enatega_qa_local')
})
