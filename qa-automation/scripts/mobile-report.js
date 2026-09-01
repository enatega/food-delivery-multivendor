/* global console, process */

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { resolve, relative, join } from 'node:path'

const reportsRoot = resolve('reports/maestro')

/** @param {unknown} value */
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** @param {string} directory @returns {string[]} */
function listFiles(directory) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? listFiles(path) : [path]
  })
}

function latestRunDirectory() {
  if (!existsSync(reportsRoot)) {
    throw new Error('No Maestro report runs exist yet')
  }
  const runs = readdirSync(reportsRoot)
    .map((name) => join(reportsRoot, name))
    .filter((path) => statSync(path).isDirectory())
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  if (!runs[0]) throw new Error('No Maestro report runs exist yet')
  return runs[0]
}

/** @param {string} directory */
function createReport(directory) {
  const runDirectory = resolve(directory)
  if (!runDirectory.startsWith(`${reportsRoot}/`)) {
    throw new Error('Report directory must be below reports/maestro')
  }
  const junitPath = join(runDirectory, 'junit.xml')
  const metadataPath = join(runDirectory, 'command-metadata.json')
  const junit = existsSync(junitPath)
    ? readFileSync(junitPath, 'utf8')
    : '<testsuite name="Maestro" tests="0" failures="1"><testcase name="Run did not produce JUnit"><failure/></testcase></testsuite>'
  const metadata = existsSync(metadataPath)
    ? JSON.parse(readFileSync(metadataPath, 'utf8'))
    : {}
  const tests = junit.match(/<testcase\b/g)?.length || 0
  const failures = junit.match(/<(failure|error)\b/g)?.length || 0
  const artifacts = listFiles(runDirectory)
    .filter((path) => !path.endsWith('summary.html'))
    .map((path) => relative(runDirectory, path))
  const artifactRows = artifacts
    .map((path) => `<li><a href="${escapeHtml(path)}">${escapeHtml(path)}</a></li>`)
    .join('')
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Maestro ${escapeHtml(metadata.runId || 'run')}</title>
<style>body{font:15px system-ui;margin:40px;max-width:960px;color:#18212f}header{padding:24px;border-radius:12px;background:#edf6ff}.ok{color:#08783e}.bad{color:#b42318}code{background:#f2f4f7;padding:2px 6px;border-radius:4px}li{margin:8px 0}</style></head>
<body><header><h1>Customer Mobile QA</h1><p>Run <code>${escapeHtml(metadata.runId || 'unknown')}</code> · ${escapeHtml(metadata.mode || 'unknown')} · Maestro ${escapeHtml(metadata.maestroVersion || 'unknown')}</p><h2 class="${failures ? 'bad' : 'ok'}">${tests} test case(s), ${failures} failure(s)</h2></header>
<h2>Command metadata</h2><pre>${escapeHtml(JSON.stringify(metadata, null, 2))}</pre>
<h2>Artifacts and logs</h2><ul>${artifactRows}</ul></body></html>`
  const output = join(runDirectory, 'summary.html')
  writeFileSync(output, html)
  return output
}

try {
  const requested = process.argv[2]
  console.log(createReport(requested || latestRunDirectory()))
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
