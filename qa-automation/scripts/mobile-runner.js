/* global URL, console, process */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { homedir } from 'node:os'
import { join } from 'node:path'
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
// `maestro cloud` zips the path given to --flows and makes it the workspace
// root, so a directory of flows uploaded on its own loses ../../subflows and is
// rejected with "Invalid File Path" before any device runs. Upload the whole
// customer workspace instead and narrow the run with tags. `maestro test`
// resolves against the real filesystem, so local runs keep taking a path.
const CLOUD_WORKSPACE = 'maestro/customer'
// Every flow is tagged, and the tags already partition the modes: p1 is the
// regression set minus the two suites that carry their own tag.
/** @type {Record<string, { include: string[], exclude?: string[] }>} */
const CLOUD_TAGS = {
  smoke: { include: ['smoke'] },
  'production-order': { include: ['production-write'] },
  regression: { include: ['regression'], exclude: ['multi-vendor', 'navigation'] },
  'multi-vendor': { include: ['multi-vendor'] },
  navigation: { include: ['navigation'] }
}
const SAFE_PATH_COMPONENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
const SAFE_IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/
// Maestro Cloud accepts a built binary, not a simulator that happens to be
// booted here: .app/.zip for simulator runs, .ipa/.apk for device runs.
const CLOUD_APP_FILE_EXTENSIONS = ['.app', '.zip', '.ipa', '.apk']

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
 * Maestro Cloud runs the flows on someone else's device farm, so a booted local
 * simulator is irrelevant and the app has to travel with the run: either a fresh
 * binary (`--app-file`) or one already uploaded (`--app-binary-id`). Everything
 * that makes a run safe — the environment guards, the injected values, the flow
 * itself — is unchanged, so a cloud run is exactly as read-only as its mode.
 *
 * @param {Record<string, string | undefined>} input
 */
export function validateMobileCloudTarget(input) {
  const appFile = input.QA_MOBILE_APP_FILE?.trim()
  const appBinaryId = input.QA_MOBILE_APP_BINARY_ID?.trim()
  if (!appFile && !appBinaryId) {
    throw new Error(
      'Cloud runs require QA_MOBILE_APP_FILE (a built app binary) or QA_MOBILE_APP_BINARY_ID'
    )
  }
  if (appFile && appBinaryId) {
    throw new Error(
      'Set only one of QA_MOBILE_APP_FILE or QA_MOBILE_APP_BINARY_ID'
    )
  }
  if (
    appFile &&
    !CLOUD_APP_FILE_EXTENSIONS.some((extension) =>
      appFile.toLowerCase().endsWith(extension)
    )
  ) {
    throw new Error(
      `QA_MOBILE_APP_FILE must end in ${CLOUD_APP_FILE_EXTENSIONS.join(', ')}`
    )
  }
  if (appBinaryId && !SAFE_IDENTIFIER.test(appBinaryId)) {
    throw new Error('QA_MOBILE_APP_BINARY_ID contains unsupported characters')
  }

  const deviceLocale = input.QA_MOBILE_CLOUD_DEVICE_LOCALE?.trim()
  if (deviceLocale && !/^[a-z]{2}_[A-Z]{2}$/.test(deviceLocale)) {
    throw new Error(
      'QA_MOBILE_CLOUD_DEVICE_LOCALE must be an ISO locale such as "en_US"'
    )
  }
  /** @type {Record<string, string | undefined>} */
  const selectors = {}
  for (const key of [
    'QA_MOBILE_CLOUD_DEVICE_MODEL',
    'QA_MOBILE_CLOUD_DEVICE_OS',
    'QA_MOBILE_CLOUD_PROJECT_ID'
  ]) {
    const value = input[key]?.trim()
    if (value && !SAFE_IDENTIFIER.test(value)) {
      throw new Error(`${key} contains unsupported characters`)
    }
    selectors[key] = value
  }

  return {
    appFile,
    appBinaryId,
    // Deliberately never written to command-metadata.json: that file is echoed
    // verbatim into the HTML summary.
    apiKey: input.MAESTRO_CLOUD_API_KEY?.trim(),
    deviceModel: selectors.QA_MOBILE_CLOUD_DEVICE_MODEL,
    deviceOs: selectors.QA_MOBILE_CLOUD_DEVICE_OS,
    deviceLocale,
    projectId: selectors.QA_MOBILE_CLOUD_PROJECT_ID,
    // Free-form on purpose — branch names carry slashes. Nothing is shell
    // interpolated, so these only ever reach the console as run labels.
    branch: input.QA_MOBILE_CLOUD_BRANCH?.trim(),
    commitSha: input.QA_MOBILE_CLOUD_COMMIT_SHA?.trim()
  }
}

