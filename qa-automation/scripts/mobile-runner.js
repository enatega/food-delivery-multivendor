/* global URL, console, process */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

import { config as loadDotenv } from 'dotenv'

import { validateMobileProductionEnvironment } from './mobile-production-environment.js'

const DEFAULT_APP_ID = 'com.enatega.multivendor.qa'
const PRODUCTION_FLOW = 'maestro/customer/flows/p0-production-order.yaml'
const SMOKE_FLOW = 'maestro/customer/flows/p0-smoke.yaml'
// A directory: Maestro runs every P1 flow inside it. All are read-only and
// reuse the smoke environment, so they need no write guards.
const REGRESSION_FLOW = 'maestro/customer/flows/p1'
// Also read-only, but the flows inside need a second allowlisted restaurant and
// product, so they are opt-in rather than part of the default regression run.
const MULTI_VENDOR_FLOW = 'maestro/customer/flows/p2'
// Navigation-graph regression. Read-only and fixture-compatible with the smoke,
// so it needs no extra variables and no write guards.
const NAVIGATION_FLOW = 'maestro/customer/flows/p3'
const SAFE_PATH_COMPONENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
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
 */
export function validateMobileSmokeEnvironment(input) {
  if (input.QA_MOBILE_ENV !== 'production') {
    throw new Error('QA_MOBILE_ENV must be exactly "production"')
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
  if (url.protocol !== 'https:') {
    throw new Error('QA_MOBILE_GRAPHQL_URL must use HTTPS')
  }
  if (url.username || url.password) {
    throw new Error('QA_MOBILE_GRAPHQL_URL must not contain credentials')
  }
  if (url.pathname !== '/graphql' || url.search || url.hash) {
    throw new Error('QA_MOBILE_GRAPHQL_URL must target /graphql')
  }
  if (!allowedHostnames.has(url.hostname.toLowerCase())) {
    throw new Error('Mobile production hostname is not allowlisted')
  }

  const maxOrderTotal = Number(input.QA_MAX_ORDER_TOTAL)
  if (!Number.isFinite(maxOrderTotal) || maxOrderTotal <= 0) {
    throw new Error(
      'QA_MAX_ORDER_TOTAL must be a finite number greater than zero'
    )
  }

  const currency = requireValue(input, 'QA_MOBILE_CURRENCY')
  if (!/^[A-Z]{3}$/.test(currency)) {
    throw new Error('QA_MOBILE_CURRENCY must be a three-letter uppercase code')
  }

  return {
    appId: input.QA_MOBILE_APP_ID?.trim() || DEFAULT_APP_ID,
    graphqlUrl: url.toString(),
    customerEmail: requireValue(input, 'QA_CUSTOMER_EMAIL'),
    customerPassword: requireValue(input, 'QA_CUSTOMER_PASSWORD'),
    restaurantName: requireValue(input, 'QA_MOBILE_RESTAURANT_NAME'),
    productName: requireValue(input, 'QA_MOBILE_PRODUCT_NAME'),
    productId: requireValue(input, 'QA_MOBILE_PRODUCT_ID'),
    optionId: requireValue(input, 'QA_MOBILE_OPTION_ID'),
    currency,
    maxOrderTotal
  }
}

/**
 * The multi-vendor flows need a second allowlisted restaurant and product on top
 * of the read-only smoke environment. They stay read-only, so this adds fixture
 * requirements only and no write guards.
 *
 * @param {Record<string, string | undefined>} input
 */
export function validateMobileMultiVendorEnvironment(input) {
  const base = validateMobileSmokeEnvironment(input)
  const secondRestaurantName = requireValue(
    input,
    'QA_MOBILE_SECOND_RESTAURANT_NAME'
  )
  const secondProductId = requireValue(input, 'QA_MOBILE_SECOND_PRODUCT_ID')
  if (!SAFE_IDENTIFIER.test(secondProductId)) {
    throw new Error('QA_MOBILE_SECOND_PRODUCT_ID contains unsupported characters')
  }
  // A single-vendor cart is only exercised by two genuinely different vendors.
  if (
    secondRestaurantName.trim().toLowerCase() ===
    base.restaurantName.trim().toLowerCase()
  ) {
    throw new Error(
      'QA_MOBILE_SECOND_RESTAURANT_NAME must differ from QA_MOBILE_RESTAURANT_NAME'
    )
  }
  if (secondProductId === base.productId) {
    throw new Error(
      'QA_MOBILE_SECOND_PRODUCT_ID must differ from QA_MOBILE_PRODUCT_ID'
    )
  }

  return { ...base, secondRestaurantName, secondProductId }
}

/**
 * @param {'smoke' | 'production-order' | 'regression' | 'multi-vendor' | 'navigation'} mode
 * @param {Record<string, string | undefined>} input
 * @param {string} reportRunId
 */
export function buildMobileRun(mode, input, reportRunId) {
  if (!SAFE_PATH_COMPONENT.test(reportRunId)) {
    throw new Error('report Run ID contains unsupported characters')
  }

  const isProductionOrder = mode === 'production-order'
  const reportDirectory = `reports/maestro/${reportRunId}`
  let flow
  /** @type {Record<string, string>} */
  let values
  if (isProductionOrder) {
    const environment = validateMobileProductionEnvironment(input)
    flow = PRODUCTION_FLOW
    values = {
      APP_ID: environment.appId,
      CUSTOMER_EMAIL: environment.customerEmail,
      CUSTOMER_PASSWORD: environment.customerPassword,
      RESTAURANT_NAME: environment.restaurantName,
      PRODUCT_NAME: environment.productName,
      CURRENCY: environment.currency,
      MAX_ORDER_TOTAL: String(environment.maxOrderTotal),
      RESTAURANT_ID: environment.restaurantId,
      PRODUCT_ID: environment.productId,
      OPTION_ID: environment.optionId,
      RUN_ID: environment.runId,
      QA_PLACE_REAL_ORDER: 'true',
      FULFILLMENT: environment.fulfillment,
      PAYMENT_METHOD: environment.paymentMethod
    }
  } else if (mode === 'multi-vendor') {
    const environment = validateMobileMultiVendorEnvironment(input)
    flow = MULTI_VENDOR_FLOW
    values = {
      APP_ID: environment.appId,
      CUSTOMER_EMAIL: environment.customerEmail,
      CUSTOMER_PASSWORD: environment.customerPassword,
      RESTAURANT_NAME: environment.restaurantName,
      PRODUCT_NAME: environment.productName,
      PRODUCT_ID: environment.productId,
      OPTION_ID: environment.optionId,
      SECOND_RESTAURANT_NAME: environment.secondRestaurantName,
      SECOND_PRODUCT_ID: environment.secondProductId,
      CURRENCY: environment.currency,
      MAX_ORDER_TOTAL: String(environment.maxOrderTotal)
    }
  } else {
    const environment = validateMobileSmokeEnvironment(input)
    flow =
      mode === 'regression'
        ? REGRESSION_FLOW
        : mode === 'navigation'
          ? NAVIGATION_FLOW
          : SMOKE_FLOW
    values = {
      APP_ID: environment.appId,
      CUSTOMER_EMAIL: environment.customerEmail,
      CUSTOMER_PASSWORD: environment.customerPassword,
      RESTAURANT_NAME: environment.restaurantName,
      PRODUCT_NAME: environment.productName,
      PRODUCT_ID: environment.productId,
      OPTION_ID: environment.optionId,
      CURRENCY: environment.currency,
      MAX_ORDER_TOTAL: String(environment.maxOrderTotal)
    }
  }

  const args = [
    'test',
    '--platform=ios',
    '--format=JUNIT',
    `--output=${reportDirectory}/junit.xml`,
    `--test-output-dir=${reportDirectory}/artifacts`,
    `--debug-output=${reportDirectory}/debug`,
    ...Object.entries(values).flatMap(([key, value]) => [
      '-e',
      `${key}=${value}`
    ]),
    flow
  ]

  return { args, flow, reportDirectory }
}

function createReportRunId() {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 13)
  const git = spawnSync('git', ['rev-parse', '--short=7', 'HEAD'], {
    encoding: 'utf8'
  })
  const sha = git.status === 0 ? git.stdout.trim() : 'unknown'
  return `mobile-${timestamp}-${sha}`
}

