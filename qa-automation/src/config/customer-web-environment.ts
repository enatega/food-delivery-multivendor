export type CustomerRunMode = 'mock' | 'qa' | 'production-readonly'

export type CustomerWebEnvironmentInput = {
  QA_RUN_MODE?: string
  QA_CUSTOMER_WEB_URL?: string
  QA_ALLOWED_WEB_HOSTNAMES?: string
  QA_LOCALE?: string
  QA_CUSTOMER_LATITUDE?: string
  QA_CUSTOMER_LONGITUDE?: string
  QA_AUTOMATION_STORE_ID?: string
  QA_AUTOMATION_PRODUCT_ID?: string
  QA_AUTOMATION_COUPON?: string
}

export type CustomerWebEnvironment = {
  mode: CustomerRunMode
  baseUrl: string
  locale: string
  latitude: number
  longitude: number
  storeId: string
  productId: string
  coupon: string
}

const localDefaults: CustomerWebEnvironment = {
  mode: 'mock',
  baseUrl: 'http://localhost:3000',
  locale: 'en',
  latitude: 33.6844,
  longitude: 73.0479,
  storeId: 'mock-store',
  productId: 'mock-product',
  coupon: 'PLAYWRIGHT10'
}

function required(input: CustomerWebEnvironmentInput, key: keyof CustomerWebEnvironmentInput) {
  const value = input[key]?.trim()
  if (!value) throw new Error(`${key} is required for QA Customer Web runs`)
  return value
}

function coordinate(value: string, key: string, minimum: number, maximum: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${key} must be between ${minimum} and ${maximum}`)
  }
  return parsed
}

export function validateCustomerWebEnvironment(
  input: CustomerWebEnvironmentInput
): CustomerWebEnvironment {
  const mode = input.QA_RUN_MODE ?? 'mock'
  if (
    mode !== 'mock' &&
    mode !== 'qa' &&
    mode !== 'production-readonly'
  ) {
    throw new Error(
      'QA_RUN_MODE must be "mock", "qa", or "production-readonly"'
    )
  }
  if (mode === 'mock') return localDefaults
  if (mode === 'production-readonly') {
    return { ...localDefaults, mode: 'production-readonly' }
  }

  const rawUrl = required(input, 'QA_CUSTOMER_WEB_URL')
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new Error('QA_CUSTOMER_WEB_URL must be a valid URL')
  }

  const hostname = url.hostname.toLowerCase()
  const localhost = hostname === 'localhost' || hostname === '127.0.0.1'
  if (url.protocol !== 'https:' && !(localhost && url.protocol === 'http:')) {
    throw new Error('QA_CUSTOMER_WEB_URL must use HTTPS except on localhost')
  }
  if (url.username || url.password) {
    throw new Error('QA_CUSTOMER_WEB_URL must not contain credentials')
  }

  const allowedHostnames = new Set(
    required(input, 'QA_ALLOWED_WEB_HOSTNAMES')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  )
  if (!allowedHostnames.has(hostname)) {
    throw new Error('Customer Web hostname is not allowlisted')
  }

  return {
    mode,
    baseUrl: url.origin,
    locale: required(input, 'QA_LOCALE'),
    latitude: coordinate(
      required(input, 'QA_CUSTOMER_LATITUDE'),
      'QA_CUSTOMER_LATITUDE',
      -90,
      90
    ),
    longitude: coordinate(
      required(input, 'QA_CUSTOMER_LONGITUDE'),
      'QA_CUSTOMER_LONGITUDE',
      -180,
      180
    ),
    storeId: required(input, 'QA_AUTOMATION_STORE_ID'),
    productId: required(input, 'QA_AUTOMATION_PRODUCT_ID'),
    coupon: required(input, 'QA_AUTOMATION_COUPON')
  }
}
