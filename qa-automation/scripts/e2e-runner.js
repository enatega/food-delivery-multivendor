/* global console, process */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { config as loadDotenv } from 'dotenv'

import { validateMobileE2eEnvironment } from './e2e-environment.js'

const CUSTOMER_FLOW = 'maestro/customer/flows/p0-e2e-customer-place-order.yaml'
const STORE_FLOW = 'maestro/store/flows/p0-e2e-store-accept.yaml'
const RIDER_FLOW = 'maestro/rider/flows/p0-e2e-rider-fulfil.yaml'
const SAFE_PATH_COMPONENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/
// place-order-delivery.yaml writes the order number into a screenshot filename,
// because Maestro has no way to return a value to the shell. This is the
// contract between stage 1 and the stages that follow it.
// Enatega order IDs are not guaranteed to be numeric, so the whole ID is carried
// across (letters, digits and hyphens) rather than just its digits.
const ORDER_NUMBER = /^[A-Za-z0-9][A-Za-z0-9-]*$/
const ORDER_NUMBER_SCREENSHOT = /^qa-order-number-([A-Za-z0-9][A-Za-z0-9-]*)\.png$/

/**
 * Arguments for one stage of the E2E. Each stage is its own `maestro test`
 * invocation because a single run drives a single device, and the three apps
 * live on three different simulators.
 *
 * @param {'customer' | 'store' | 'rider'} stage
 * @param {ReturnType<typeof validateMobileE2eEnvironment>} environment
 * @param {string} reportRunId
 * @param {string | null} orderNumber
 */
export function buildStageRun(stage, environment, reportRunId, orderNumber) {
  if (!SAFE_PATH_COMPONENT.test(reportRunId)) {
    throw new Error('report Run ID contains unsupported characters')
  }
  if (stage !== 'customer' && !orderNumber) {
    throw new Error(`Stage ${stage} cannot run without an order number`)
  }
  if (orderNumber && !ORDER_NUMBER.test(orderNumber)) {
    throw new Error('Order number must be letters, digits and hyphens only')
  }

  const reportDirectory = `reports/maestro/${reportRunId}/${stage}`
  /** @type {Record<string, string>} */
  const shared = {
    RUN_ID: environment.runId,
    CURRENCY: environment.currency,
    MAX_ORDER_TOTAL: String(environment.maxOrderTotal),
    NEW_ORDER_TIMEOUT: String(environment.newOrderTimeout)
  }

  let device
  let flow
  /** @type {Record<string, string>} */
  let values

  if (stage === 'customer') {
    device = environment.customerDevice
    flow = CUSTOMER_FLOW
    values = {
      ...shared,
      APP_ID: environment.customerAppId,
      METRO_URL: environment.customerMetroUrl,
      CUSTOMER_EMAIL: environment.customerEmail,
      CUSTOMER_PASSWORD: environment.customerPassword,
      RESTAURANT_NAME: environment.restaurantName,
      PRODUCT_NAME: environment.productName,
      PRODUCT_ID: environment.productId,
      OPTION_ID: environment.optionId,
      QA_PLACE_REAL_ORDER: 'true',
      QA_MOBILE_ALLOW_PRODUCTION_WRITES: 'true',
      FULFILLMENT: environment.fulfillment,
      PAYMENT_METHOD: environment.paymentMethod
    }
  } else if (stage === 'store') {
    device = environment.storeDevice
    flow = STORE_FLOW
    values = {
      ...shared,
      APP_ID: environment.storeAppId,
      STORE_USERNAME: environment.store.username,
      STORE_PASSWORD: environment.store.password,
      USE_PREFILLED_CREDENTIALS: String(environment.store.usePrefilled),
      METRO_URL: environment.storeMetroUrl,
      PREPARATION_TIME: String(environment.preparationTime),
      ORDER_NUMBER: String(orderNumber)
    }
  } else if (stage === 'rider') {
    device = environment.riderDevice
    flow = RIDER_FLOW
    values = {
      ...shared,
      APP_ID: environment.riderAppId,
      RIDER_USERNAME: environment.rider.username,
      RIDER_PASSWORD: environment.rider.password,
      USE_PREFILLED_CREDENTIALS: String(environment.rider.usePrefilled),
      METRO_URL: environment.riderMetroUrl,
      ORDER_NUMBER: String(orderNumber)
    }
  } else {
    throw new Error(`Unknown E2E stage: ${stage}`)
  }

  const environmentArgs = Object.entries(values).flatMap(([key, value]) => [
    '-e',
    `${key}=${value}`
  ])

  const args = [
    `--device=${device}`,
    'test',
    '--platform=ios',
    '--format=JUNIT',
    `--output=${reportDirectory}/junit.xml`,
    `--test-output-dir=${reportDirectory}/artifacts`,
    `--debug-output=${reportDirectory}/debug`,
    ...environmentArgs,
    flow
  ]

  return { args, flow, device, reportDirectory, stage }
}

