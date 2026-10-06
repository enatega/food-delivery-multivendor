export type QaEnvironmentInput = {
  QA_ENV?: string
  QA_GRAPHQL_URL?: string
  QA_TENANT_ID?: string
  QA_DATABASE_NAME?: string
  QA_ALLOWED_HOSTNAMES?: string
  QA_ALLOWED_TENANT_IDS?: string
  QA_ALLOWED_DATABASE_NAMES?: string
}

export type QaEnvironment = {
  graphqlUrl: string
  hostname: string
  tenantId: string
  databaseName: string
}

const forbiddenHostnames = new Set([
  'aws-server.enatega.com',
  'aws-server-v2.enatega.com'
])

function requireValue(
  input: QaEnvironmentInput,
  key: keyof QaEnvironmentInput
): string {
  const value = input[key]?.trim()
  if (!value) throw new Error(`${key} is required`)
  return value
}

function parseAllowlist(value: string, normalize = false): Set<string> {
  return new Set(
    value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => (normalize ? entry.toLowerCase() : entry))
  )
}

export function validateQaEnvironment(
  input: QaEnvironmentInput
): QaEnvironment {
  if (input.QA_ENV !== 'true') {
    throw new Error('QA_ENV must be exactly "true"')
  }

  const graphqlUrl = requireValue(input, 'QA_GRAPHQL_URL')
  const tenantId = requireValue(input, 'QA_TENANT_ID')
  const databaseName = requireValue(input, 'QA_DATABASE_NAME')
  const allowedHostnames = parseAllowlist(
    requireValue(input, 'QA_ALLOWED_HOSTNAMES'),
    true
  )
  const allowedTenantIds = parseAllowlist(
    requireValue(input, 'QA_ALLOWED_TENANT_IDS')
  )
  const allowedDatabaseNames = parseAllowlist(
    requireValue(input, 'QA_ALLOWED_DATABASE_NAMES')
  )

  let url: URL
  try {
    url = new URL(graphqlUrl)
  } catch {
    throw new Error('QA_GRAPHQL_URL must be a valid URL')
  }

  const hostname = url.hostname.toLowerCase()
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'

  if (url.protocol !== 'https:' && !(isLocalhost && url.protocol === 'http:')) {
    throw new Error('QA_GRAPHQL_URL must use HTTPS except on localhost')
  }
  if (url.username || url.password) {
    throw new Error('QA_GRAPHQL_URL must not contain credentials')
  }
  if (url.pathname !== '/graphql') {
    throw new Error('QA_GRAPHQL_URL must target the /graphql endpoint')
  }
  if (forbiddenHostnames.has(hostname)) {
    throw new Error(`${hostname} is forbidden for QA automation`)
  }
  if (!allowedHostnames.has(hostname)) {
    throw new Error('QA hostname is not allowlisted')
  }
  if (!allowedTenantIds.has(tenantId)) {
    throw new Error('QA tenant is not allowlisted')
  }
  if (!allowedDatabaseNames.has(databaseName)) {
    throw new Error('QA database is not allowlisted')
  }

  return {
    graphqlUrl: url.toString(),
    hostname,
    tenantId,
    databaseName
  }
}
