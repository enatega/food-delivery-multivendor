import { expect, type APIRequestContext } from '@playwright/test'

export type GraphqlResult<T> = {
  data?: T
  errors?: Array<{ message?: string }>
}

export type GraphqlOperation = {
  operationName: string
  query: string
  variables?: Record<string, unknown>
}

export type ReadOnlyGraphqlClient = <T>(
  operation: GraphqlOperation
) => Promise<T>

// Customer Web coordinates. Matches the deterministic production fixtures used
// by the read-only smoke tests. Overridable through the QA environment.
export const customerLatitude = Number(
  process.env.QA_CUSTOMER_LATITUDE ?? '33.6844'
)
export const customerLongitude = Number(
  process.env.QA_CUSTOMER_LONGITUDE ?? '73.0479'
)

function readOnlyGraphqlUrl(): string {
  const url = process.env.QA_READ_ONLY_GRAPHQL_URL
  if (!url) throw new Error('QA_READ_ONLY_GRAPHQL_URL is required')
  return url
}

/**
 * Builds a read-only GraphQL client that mirrors the Customer Web bootstrap:
 * the `MetricsGeneral` mutation issues the short-lived read token that every
 * subsequent query must present through the `bop-auth` header. The returned
 * function only issues queries, so it can never mutate business data.
 */
export async function createReadOnlyGraphqlClient(
  request: APIRequestContext
): Promise<ReadOnlyGraphqlClient> {
  const url = readOnlyGraphqlUrl()
  const nonce = `playwright-readonly-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`

  const metricsResponse = await request.post(url, {
    headers: { nonce, 'Content-Type': 'application/json' },
    data: {
      query: 'mutation MetricsGeneral { metricsGeneral { experience hehe } }'
    }
  })
  expect(
    metricsResponse.ok(),
    `MetricsGeneral returned HTTP ${metricsResponse.status()}`
  ).toBeTruthy()

  const metricsBody = (await metricsResponse.json()) as GraphqlResult<{
    metricsGeneral?: { experience?: string }
  }>
  const token = metricsBody.data?.metricsGeneral?.experience
  expect(token, 'MetricsGeneral must return a read token').toBeTruthy()

  return async function post<T>(operation: GraphqlOperation): Promise<T> {
    const response = await request.post(url, {
      headers: {
        nonce,
        'bop-auth': `Bearer ${token}`,
        'X-Client-Type': 'web',
        'Content-Type': 'application/json'
      },
      data: operation
    })
    const text = await response.text()
    expect(
      response.ok(),
      `${operation.operationName} returned HTTP ${response.status()}: ${text}`
    ).toBeTruthy()

    const body = JSON.parse(text) as GraphqlResult<T>
    expect(
      body.errors ?? [],
      `${operation.operationName} returned GraphQL errors`
    ).toEqual([])
    expect(body.data, `${operation.operationName} returned no data`).toBeTruthy()
    return body.data as T
  }
}
