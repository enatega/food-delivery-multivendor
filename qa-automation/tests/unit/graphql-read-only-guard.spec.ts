import { expect, test } from '@playwright/test'

import {
  inspectGraphqlRequest,
  type GraphqlRequestBody
} from '../../src/safety/graphql-read-only-guard.js'

test('allows named and anonymous GraphQL queries', () => {
  expect(
    inspectGraphqlRequest({
      operationName: 'Restaurants',
      query: 'query Restaurants { restaurants { _id } }'
    })
  ).toEqual({ allowed: true, operationName: 'Restaurants', type: 'query' })

  expect(
    inspectGraphqlRequest({ query: '{ configuration { currency } }' })
  ).toEqual({
    allowed: true,
    operationName: 'AnonymousQuery',
    type: 'query'
  })

  expect(
    inspectGraphqlRequest({
      operationName: 'Restaurants',
      query:
        'fragment RestaurantFields on Restaurant { _id } query Restaurants { restaurants { ...RestaurantFields } }'
    })
  ).toEqual({ allowed: true, operationName: 'Restaurants', type: 'query' })
})

test('allows only the non-business MetricsGeneral mutation', () => {
  expect(
    inspectGraphqlRequest({
      query: 'mutation MetricsGeneral { metricsGeneral { experience } }'
    })
  ).toEqual({
    allowed: true,
    operationName: 'MetricsGeneral',
    type: 'mutation'
  })
})

test('blocks customer data and order mutations', () => {
  for (const operationName of [
    'Login',
    'CreateAddress',
    'Coupon',
    'PlaceOrder',
    'ReviewOrder'
  ]) {
    const body: GraphqlRequestBody = {
      operationName,
      query: `mutation ${operationName} { result }`
    }
    expect(inspectGraphqlRequest(body)).toEqual({
      allowed: false,
      operationName,
      type: 'mutation'
    })
  }
})

test('fails closed for subscriptions, malformed bodies, and batched requests', () => {
  expect(
    inspectGraphqlRequest({
      query: 'subscription OrderStatus { orderStatusChanged { _id } }'
    }).allowed
  ).toBe(false)
  expect(inspectGraphqlRequest({}).allowed).toBe(false)
  expect(inspectGraphqlRequest([]).allowed).toBe(false)
})
