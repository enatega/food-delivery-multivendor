/* global URL */

const DEFAULT_CUSTOMER_APP_ID = 'com.enatega.multivendor.qa'
const DEFAULT_STORE_APP_ID = 'multivendor.enatega.restaurant'
const DEFAULT_RIDER_APP_ID = 'com.enatega.multirider'
const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/
const SIMULATOR_UDID = /^[0-9A-F]{8}(-[0-9A-F]{4}){3}-[0-9A-F]{12}$/i
// The store's preparation-time sheet renders exactly these options
// (enatega-multivendor-store/lib/utils/constants/order.ts). Anything else would
// leave the flow tapping a testID that never renders.
const STORE_PREPARATION_TIMES = [10, 20, 30, 40, 50, 60, 70, 80, 90]
const DEFAULT_PREPARATION_TIME = 20
// A production order has to travel customer -> store -> rider through real
// subscriptions, so the wait for a card to appear is deliberately generous.
const DEFAULT_NEW_ORDER_TIMEOUT = 120000

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
 * The web suite already stores these accounts as QA_STORE_EMAIL /
 * QA_RIDER_EMAIL. Accept either spelling so one credential does not have to be
 * duplicated under two names in .env.mobile.local.
 *
 * @param {Record<string, string | undefined>} input
 * @param {string[]} keys
 */
function firstOf(input, keys) {
  for (const key of keys) {
    const value = input[key]?.trim()
    if (value) return value
  }
  return ''
}

/**
 * The store and rider login screens prefill demo credentials (from
 * EXPO_PUBLIC_*_DEMO_USERNAME, or the __DEV__ fallbacks in their login
 * screens). Typing into a prefilled field concatenates, so a run supplies
 * either BOTH halves of a credential — the flow then clears the field first —
 * or NEITHER, and the flow signs in with whatever the build prefilled.
 *
 * @param {string} app
 * @param {string} username
 * @param {string} password
 */
function resolveCredential(app, username, password) {
  if (Boolean(username) !== Boolean(password)) {
    throw new Error(
      `Set both the ${app} username and password, or neither to use the credentials the app prefills`
    )
  }
  return { username, password, usePrefilled: !username }
}

/**
 * The store and rider simulators run expo-dev-client builds, which cold-start
 * into the Expo dev launcher. The flows tap this URL to get back into the app,
 * so it must match the entry the launcher lists (its own Metro server).
 *
 * @param {Record<string, string | undefined>} input
 * @param {string} key
 * @param {string} fallback
 */
