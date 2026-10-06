import { expect, test } from '@playwright/test'

import { createCustomerOnlyAuthState } from '../../src/auth/customer-auth-state.js'

test('keeps only Customer Web local storage and removes all browser cookies', () => {
  const state = createCustomerOnlyAuthState(
    {
      cookies: [
        {
          name: 'google-session',
          value: 'secret',
          domain: '.google.com',
          path: '/',
          expires: -1,
          httpOnly: true,
          secure: true,
          sameSite: 'Lax'
        }
      ],
      origins: [
        {
          origin: 'http://127.0.0.1:3000',
          localStorage: [{ name: 'token', value: 'customer-token' }]
        },
        {
          origin: 'https://accounts.google.com',
          localStorage: [{ name: 'google-session', value: 'secret' }]
        }
      ]
    },
    'http://127.0.0.1:3000'
  )

  expect(state.cookies).toEqual([])
  expect(state.origins).toEqual([
    {
      origin: 'http://127.0.0.1:3000',
      localStorage: [{ name: 'token', value: 'customer-token' }]
    }
  ])
})