/**
 * Recover the order number stage 1 wrote into a screenshot filename.
 *
 * @param {string} reportDirectory
 */
export function readOrderNumber(reportDirectory) {
  const roots = [
    join(reportDirectory, 'artifacts'),
    join(reportDirectory, 'debug')
  ]
  /** @type {string[]} */
  const found = []

  /** @param {string} directory */
  const walk = (directory) => {
    if (!existsSync(directory)) return
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        walk(path)
        continue
      }
      const match = ORDER_NUMBER_SCREENSHOT.exec(entry.name)
      if (match) found.push(match[1])
    }
  }

  for (const root of roots) walk(root)

  const unique = [...new Set(found)]
  if (unique.length === 0) {
    throw new Error(
      'The customer stage produced no qa-order-number-<order id>.png screenshot, so the order number is unknown. Refusing to touch any order in the store or rider app.'
    )
  }
  if (unique.length > 1) {
    throw new Error(
      `The customer stage reported more than one order number (${unique.join(', ')}); refusing to guess which one to fulfil.`
    )
  }
  return unique[0]
}

/** @param {string[]} args */
function gitOutput(args) {
  const git = spawnSync('git', args, { encoding: 'utf8' })
  return git.status === 0 ? git.stdout.trim() : ''
}

function createReportRunId() {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\..+$/, '')
    .replace('T', 'T')
    .slice(0, 13)
  const sha = gitOutput(['rev-parse', '--short', 'HEAD']) || 'nogit'
  return `e2e-${stamp}-${sha}`
}

/** @param {Record<string, string | undefined>} input */
function toolEnvironment(input) {
  const javaHome =
    input.JAVA_HOME || '/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home'
  return {
    ...input,
    JAVA_HOME: javaHome,
    PATH: `${javaHome}/bin:/opt/homebrew/bin:${input.PATH ?? ''}`
  }
}

/**
 * @param {ReturnType<typeof validateMobileE2eEnvironment>} environment
 */
function runPreflight(environment) {
  const environmentVariables = toolEnvironment(process.env)
  const version = spawnSync('maestro', ['--version'], {
    encoding: 'utf8',
    env: environmentVariables
  })
  if (version.status !== 0) {
    throw new Error('maestro is not on PATH')
  }

  const booted = spawnSync(
    'xcrun',
    ['simctl', 'list', 'devices', 'booted'],
    { encoding: 'utf8', env: environmentVariables }
  )
  if (booted.status !== 0) {
    throw new Error('xcrun simctl is unavailable')
  }
  const stages = /** @type {const} */ ([
    ['customer', environment.customerDevice, environment.customerAppId],
    ['store', environment.storeDevice, environment.storeAppId],
    ['rider', environment.riderDevice, environment.riderAppId]
  ])
  for (const [stage, device, appId] of stages) {
    if (!booted.stdout.includes(device)) {
      throw new Error(`The ${stage} simulator ${device} is not booted`)
    }
    const container = spawnSync(
      'xcrun',
      ['simctl', 'get_app_container', device, appId],
      { encoding: 'utf8', env: environmentVariables }
    )
    if (container.status !== 0) {
      throw new Error(
        `${appId} is not installed on the ${stage} simulator ${device}`
      )
    }
  }
}