function resolveMetroUrl(input, key, fallback) {
  const value = input[key]?.trim() || fallback
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${key} must be a valid URL`)
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`${key} must be an http(s) URL`)
  }
  // The launcher renders the origin without a trailing slash; the tap is an
  // exact text match, so normalise to that spelling.
  return url.origin
}

/**
 * @param {Record<string, string | undefined>} input
 * @param {string} key
 */
function requireDeviceUdid(input, key) {
  const value = requireValue(input, key)
  if (!SIMULATOR_UDID.test(value)) {
    throw new Error(`${key} must be a simulator UDID`)
  }
  return value
}

/**
 * Validate the boundary for the three-app end-to-end run.
 *
 * This is a superset of validateMobileProductionEnvironment: same production
 * guards, plus store and rider credentials, plus one deliberate difference —
 * the order must be DELIVERY. A pickup order is never offered to a rider, so
 * the rider stage of this suite can only work against a delivery order.
 *
 * Unlike the customer-only production flow, nothing here cancels the order: it
 * runs through to DELIVERED, which is why every guard below is required rather
 * than defaulted.
 *
 * @param {Record<string, string | undefined>} input
 */
export function validateMobileE2eEnvironment(input) {
  if (input.QA_MOBILE_ENV !== 'production') {
    throw new Error('QA_MOBILE_ENV must be exactly "production"')
  }
  for (const key of [
    'QA_MOBILE_ALLOW_PRODUCTION_WRITES',
    'QA_PLACE_REAL_ORDER',
    'QA_E2E_COMPLETE_REAL_ORDER'
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

  if (input.QA_MOBILE_FULFILLMENT !== 'delivery') {
    throw new Error(
      'QA_MOBILE_FULFILLMENT must be exactly "delivery" for the E2E: a pickup order never reaches the rider app'
    )
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

  const preparationTime = input.QA_STORE_PREPARATION_TIME?.trim()
    ? Number(input.QA_STORE_PREPARATION_TIME)
    : DEFAULT_PREPARATION_TIME
  if (!STORE_PREPARATION_TIMES.includes(preparationTime)) {
    throw new Error(
      `QA_STORE_PREPARATION_TIME must be one of ${STORE_PREPARATION_TIMES.join(', ')}`
    )
  }

  const newOrderTimeout = input.QA_E2E_NEW_ORDER_TIMEOUT?.trim()
    ? Number(input.QA_E2E_NEW_ORDER_TIMEOUT)
    : DEFAULT_NEW_ORDER_TIMEOUT
  if (!Number.isInteger(newOrderTimeout) || newOrderTimeout <= 0) {
    throw new Error(
      'QA_E2E_NEW_ORDER_TIMEOUT must be a whole number of milliseconds greater than zero'
    )
  }

  // Three apps, three simulators. The UDIDs are required rather than inferred:
  // picking "the booted one" would be ambiguous with four simulators running,
  // and a mis-targeted store run would accept somebody else's order.
  const customerDevice = requireDeviceUdid(input, 'QA_CUSTOMER_DEVICE_UDID')
  const storeDevice = requireDeviceUdid(input, 'QA_STORE_DEVICE_UDID')
  const riderDevice = requireDeviceUdid(input, 'QA_RIDER_DEVICE_UDID')
  const devices = new Set([customerDevice, storeDevice, riderDevice])
  if (devices.size !== 3) {
    throw new Error(
      'QA_CUSTOMER_DEVICE_UDID, QA_STORE_DEVICE_UDID and QA_RIDER_DEVICE_UDID must be three different simulators'
    )
  }

  return {
    customerAppId: input.QA_MOBILE_APP_ID?.trim() || DEFAULT_CUSTOMER_APP_ID,
    storeAppId: input.QA_STORE_APP_ID?.trim() || DEFAULT_STORE_APP_ID,
    riderAppId: input.QA_RIDER_APP_ID?.trim() || DEFAULT_RIDER_APP_ID,
    customerDevice,
    storeDevice,
    riderDevice,
    // Only used when QA_MOBILE_APP_ID is a dev-client build; a release build
    // never shows the dev launcher, so the customer flow skips the reconnect.
    customerMetroUrl: resolveMetroUrl(
      input,
      'QA_CUSTOMER_METRO_URL',
      'http://localhost:8083'
    ),
    storeMetroUrl: resolveMetroUrl(
      input,
      'QA_STORE_METRO_URL',
      'http://localhost:8081'
    ),
    riderMetroUrl: resolveMetroUrl(
      input,
      'QA_RIDER_METRO_URL',
      'http://localhost:8082'
    ),
    graphqlUrl: url.toString(),
    hostname,
    customerEmail,
    customerPassword: requireValue(input, 'QA_CUSTOMER_PASSWORD'),
    store: resolveCredential(
      'store',
      firstOf(input, ['QA_STORE_USERNAME', 'QA_STORE_EMAIL']),
      firstOf(input, ['QA_STORE_PASSWORD'])
    ),
    rider: resolveCredential(
      'rider',
      firstOf(input, ['QA_RIDER_USERNAME', 'QA_RIDER_EMAIL']),
      firstOf(input, ['QA_RIDER_PASSWORD'])
    ),
    restaurantName: requireValue(input, 'QA_MOBILE_RESTAURANT_NAME'),
    productId: requireSafeIdentifier(input, 'QA_MOBILE_PRODUCT_ID'),
    optionId: requireSafeIdentifier(input, 'QA_MOBILE_OPTION_ID'),
    productName: requireValue(input, 'QA_MOBILE_PRODUCT_NAME'),
    currency,
    maxOrderTotal,
    preparationTime,
    newOrderTimeout,
    fulfillment: 'delivery',
    paymentMethod: 'COD',
    runId: requireSafeIdentifier(input, 'QA_RUN_ID')
  }
}

export {
  DEFAULT_CUSTOMER_APP_ID,
  DEFAULT_STORE_APP_ID,
  DEFAULT_RIDER_APP_ID,
  STORE_PREPARATION_TIMES
}
