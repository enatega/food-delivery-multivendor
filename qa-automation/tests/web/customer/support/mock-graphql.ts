import type { Page, Request } from '@playwright/test'

type GraphqlBody = {
  operationName?: string
  query?: string
  variables?: Record<string, unknown>
}

type GraphqlResponse = {
  data?: Record<string, unknown>
  errors?: Array<{ message: string }>
}

export type GraphqlHandler = (
  body: GraphqlBody,
  request: Request
) => GraphqlResponse | Promise<GraphqlResponse>

export type MockGraphql = {
  operations: GraphqlBody[]
  unhandledOperations: string[]
}

const configuration = {
  _id: 'mock-configuration',
  currency: 'USD',
  currencySymbol: '$',
  deliveryRate: 1,
  twilioEnabled: false,
  webClientID: '',
  googleMapLibraries: 'places,drawing,geometry',
  googleColor: '#94e469',
  publishableKey: '',
  clientId: '',
  skipEmailVerification: true,
  skipMobileVerification: true,
  costType: 'fixed'
}

const defaultHandlers: Record<string, GraphqlHandler> = {
  Configuration: () => ({ data: { configuration } }),
  MetricsGeneral: () => ({ data: { metrics: 'mock-metrics-token' } })
}

export async function mockGraphql(
  page: Page,
  overrides: Record<string, GraphqlHandler> = {}
): Promise<MockGraphql> {
  const operations: GraphqlBody[] = []
  const unhandledOperations: string[] = []
  const handlers = { ...defaultHandlers, ...overrides }

  await page.route('**/__qa-api/graphql', async (route) => {
    let body: GraphqlBody = {}
    try {
      body = route.request().postDataJSON() as GraphqlBody
    } catch {
      // Apollo sends GraphQL requests as JSON in Customer Web.
    }

    operations.push(body)
    const operationName =
      body.operationName ??
      body.query?.match(/(?:query|mutation)\s+([A-Za-z0-9_]+)/)?.[1] ??
      'UnknownOperation'
    const handler = handlers[operationName]
    if (!handler) unhandledOperations.push(operationName)

    const response = handler
      ? await handler(body, route.request())
      : { data: {} }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response)
    })
  })

  return { operations, unhandledOperations }
}
