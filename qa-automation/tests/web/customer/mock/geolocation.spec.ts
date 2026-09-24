import { expect, test } from '@playwright/test'

import { openCustomerWeb } from '../support/customer-web.js'
import { mockGraphql } from '../support/mock-graphql.js'

test('CW-P1-007 grants current location without a browser permission prompt', async ({
  page
}) => {
  await mockGraphql(page)
  await openCustomerWeb(page)

  const location = await page.evaluate(async () => {
    const permission = await navigator.permissions.query({
      name: 'geolocation'
    })
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 2_000
        })
      }
    )

    return {
      permission: permission.state,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
  })

  expect(location).toEqual({
    permission: 'granted',
    latitude: 33.6844,
    longitude: 73.0479
  })
})
