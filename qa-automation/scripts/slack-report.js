/* global console, process, fetch */

import { existsSync, readFileSync } from 'node:fs'
import { basename } from 'node:path'

import { config as loadDotenv } from 'dotenv'

loadDotenv({ path: '.env', quiet: true })

// Both reporters emit JUnit, so one parser covers Playwright and Maestro:
//   Playwright -> reports/junit/playwright.xml       (totals on <testsuites>)
//   Maestro    -> reports/maestro/<runId>/junit.xml  (totals on <testsuite>)

/**
 * @typedef {object} SuiteTotals
 * @property {number} tests
 * @property {number} failures
 * @property {number} errors
 * @property {number} skipped
 */

/**
 * @typedef {object} FailureDetail
 * @property {string} name
 * @property {string} location
 * @property {string} type
 * @property {string} body
 * @property {string} [trace]
 */

/**
 * @typedef {object} RunResult
 * @property {string} source
 * @property {boolean} reportFound
 * @property {SuiteTotals} totals
 * @property {FailureDetail[]} failures
 * @property {number} durationSeconds
 */

/** @param {string} tag @param {string} attribute */
function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}="([^"]*)"`))
  return match?.[1] ?? ''
}

/** @param {string} tag @param {string} attribute */
function readCount(tag, attribute) {
  const value = Number.parseInt(readAttribute(tag, attribute), 10)
  return Number.isFinite(value) ? value : 0
}

/**
 * Totals live on the root `<testsuites>` when Playwright writes the file and on
 * each `<testsuite>` when Maestro does. Reading both and preferring the root
 * keeps us from double-counting Playwright's nested suites.
 * @param {string} xml
 * @returns {SuiteTotals}
 */
function collectTotals(xml) {
  const root = xml.match(/<testsuites\b[^>]*>/)?.[0] ?? ''
  if (readAttribute(root, 'tests')) {
    return {
      tests: readCount(root, 'tests'),
      failures: readCount(root, 'failures'),
      errors: readCount(root, 'errors'),
      skipped: readCount(root, 'skipped')
    }
  }

  const totals = { tests: 0, failures: 0, errors: 0, skipped: 0 }
  for (const [tag] of xml.matchAll(/<testsuite\b[^>]*>/g)) {
    totals.tests += readCount(tag, 'tests')
    totals.failures += readCount(tag, 'failures')
    totals.errors += readCount(tag, 'errors')
    totals.skipped += readCount(tag, 'skipped')
  }
  return totals
}

/** @param {string} value */
function decodeXml(value) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&')
}

/** @param {string} value */
function stripAnsi(value) {
  // Playwright colours its reporter output; the codes survive into the XML and
  // render as garbage in Slack.
  // eslint-disable-next-line no-control-regex
  return value.replace(/\u001B\[[0-9;]*m/g, '')
}

/**
 * The detail a developer needs lives in the <failure> CDATA: the error message,
 * the code frame and (for browser runs) the call log. Pull it out rather than
 * just the test name.
 * @param {string} xml
 * @returns {FailureDetail[]}
 */
function collectFailures(xml) {
  /** @type {FailureDetail[]} */
  const failures = []
  // Self-closing <testcase .../> cannot hold a <failure>, so only the paired
  // form is worth scanning.
  for (const [block] of xml.matchAll(/<testcase\b[^>]*>[\s\S]*?<\/testcase>/g)) {
    // <system-out> precedes <failure> and carries its own CDATA, so the search
    // has to be scoped to the failure element or it picks up the attachment list.
    const failureElement = block.match(
      /<(failure|error)\b[^>]*>([\s\S]*?)<\/(?:failure|error)>/
    )
    const failureTag = failureElement?.[0].match(/<(?:failure|error)\b[^>]*>/)?.[0]
    if (!failureElement || !failureTag) continue

    const open = block.match(/<testcase\b[^>]*>/)?.[0] ?? ''
    const name = readAttribute(open, 'name') || 'unnamed test'
    const file = readAttribute(open, 'classname') || readAttribute(open, 'file')
    const type = readAttribute(failureTag, 'type')

    const cdata = failureElement[2]?.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)?.[1]
    const attributeMessage = readAttribute(failureTag, 'message')
    const raw = stripAnsi(decodeXml(cdata ?? attributeMessage ?? '')).trim()

    // Playwright repeats "[project] > file:line > test name" as the first line.
    // It duplicates what we already show, but it carries the exact line number.
    const lines = raw.split('\n')
    const location = raw.match(/›\s*([^\s›]+:\d+:\d+)\s*›/)?.[1] ?? file
    const body = (/›[^›]*›/.test(lines[0] ?? '') ? lines.slice(1) : lines)
      .join('\n')
      .trim()

    // The trace is the fastest route from a Slack card to a root cause, so
    // surface the exact command rather than making the reader hunt for it.
    const trace = block
      .match(/\[\[ATTACHMENT\|([^\]]*trace\.zip)\]\]/)?.[1]
      ?.replace(/^\.\.\//, '')

    failures.push({ name, location, type, body, trace })
  }
  return failures
}

