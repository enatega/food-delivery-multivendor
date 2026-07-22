import { expect, test } from '@playwright/test'

import { createRunId } from '../../src/run/run-id.js'

test('creates the documented Run ID in Asia/Karachi time', () => {
  const runId = createRunId(
    new Date('2026-07-21T21:00:00.000Z'),
    'abc1234def567890'
  )

  expect(runId).toBe('daily-20260722-0200-abc1234')
})

test('uses a caller-supplied timezone for non-daily local runs', () => {
  const runId = createRunId(
    new Date('2026-07-22T00:15:00.000Z'),
    '1234567abcdef',
    'UTC'
  )

  expect(runId).toBe('daily-20260722-0015-1234567')
})

test('rejects a commit identifier that cannot provide a seven-character SHA', () => {
  expect(() => createRunId(new Date(), 'not-a-sha')).toThrow(
    'commit SHA must contain at least seven hexadecimal characters'
  )
})

test('rejects an invalid timestamp', () => {
  expect(() => createRunId(new Date('invalid'), 'abc1234')).toThrow(
    'run timestamp must be valid'
  )
})