/**
 * @param {'smoke' | 'production-order' | 'regression' | 'multi-vendor' | 'navigation'} mode
 * @param {Record<string, string | undefined>} input
 * @param {string} reportRunId
 * @param {{ target?: 'local' | 'cloud'; async?: boolean }} [options]
 */
export function buildMobileRun(mode, input, reportRunId, options = {}) {
  if (!SAFE_PATH_COMPONENT.test(reportRunId)) {
    throw new Error('report Run ID contains unsupported characters')
  }

  const target = options.target ?? 'local'
  const isProductionOrder = mode === 'production-order'
  // An async cloud run exits before the order exists, so nobody would be
  // watching to cancel one that the flow failed to clean up.
  if (isProductionOrder && options.async) {
    throw new Error(
      'production-order cannot run with --async: a real order must never be left unwatched'
    )
  }
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

  const environmentArgs = Object.entries(values).flatMap(([key, value]) => [
    '-e',
    `${key}=${value}`
  ])

  if (target === 'cloud') {
    const cloud = validateMobileCloudTarget(input)
    const tags = CLOUD_TAGS[mode]
    if (!tags) throw new Error(`No cloud tag selection is defined for mode ${mode}`)
    // Cloud keeps screenshots and video in the console, so the only local
    // artifact is the JUnit report the summary is built from.
    const args = [
      'cloud',
      cloud.appFile
        ? `--app-file=${cloud.appFile}`
        : `--app-binary-id=${cloud.appBinaryId}`,
      `--flows=${CLOUD_WORKSPACE}`,
      `--include-tags=${tags.include.join(',')}`,
      ...(tags.exclude ? [`--exclude-tags=${tags.exclude.join(',')}`] : []),
      `--name=${reportRunId}`,
      '--format=JUNIT',
      `--output=${reportDirectory}/junit.xml`,
      ...(cloud.apiKey ? [`--api-key=${cloud.apiKey}`] : []),
      ...(cloud.projectId ? [`--project-id=${cloud.projectId}`] : []),
      ...(cloud.deviceModel ? [`--device-model=${cloud.deviceModel}`] : []),
      ...(cloud.deviceOs ? [`--device-os=${cloud.deviceOs}`] : []),
      ...(cloud.deviceLocale ? [`--device-locale=${cloud.deviceLocale}`] : []),
      ...(cloud.branch ? [`--branch=${cloud.branch}`] : []),
      ...(cloud.commitSha ? [`--commit-sha=${cloud.commitSha}`] : []),
      ...(options.async ? ['--async'] : []),
      ...environmentArgs
    ]

    return { args, flow, reportDirectory, target, tags }
  }

  const args = [
    'test',
    '--platform=ios',
    '--format=JUNIT',
    `--output=${reportDirectory}/junit.xml`,
    `--test-output-dir=${reportDirectory}/artifacts`,
    `--debug-output=${reportDirectory}/debug`,
    ...environmentArgs,
    flow
  ]

  return { args, flow, reportDirectory, target }
}

/** @param {string[]} args */
function gitOutput(args) {
  const git = spawnSync('git', args, { encoding: 'utf8' })
  return git.status === 0 ? git.stdout.trim() : ''
}

function createReportRunId() {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 13)
  const sha = gitOutput(['rev-parse', '--short=7', 'HEAD']) || 'unknown'
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