/** @param {string} xml */
function collectDuration(xml) {
  const root = xml.match(/<testsuites\b[^>]*>/)?.[0] ?? ''
  const rootTime = Number.parseFloat(readAttribute(root, 'time'))
  if (Number.isFinite(rootTime)) return rootTime
  let total = 0
  for (const [tag] of xml.matchAll(/<testsuite\b[^>]*>/g)) {
    const time = Number.parseFloat(readAttribute(tag, 'time'))
    if (Number.isFinite(time)) total += time
  }
  return total
}

/** @param {string} path @returns {RunResult} */
function readRun(path) {
  if (!existsSync(path)) {
    // A missing report means the runner died before writing one. That is a
    // failure worth announcing, not a reason to stay quiet.
    return {
      source: path,
      reportFound: false,
      totals: { tests: 0, failures: 0, errors: 0, skipped: 0 },
      failures: [],
      durationSeconds: 0
    }
  }
  const xml = readFileSync(path, 'utf8')
  return {
    source: path,
    reportFound: true,
    totals: collectTotals(xml),
    failures: collectFailures(xml),
    durationSeconds: collectDuration(xml)
  }
}

/** @param {RunResult[]} runs */
function summarise(runs) {
  const totals = runs.reduce(
    (accumulator, run) => ({
      tests: accumulator.tests + run.totals.tests,
      failures: accumulator.failures + run.totals.failures,
      errors: accumulator.errors + run.totals.errors,
      skipped: accumulator.skipped + run.totals.skipped
    }),
    { tests: 0, failures: 0, errors: 0, skipped: 0 }
  )
  const failed = totals.failures + totals.errors
  const missingReport = runs.some((run) => !run.reportFound)
  return {
    failed,
    skipped: totals.skipped,
    total: totals.tests,
    passed: Math.max(totals.tests - failed - totals.skipped, 0),
    missingReport,
    healthy: failed === 0 && !missingReport,
    failures: runs.flatMap((run) => run.failures),
    durationSeconds: runs.reduce((sum, run) => sum + run.durationSeconds, 0)
  }
}

