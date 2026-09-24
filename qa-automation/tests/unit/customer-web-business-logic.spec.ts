import { expect, test } from '@playwright/test'

import * as restaurantModule from '../../../enatega-multivendor-web/lib/utils/constants/isRestaurantOpen.js'
import * as rtlModule from '../../../enatega-multivendor-web/lib/utils/rtlLanguage.js'
import * as authModule from '../../../enatega-multivendor-web/lib/utils/methods/auth.js'
import * as initialsModule from '../../../enatega-multivendor-web/lib/utils/methods/initials.js'
import * as orderModule from '../../../enatega-multivendor-web/lib/utils/methods/order.js'
import * as slugModule from '../../../enatega-multivendor-web/lib/utils/methods/to-slug.js'

const moduleExports = <T>(moduleNamespace: unknown): T => {
  if (
    typeof moduleNamespace === 'object' &&
    moduleNamespace !== null &&
    'default' in moduleNamespace
  ) {
    return (moduleNamespace as { default: T }).default
  }

  return moduleNamespace as T
}

const { isRestaurantOpen } =
  moduleExports<typeof restaurantModule>(restaurantModule)
const { isRtl } = moduleExports<typeof rtlModule>(rtlModule)
const { isTokenExpired } = moduleExports<typeof authModule>(authModule)
const { getInitials } = moduleExports<typeof initialsModule>(initialsModule)
const { calculateAmount, calculateDistance } =
  moduleExports<typeof orderModule>(orderModule)
const { toSlug } = moduleExports<typeof slugModule>(slugModule)

const currentDay = () =>
  new Date().toLocaleString('en-US', { weekday: 'short' }).toUpperCase()

test('calculates zero distance for identical coordinates', () => {
  expect(calculateDistance(33.6844, 73.0479, 33.6844, 73.0479)).toBe(0)
})

test('calculates a known great-circle distance', () => {
  expect(calculateDistance(0, 0, 0, 1)).toBeCloseTo(111.195, 3)
})

test('calculates the same distance in either direction', () => {
  const outbound = calculateDistance(33.6844, 73.0479, 33.7023, 72.9821)
  const inbound = calculateDistance(33.7023, 72.9821, 33.6844, 73.0479)

  expect(outbound).toBeCloseTo(inbound, 10)
})

test('uses the configured fixed delivery amount regardless of distance', () => {
  expect(calculateAmount('fixed', 149, 7.8)).toBe(149)
})

test('rounds distance up before calculating a per-kilometre amount', () => {
  expect(calculateAmount('per_km', 50, 2.01)).toBe(150)
})

test('opens a restaurant during an all-day string-based schedule', () => {
  expect(
    isRestaurantOpen({
      isActive: true,
      isAvailable: true,
      openingTimes: [
        {
          day: currentDay(),
          times: [{ startTime: '00:00', endTime: '23:59' }]
        }
      ]
    })
  ).toBe(true)
})

test('accepts an opening-times array with array-based clock values', () => {
  expect(
    isRestaurantOpen([
      {
        day: currentDay(),
        times: [{ startTime: ['00', '00'], endTime: ['23', '59'] }]
      }
    ])
  ).toBe(true)
})

test('keeps an unavailable restaurant closed during scheduled hours', () => {
  expect(
    isRestaurantOpen({
      isAvailable: false,
      openingTimes: [
        {
          day: currentDay(),
          times: [{ startTime: '00:00', endTime: '23:59' }]
        }
      ]
    })
  ).toBe(false)
})

test('keeps an inactive restaurant closed during scheduled hours', () => {
  expect(
    isRestaurantOpen({
      isActive: false,
      openingTimes: [
        {
          day: currentDay(),
          times: [{ startTime: '00:00', endTime: '23:59' }]
        }
      ]
    })
  ).toBe(false)
})

test('keeps a restaurant closed when no schedule is available', () => {
  expect(isRestaurantOpen({ isActive: true, openingTimes: [] })).toBe(false)
})

test('ignores malformed restaurant opening times safely', () => {
  expect(
    isRestaurantOpen([
      {
        day: currentDay(),
        times: [{ startTime: 'invalid', endTime: '23:59' }]
      }
    ])
  ).toBe(false)
})

test('creates a lowercase slug and collapses whitespace', () => {
  expect(toSlug('Fresh   Food Islamabad')).toBe('fresh-food-islamabad')
})

test('creates an empty slug from an empty input', () => {
  expect(toSlug('')).toBe('')
})

test('creates initials from the first two words of a name', () => {
  expect(getInitials('Najam Abbas')).toBe('NA')
})

test('creates one initial from a single name', () => {
  expect(getInitials('Tayyaba')).toBe('T')
})

test('creates no initials from missing or blank names', () => {
  expect(getInitials(null)).toBe('')
  expect(getInitials(undefined)).toBe('')
  expect(getInitials('   ')).toBe('')
})

test('recognizes supported right-to-left languages', () => {
  expect(isRtl('ar')).toBe(true)
  expect(isRtl('ur')).toBe(true)
  expect(isRtl('fa')).toBe(true)
  expect(isRtl('he')).toBe(true)
})

test('does not mark left-to-right languages as right-to-left', () => {
  expect(isRtl('en')).toBe(false)
  expect(isRtl('hr')).toBe(false)
})

test('recognizes expired and active Unix-second token expirations', () => {
  expect(isTokenExpired(Math.floor(Date.now() / 1000) - 60)).toBe(true)
  expect(isTokenExpired(Math.floor(Date.now() / 1000) + 60)).toBe(false)
})

test('recognizes expired and active millisecond token expirations', () => {
  expect(isTokenExpired(Date.now() - 60_000)).toBe(true)
  expect(isTokenExpired(Date.now() + 60_000)).toBe(false)
})

test('recognizes ISO date token expirations', () => {
  expect(isTokenExpired(new Date(Date.now() - 60_000).toISOString())).toBe(true)
  expect(isTokenExpired(new Date(Date.now() + 60_000).toISOString())).toBe(false)
})

test('treats absent or malformed token expirations as non-expiring', () => {
  expect(isTokenExpired()).toBe(false)
  expect(isTokenExpired(null)).toBe(false)
  expect(isTokenExpired('not-a-date')).toBe(false)
})