/** @param {Record<string, string | undefined>} input */
function toolEnvironment(input) {
  const brewJavaHome =
    '/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home'
  const brewJavaBin = '/opt/homebrew/opt/openjdk@17/bin'
  const path = [brewJavaBin, '/opt/homebrew/bin', input.PATH]
    .filter(Boolean)
    .join(':')

  return {
    ...input,
    PATH: path,
    JAVA_HOME: input.JAVA_HOME || brewJavaHome,
    MAESTRO_CLI_NO_ANALYTICS: 'true',
    MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: 'true'
  }
}

/** @param {string} appId */
function runPreflight(appId) {
  const environment = toolEnvironment(process.env)
  /** @type {[string, string[]][]} */
  const checks = [
    ['java', ['-version']],
    ['maestro', ['--version']],
    ['xcodebuild', ['-version']],
    ['xcrun', ['simctl', 'list', 'devices', 'booted']],
    ['xcrun', ['simctl', 'get_app_container', 'booted', appId]]
  ]

  for (const [command, args] of checks) {
    const result = spawnSync(command, args, {
      env: environment,
      encoding: 'utf8',
      stdio: 'pipe'
    })
    if (result.status !== 0) {
      const detail = (result.stderr || result.stdout).trim()
      throw new Error(
        `Mobile preflight failed: ${command} ${args.join(' ')}${
          detail ? `\n${detail}` : ''
        }`
      )
    }
  }
}