/** @param {string} value */
function escapeMarkdown(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

/**
 * A gate that produces no JUnit report, such as typecheck or lint, or a job
 * that never ran. Outcomes use GitHub's step vocabulary.
 * @typedef {{ name: string, outcome: 'success' | 'failure' | 'cancelled' | 'skipped' }} Check
 */

const CHECK_ICONS = { success: '✅', failure: '❌', cancelled: '⛔', skipped: '⏭' }

/**
 * @param {string} title
 * @param {RunResult[]} runs
 * @param {string} [reproduceCommand]
 * @param {Check[]} [checks]
 */
function buildMessage(title, runs, reproduceCommand, checks = []) {
  const testSummary = summarise(runs)
  // A failed typecheck or lint must turn the card red even when every test
  // that did run passed — otherwise a broken build reads as green in Slack.
  const failedChecks = checks.filter(
    (check) => check.outcome === 'failure' || check.outcome === 'cancelled'
  )
  const summary = { ...testSummary, healthy: testSummary.healthy && failedChecks.length === 0 }
  const icon = summary.healthy ? ':large_green_circle:' : ':red_circle:'
  const testHeadline =
    runs.length === 0
      ? title
      : summary.missingReport
        ? `${title}: run produced no report`
        : `${title}: ${summary.passed}/${summary.total} passed`
  const headline = failedChecks.length
    ? `${testHeadline} — ${failedChecks.map((check) => check.name).join(', ')} failed`
    : testHeadline

  // QA_BRANCH first: on a pull_request run GITHUB_REF_NAME is `<n>/merge`,
  // which names nothing a reader would recognise.
  const branch = process.env.QA_BRANCH || process.env.GITHUB_REF_NAME || 'local'
  const pullRequestUrl = process.env.QA_PR_URL?.trim()
  const runUrl =
    process.env.GITHUB_RUN_ID &&
    `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`

  /** @type {Record<string, unknown>[]} */
  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: `${summary.healthy ? '✅' : '❌'} ${title}`, emoji: true }
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Passed*\n${summary.passed}` },
        { type: 'mrkdwn', text: `*Failed*\n${summary.failed}` },
        { type: 'mrkdwn', text: `*Skipped*\n${summary.skipped}` },
        {
          type: 'mrkdwn',
          text: `*Duration*\n${summary.durationSeconds.toFixed(1)}s`
        },
        { type: 'mrkdwn', text: `*Branch*\n\`${escapeMarkdown(branch)}\`` }
      ]
    }
  ]

  if (checks.length > 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Checks*\n${checks
          .map((check) => `${CHECK_ICONS[check.outcome]} ${escapeMarkdown(check.name)}`)
          .join('   ')}`
      }
    })
  }

  if (summary.missingReport) {
    const missing = runs.filter((run) => !run.reportFound).map((run) => basename(run.source))
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:warning: No JUnit report at ${missing.map((name) => `\`${escapeMarkdown(name)}\``).join(', ')} — the run likely crashed before finishing.`
      }
    })
  }

    // Slack caps a section at 3000 characters and a message at 50 blocks, so the
  // detail goes to the first few failures and the rest are named only. A dev
  // who can see the top failure in Slack usually does not need to open the
  // report at all.
  const DETAILED_FAILURES = 3
  const BODY_BUDGET = 2200

  for (const [index, failure] of summary.failures.slice(0, DETAILED_FAILURES).entries()) {
    const heading = [
      `*${index + 1}. ${escapeMarkdown(failure.name)}*`,
      [
        failure.location ? `\`${escapeMarkdown(failure.location)}\`` : '',
        failure.type ? `_${escapeMarkdown(failure.type)}_` : ''
      ]
        .filter(Boolean)
        .join('  ·  ')
    ]
      .filter(Boolean)
      .join('\n')

    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: heading } })

    if (failure.trace) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `:mag: \`npx playwright show-trace ${escapeMarkdown(failure.trace)}\``
          }
        ]
      })
    }

    if (failure.body) {
      const truncated = failure.body.length > BODY_BUDGET
      const body = truncated
        ? `${failure.body.slice(0, BODY_BUDGET)}\n… truncated, see the full report`
        : failure.body
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `\`\`\`${body}\`\`\`` }
      })
    }
  }

  const undetailed = summary.failures.slice(DETAILED_FAILURES)
  if (undetailed.length > 0) {
    const shown = undetailed.slice(0, 15)
    const overflow = undetailed.length - shown.length
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: [
          `*${undetailed.length} more failure${undetailed.length === 1 ? '' : 's'}*`,
          ...shown.map(
            (failure) =>
              `• ${escapeMarkdown(failure.name)}${failure.location ? ` — \`${escapeMarkdown(failure.location)}\`` : ''}`
          ),
          overflow > 0 ? `_…and ${overflow} more_` : ''
        ]
          .filter(Boolean)
          .join('\n')
      }
    })
  }

  if (!summary.healthy && reproduceCommand) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `:arrow_forward: Reproduce: \`${escapeMarkdown(reproduceCommand)}\`   ·   Full report: \`npm run report:web\``
        }
      ]
    })
  }

  /** @type {Record<string, unknown>[]} */
  const buttons = []
  if (runUrl) {
    buttons.push({
      type: 'button',
      text: { type: 'plain_text', text: 'Open run & full report' },
      url: runUrl
    })
  }
  if (pullRequestUrl) {
    buttons.push({
      type: 'button',
      text: { type: 'plain_text', text: 'Open pull request' },
      url: pullRequestUrl
    })
  }
  if (buttons.length > 0) blocks.push({ type: 'actions', elements: buttons })

  return { text: `${icon} ${headline}`, blocks }
}

