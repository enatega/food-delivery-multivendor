export type GraphqlRequestBody = {
  operationName?: string
  query?: string
}

export type GraphqlInspection = {
  allowed: boolean
  operationName: string
  type: 'query' | 'mutation' | 'subscription' | 'unknown'
}

const allowedMutations = new Set(['MetricsGeneral'])

export function inspectGraphqlRequest(body: unknown): GraphqlInspection {
  if (!body || Array.isArray(body) || typeof body !== 'object') {
    return { allowed: false, operationName: 'Unknown', type: 'unknown' }
  }

  const request = body as GraphqlRequestBody
  const query = request.query?.trim() ?? ''
  const declaration = query.match(
    /(?:^|\s)(query|mutation|subscription)\s+([A-Za-z_][A-Za-z0-9_]*)/
  )

  if (!declaration && query.startsWith('{')) {
    return {
      allowed: true,
      operationName: 'AnonymousQuery',
      type: 'query'
    }
  }

  const type =
    declaration?.[1] === 'query' ||
    declaration?.[1] === 'mutation' ||
    declaration?.[1] === 'subscription'
      ? declaration[1]
      : 'unknown'
  const operationName =
    request.operationName ?? declaration?.[2] ?? 'Unknown'
  const allowed =
    type === 'query' ||
    (type === 'mutation' && allowedMutations.has(operationName))

  return { allowed, operationName, type }
}