function loadLocalEnvironment() {
  const path = process.env.QA_MOBILE_ENV_FILE || '.env.mobile.local'
  if (existsSync(path)) loadDotenv({ path, override: false, quiet: true })
}

function main() {
  loadLocalEnvironment()
  const requestedMode = process.argv[2]
  if (
    ![
      'preflight',
      'smoke',
      'regression',
      'multi-vendor',
      'navigation',
      'production-order'
    ].includes(requestedMode)
  ) {
    throw new Error(
      'Usage: node scripts/mobile-runner.js <preflight|smoke|regression|multi-vendor|navigation|production-order>'
    )
  }
  const mode =
    /** @type {'preflight' | 'smoke' | 'regression' | 'multi-vendor' | 'navigation' | 'production-order'} */ (
      requestedMode
    )

  const appId = process.env.QA_MOBILE_APP_ID || DEFAULT_APP_ID
  if (mode === 'preflight') {
    runPreflight(appId)
    console.log(`Mobile iOS preflight passed for ${appId}`)
    return
  }

  if (mode === 'production-order' && !process.env.QA_RUN_ID) {
    process.env.QA_RUN_ID = createReportRunId()
  }
  const reportRunId = process.env.QA_RUN_ID || createReportRunId()
  const run = buildMobileRun(mode, process.env, reportRunId)
  runPreflight(appId)
  mkdirSync(run.reportDirectory, { recursive: true })
  writeFileSync(
    `${run.reportDirectory}/command-metadata.json`,
    `${JSON.stringify({
      runId: reportRunId,
      mode,
      appId,
      flow: run.flow,
      startedAt: new Date().toISOString(),
      maestroVersion: '2.9.0'
    }, null, 2)}\n`
  )

  console.log(`Running ${mode} as ${reportRunId}`)
  console.log(`Artifacts: ${run.reportDirectory}`)
  const result = spawnSync('maestro', run.args, {
    env: toolEnvironment(process.env),
    encoding: 'utf8',
    stdio: 'inherit'
  })
  const report = spawnSync('node', ['scripts/mobile-report.js', run.reportDirectory], {
    encoding: 'utf8',
    stdio: 'inherit'
  })
  if (report.status !== 0) {
    console.error('The HTML summary could not be generated; retain the JUnit and debug artifacts.')
  }

  if (result.status !== 0) {
    if (mode === 'production-order') {
      console.error(
        `PRODUCTION ORDER CLEANUP REQUIRED: locate Run ID ${reportRunId}, verify its state, and cancel it manually if the automated cancellation did not finish.`
      )
    }
    process.exitCode = result.status || 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