/** @param {{ text: string, blocks: Record<string, unknown>[] }} message */
async function deliver(message) {
  const webhook = process.env.SLACK_WEBHOOK_URL?.trim()
  const botToken = process.env.SLACK_BOT_TOKEN?.trim()
  const channel = process.env.SLACK_CHANNEL?.trim()

  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(message)
    })
    if (!response.ok) {
      throw new Error(`Slack webhook returned ${response.status}: ${await response.text()}`)
    }
    return 'webhook'
  }

  if (botToken) {
    if (!channel) throw new Error('SLACK_CHANNEL is required alongside SLACK_BOT_TOKEN')
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${botToken}`
      },
      body: JSON.stringify({ channel, ...message })
    })
    // chat.postMessage answers 200 even when it refuses the call, so the body
    // is the only reliable signal.
    const body = /** @type {{ ok?: boolean, error?: string }} */ (await response.json())
    if (!body.ok) throw new Error(`Slack rejected the message: ${body.error ?? 'unknown error'}`)
    return 'bot token'
  }

  return null
}

/** @param {string[]} argv */
function parseArguments(argv) {
  /** @type {string[]} */
  const junitPaths = []
  let title = 'QA run'
  let dryRun = false
  let command = ''
  /** @type {Check[]} */
  const checks = []

  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index]
    if (flag === '--junit') {
      const value = argv[index + 1]
      if (!value) throw new Error('--junit needs a path')
      junitPaths.push(value)
      index += 1
    } else if (flag === '--title') {
      const value = argv[index + 1]
      if (!value) throw new Error('--title needs a value')
      title = value
      index += 1
    } else if (flag === '--command') {
      const value = argv[index + 1]
      if (!value) throw new Error('--command needs a value')
      command = value
      index += 1
    } else if (flag === '--check') {
      const value = argv[index + 1] ?? ''
      const separator = value.lastIndexOf('=')
      const name = value.slice(0, separator).trim()
      const outcome = value.slice(separator + 1).trim()
      if (separator < 1 || !name || !(outcome in CHECK_ICONS)) {
        throw new Error(
          `--check needs "Name=outcome" with outcome one of ${Object.keys(CHECK_ICONS).join(', ')}`
        )
      }
      checks.push({ name, outcome: /** @type {Check['outcome']} */ (outcome) })
      index += 1
    } else if (flag === '--dry-run') {
      dryRun = true
    } else {
      throw new Error(`Unknown argument: ${flag}`)
    }
  }

  if (junitPaths.length === 0 && checks.length === 0) {
    throw new Error('At least one --junit path or --check is required')
  }
  return { junitPaths, title, dryRun, command, checks }
}

async function main() {
  const { junitPaths, title, dryRun, command, checks } = parseArguments(process.argv.slice(2))
  const message = buildMessage(title, junitPaths.map(readRun), command, checks)

  if (dryRun) {
    console.log(JSON.stringify(message, null, 2))
    return
  }

  const channel = await deliver(message)
  if (!channel) {
    console.warn('Slack is not configured (set SLACK_WEBHOOK_URL or SLACK_BOT_TOKEN) — skipping')
    return
  }
  console.log(`Posted "${message.text}" to Slack via ${channel}`)
}

// A Slack outage must never turn a green test run red, so every failure here is
// reported and swallowed.
main().catch((error) => {
  console.error(`Slack notification failed: ${error instanceof Error ? error.message : error}`)
})
