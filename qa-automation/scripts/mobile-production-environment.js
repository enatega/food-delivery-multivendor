/* global URL */

const DEFAULT_APP_ID = 'com.enatega.multivendor.qa'
const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/

/**
 * @param {Record<string, string | undefined>} input
 * @param {string} key
 */
function requireValue(input, key) {
  const value = input[key]?.trim()
  if (!value) throw new Error(`${key} is required`)
  return value
}

/**
 * @param {Record<string, string | undefined>} input
 * @param {string} key
 */
function requireSafeIdentifier(input, key) {
  const value = requireValue(input, key)
  if (!SAFE_IDENTIFIER.test(value)) {
    throw new Error(`${key} contains unsupported characters`)
  }
  return value
}

/**
 * Validate the complete boundary for the one intentionally destructive mobile
 * flow. This is deliberately separate from the QA-only environment guard:
 * ordinary QA commands must continue to reject public production hosts.
 *
 * @param {Record<string, string | undefined>} input
 */
export function validateMobileProductionEnvironment(input) {
  if (input.QA_MOBILE_ENV !== 'production') {
    throw new Error('QA_MOBILE_ENV must be exactly "production"')
  }
  for (const key of [
    'QA_MOBILE_ALLOW_PRODUCTION_WRITES',
    'QA_PLACE_REAL_ORDER'
  ]) {
    if (input[key] !== 'true') {
      throw new Error(`${key} must be exactly "true"`)
    }
  }

  const graphqlUrl = requireValue(input, 'QA_MOBILE_GRAPHQL_URL')
  const allowedHostnames = new Set(
    requireValue(input, 'QA_MOBILE_ALLOWED_HOSTNAMES')
      .split(',')
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean)
  )

  let url
  try {
    url = new URL(graphqlUrl)
  } catch {
    throw new Error('QA_MOBILE_GRAPHQL_URL must be a valid URL')
  }

  const hostname = url.hostname.toLowerCase()
  if (url.protocol !== 'https:') {
    throw new Error('QA_MOBILE_GRAPHQL_URL must use HTTPS')
  }
  if (url.username || url.password) {
    throw new Error('QA_MOBILE_GRAPHQL_URL must not contain credentials')
  }
  if (url.pathname !== '/graphql' || url.search || url.hash) {
    throw new Error('QA_MOBILE_GRAPHQL_URL must target /graphql')
  }
  if (!allowedHostnames.has(hostname)) {
    throw new Error('Mobile production hostname is not allowlisted')
  }

  if (input.QA_MOBILE_FULFILLMENT !== 'pickup') {
    throw new Error('QA_MOBILE_FULFILLMENT must be exactly "pickup"')
  }
  if (input.QA_MOBILE_PAYMENT_METHOD !== 'COD') {
    throw new Error('QA_MOBILE_PAYMENT_METHOD must be exactly "COD"')
  }

  const maxOrderTotal = Number(input.QA_MAX_ORDER_TOTAL)
  if (!Number.isFinite(maxOrderTotal) || maxOrderTotal <= 0) {
    throw new Error(
      'QA_MAX_ORDER_TOTAL must be a finite number greater than zero'
    )
  }

  const customerEmail = requireValue(input, 'QA_CUSTOMER_EMAIL')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new Error('QA_CUSTOMER_EMAIL must be a valid email address')
  }

  const currency = requireValue(input, 'QA_MOBILE_CURRENCY')
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error('QA_MOBILE_CURRENCY must be a three-letter uppercase code')
  }

  return {
    appId: input.QA_MOBILE_APP_ID?.trim() || DEFAULT_APP_ID,
    graphqlUrl: url.toString(),
    hostname,
    customerEmail,
    customerPassword: requireValue(input, 'QA_CUSTOMER_PASSWORD'),
    restaurantId: requireSafeIdentifier(input, 'QA_MOBILE_RESTAURANT_ID'),
    restaurantName: requireValue(input, 'QA_MOBILE_RESTAURANT_NAME'),
    productId: requireSafeIdentifier(input, 'QA_MOBILE_PRODUCT_ID'),
    optionId: requireSafeIdentifier(input, 'QA_MOBILE_OPTION_ID'),
    productName: requireValue(input, 'QA_MOBILE_PRODUCT_NAME'),
    currency,
    maxOrderTotal,
    fulfillment: 'pickup',
    paymentMethod: 'COD',
    runId: requireSafeIdentifier(input, 'QA_RUN_ID')
  }
}