/** @param {[string, string[]][]} checks */
function runChecks(checks) {
  const environment = toolEnvironment(process.env)
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

/** @param {string} appId */
function runLocalPreflight(appId) {
  runChecks([
    ['java', ['-version']],
    ['maestro', ['--version']],
    ['xcodebuild', ['-version']],
    ['xcrun', ['simctl', 'list', 'devices', 'booted']],
    ['xcrun', ['simctl', 'get_app_container', 'booted', appId]]
  ])
}

// Best-effort only. The CLI is the real authority on whether this machine is
// signed in, so a missed session downgrades to a warning rather than blocking a
// run that would have worked.
function hasCloudSession() {
  if (existsSync(join(homedir(), '.mobiledev', 'authtoken'))) return true
  try {
    const analytics = JSON.parse(
      readFileSync(join(homedir(), '.maestro', 'analytics.json'), 'utf8')
    )
    return Boolean(analytics.cachedToken)
  } catch {
    return false
  }
}

/** @param {ReturnType<typeof validateMobileCloudTarget>} cloud */
function runCloudPreflight(cloud) {
  runChecks([
    ['java', ['-version']],
    ['maestro', ['--version']]
  ])
  if (cloud.appFile && !existsSync(cloud.appFile)) {
    throw new Error(`QA_MOBILE_APP_FILE does not exist: ${cloud.appFile}`)
  }
  if (!cloud.apiKey && !hasCloudSession()) {
    console.warn(
      'No MAESTRO_CLOUD_API_KEY and no local Maestro session found — run `maestro login` or set the key in .env.mobile.local if the upload is rejected.'
    )
  }
}

function loadLocalEnvironment() {
  const path = process.env.QA_MOBILE_ENV_FILE || '.env.mobile.local'
  if (existsSync(path)) loadDotenv({ path, override: false, quiet: true })
}

function main() {
  loadLocalEnvironment()
  const [, , requestedMode, ...flags] = process.argv
  const usage =
    'Usage: node scripts/mobile-runner.js <preflight|smoke|regression|multi-vendor|navigation|production-order> [--cloud] [--async]'
  for (const flag of flags) {
    if (flag !== '--cloud' && flag !== '--async') {
      throw new Error(`Unknown option ${flag}\n${usage}`)
    }
  }
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
    throw new Error(usage)
  }
  const mode =
    /** @type {'preflight' | 'smoke' | 'regression' | 'multi-vendor' | 'navigation' | 'production-order'} */ (
      requestedMode
    )

  const target =
    flags.includes('--cloud') || process.env.QA_MOBILE_TARGET === 'cloud'
      ? 'cloud'
      : 'local'
  const runAsync = flags.includes('--async')
  if (runAsync && target === 'local') {
    throw new Error('--async applies to --cloud runs only')
  }

  const appId = process.env.QA_MOBILE_APP_ID || DEFAULT_APP_ID
  if (mode === 'preflight') {
    if (target === 'cloud') {
      const cloud = validateMobileCloudTarget(process.env)
      runCloudPreflight(cloud)
      console.log(
        `Maestro Cloud preflight passed for ${cloud.appFile || cloud.appBinaryId}`
      )
      return
    }
    runLocalPreflight(appId)
    console.log(`Mobile iOS preflight passed for ${appId}`)
    return
  }

  if (mode === 'production-order' && !process.env.QA_RUN_ID) {
    process.env.QA_RUN_ID = createReportRunId()
  }
  const reportRunId = process.env.QA_RUN_ID || createReportRunId()
  if (target === 'cloud') {
    // Label the upload in the Maestro Cloud console with the same provenance
    // the local report carries.
    process.env.QA_MOBILE_CLOUD_BRANCH ||= gitOutput(['rev-parse', '--abbrev-ref', 'HEAD'])
    process.env.QA_MOBILE_CLOUD_COMMIT_SHA ||= gitOutput(['rev-parse', 'HEAD'])
  }
  const run = buildMobileRun(mode, process.env, reportRunId, {
    target,
    async: runAsync
  })
  const cloud = target === 'cloud' ? validateMobileCloudTarget(process.env) : undefined
  if (cloud) runCloudPreflight(cloud)
  else runLocalPreflight(appId)
  mkdirSync(run.reportDirectory, { recursive: true })
  writeFileSync(
    `${run.reportDirectory}/command-metadata.json`,
    `${JSON.stringify({
      runId: reportRunId,
      mode,
      target,
      appId,
      flow: run.flow,
      // The API key is intentionally absent: this file is rendered into the
      // HTML summary as-is.
      ...(cloud
        ? {
            appFile: cloud.appFile,
            appBinaryId: cloud.appBinaryId,
            deviceModel: cloud.deviceModel,
            deviceOs: cloud.deviceOs,
            // A cloud run uploads the workspace and selects by tag, so `flow`
            // above names the suite rather than what was actually uploaded.
            workspace: CLOUD_WORKSPACE,
            includeTags: run.tags?.include,
            excludeTags: run.tags?.exclude,
            async: runAsync
          }
        : {}),
      startedAt: new Date().toISOString(),
      maestroVersion: '2.9.0'
    }, null, 2)}\n`
  )

  console.log(`Running ${mode} on ${target} as ${reportRunId}`)
  console.log(`Artifacts: ${run.reportDirectory}`)
  const result = spawnSync('maestro', run.args, {
    env: toolEnvironment(process.env),
    encoding: 'utf8',
    stdio: 'inherit'
  })

  if (runAsync) {
    // The upload returns before any device has run a flow, so there is no JUnit
    // to summarise — the console owns the result.
    console.log(
      `Cloud run ${reportRunId} was queued asynchronously; follow it at https://app.maestro.dev`
    )
  } else {
    const report = spawnSync('node', ['scripts/mobile-report.js', run.reportDirectory], {
      encoding: 'utf8',
      stdio: 'inherit'
    })
    if (report.status !== 0) {
      console.error('The HTML summary could not be generated; retain the JUnit and debug artifacts.')
    }
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
