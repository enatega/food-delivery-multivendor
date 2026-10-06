/* global console, process */

import { existsSync, readdirSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

// Runs a suite, then posts its result to Slack whatever the outcome, then exits
// with the suite's own code. The exit code has to survive: chaining the notifier
// with `&&` would skip it on failure, and with `;` the notifier's success would
// mask a red run from CI.
const MAESTRO_REPORTS = 'reports/maestro'
const PLAYWRIGHT_JUNIT = 'reports/junit/playwright.xml'

/**
 * @param {string} prefix
 * @returns {string | undefined}
 */
function latestMaestroRun(prefix) {
  if (!existsSync(MAESTRO_REPORTS)) return undefined
  const runs = readdirSync(MAESTRO_REPORTS)
    .filter((name) => name.startsWith(prefix))
    .map((name) => join(MAESTRO_REPORTS, name))
    .filter((path) => statSync(path).isDirectory())
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  return runs[0]
}

/** @returns {string[]} */
function playwrightReport() {
  return [PLAYWRIGHT_JUNIT]
}

/** @param {string} prefix @returns {() => string[]} */
function maestroReport(prefix) {
  return () => {
    const run = latestMaestroRun(prefix)
    // Hand back the expected path even when it is missing: slack-report.js
    // turns an absent report into a loud "run produced no report" card.
    return [run ? join(run, 'junit.xml') : `${MAESTRO_REPORTS}/${prefix}*/junit.xml`]
  }
}

/** @returns {string[]} */
function maestroE2eReport() {
  const run = latestMaestroRun('e2e-')
  if (!run) return [`${MAESTRO_REPORTS}/e2e-*/junit.xml`]
  return ['customer', 'store', 'rider'].map((stage) => join(run, stage, 'junit.xml'))
}

/**
 * @type {Record<string, { script: string, title: string, report: () => string[] }>}
 */
const SUITES = {
  unit: { script: 'test:unit', title: 'QA unit suite', report: playwrightReport },
  contract: {
    script: 'test:contract',
    title: 'Customer Web test-id contract',
    report: playwrightReport
  },
  'web:mock': { script: 'test:web:mock', title: 'Web mock suite', report: playwrightReport },
  'web:p1': { script: 'test:web:p1', title: 'Web P1 suite', report: playwrightReport },
  'web:cross-browser': {
    script: 'test:web:cross-browser',
    title: 'Web cross-browser suite',
    report: playwrightReport
  },
  'web:production-smoke': {
    script: 'test:web:production-smoke',
    title: 'Web production smoke',
    report: playwrightReport
  },
  'web:production-authenticated': {
    script: 'test:web:production-authenticated',
    title: 'Web production authenticated',
    report: playwrightReport
  },
  // Writes a REAL COD order to the configured production backend. Kept out of
  // every automatic path on purpose — it only runs when asked for by name.
  'web:production-order-smoke': {
    script: 'test:web:production-order-smoke',
    title: 'Web production order (real COD)',
    report: playwrightReport
  },
  'mobile:smoke': {
    script: 'test:mobile:ios:smoke',
    title: 'iOS smoke',
    report: maestroReport('mobile-')
  },
  'mobile:regression': {
    script: 'test:mobile:ios:regression',
    title: 'iOS regression',
    report: maestroReport('mobile-')
  },
  'mobile:navigation': {
    script: 'test:mobile:ios:navigation',
    title: 'iOS navigation',
    report: maestroReport('mobile-')
  },
  'mobile:e2e': {
    script: 'test:mobile:e2e',
    title: 'iOS E2E (customer → store → rider)',
    report: maestroE2eReport
  }
}

const requested = process.argv[2]
const suite = requested ? SUITES[requested] : undefined

if (!suite) {
  console.error(
    requested ? `Unknown suite: ${requested}` : 'Usage: node scripts/run-with-slack.js <suite>'
  )
  console.error(`Available suites:\n  ${Object.keys(SUITES).join('\n  ')}`)
  process.exit(2)
}

console.log(`▶ npm run ${suite.script}`)
const run = spawnSync('npm', ['run', suite.script], { stdio: 'inherit' })
const exitCode = run.status ?? 1

console.log(`\n▶ posting "${suite.title}" to Slack (suite exited ${exitCode})`)
spawnSync(
  process.execPath,
  [
    'scripts/slack-report.js',
    ...suite.report().flatMap((path) => ['--junit', path]),
    '--title',
    suite.title,
    // Lets the card tell whoever reads it exactly how to reproduce the failure.
    '--command',
    `npm run ${suite.script}`
  ],
  { stdio: 'inherit' }
)

process.exit(exitCode)