function main() {
  const flags = process.argv.slice(2)
  const preflightOnly = flags.includes('--preflight')

  // First file loaded wins, so the E2E profile sits ahead of the customer-only
  // mobile settings: it is the one place that flips the production-write
  // guards, pins fulfilment to delivery and names the three simulators.
  loadDotenv({ path: '.env.e2e.local', override: false })
  loadDotenv({ path: '.env.mobile.local', override: false })
  loadDotenv({ path: '.env.local', override: false })
  loadDotenv({ override: false })

  if (!process.env.QA_RUN_ID) {
    process.env.QA_RUN_ID = `E2E${Date.now()}`
  }

  const environment = validateMobileE2eEnvironment(process.env)
  runPreflight(environment)

  if (preflightOnly) {
    console.log(
      `Mobile E2E preflight passed: customer ${environment.customerAppId} on ${environment.customerDevice}, store ${environment.storeAppId} on ${environment.storeDevice}, rider ${environment.riderAppId} on ${environment.riderDevice}`
    )
    return
  }

  const reportRunId = createReportRunId()
  const reportRoot = `reports/maestro/${reportRunId}`
  mkdirSync(reportRoot, { recursive: true })
  const environmentVariables = toolEnvironment(process.env)

  console.log(`Running mobile E2E as ${reportRunId}`)
  console.warn(
    'This places a REAL production order and carries it through to DELIVERED. It is never cancelled.'
  )

  /** @type {string | null} */
  let orderNumber = null
  /** @type {{stage: string, status: number, reportDirectory: string}[]} */
  const results = []

  for (const stage of /** @type {const} */ (['customer', 'store', 'rider'])) {
    const run = buildStageRun(stage, environment, reportRunId, orderNumber)
    console.log(`\n[${stage}] ${run.flow} on ${run.device}`)
    const result = spawnSync('maestro', run.args, {
      stdio: 'inherit',
      env: environmentVariables
    })
    const status = result.status ?? 1
    results.push({ stage, status, reportDirectory: run.reportDirectory })

    if (status !== 0) {
      // The customer stage can fail *after* submitting the order — every
      // assertion between "Place order" and the end of the flow runs against a
      // live production order. Recover the number from the screenshot before
      // reporting, so a half-finished run never leaves an order to be
      // discovered by the restaurant instead of by us.
      if (stage === 'customer') {
        try {
          orderNumber = readOrderNumber(run.reportDirectory)
        } catch {
          orderNumber = null
        }
      }
      writeFileSync(
        join(reportRoot, 'summary.json'),
        `${JSON.stringify({ reportRunId, orderNumber, results }, null, 2)}\n`
      )
      console.error(`\n[${stage}] FAILED.`)
      if (orderNumber) {
        // The order is already live on production at this point, so say so
        // loudly rather than leaving it to be discovered by the restaurant.
        console.error(
          `Order #${orderNumber} is live on production and was NOT completed. Resolve it by hand in the store app or admin dashboard.`
        )
      }
      process.exit(status)
    }

    if (stage === 'customer') {
      orderNumber = readOrderNumber(run.reportDirectory)
      console.log(`\n[customer] placed order #${orderNumber}`)
    }
  }

  writeFileSync(
    join(reportRoot, 'summary.json'),
    `${JSON.stringify({ reportRunId, orderNumber, results }, null, 2)}\n`
  )
  console.log(
    `\nE2E passed: order #${orderNumber} went PENDING -> ACCEPTED -> ASSIGNED -> PICKED -> DELIVERED.`
  )
  console.log(`Artifacts: ${reportRoot}`)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
