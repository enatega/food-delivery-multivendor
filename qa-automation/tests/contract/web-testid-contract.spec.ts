import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { expect, test } from '@playwright/test'

/**
 * CW-CONTRACT-001 — the Customer Web app must keep the QA instrumentation the
 * browser suites select on.
 *
 * Upstream merges have twice overwritten the instrumented components and
 * dropped these attributes, which takes the whole mock suite down: every spec
 * dies on a 60s selector timeout, and the failure reads as a UI bug rather than
 * as missing instrumentation. This test turns that into one fast, unambiguous
 * failure that names the attribute and the component to restore.
 *
 * It reads source rather than driving a browser, so it costs milliseconds and
 * cannot flake.
 */

const WEB_APP_ROOT = resolve('../enatega-multivendor-web')
const SOURCE_DIRECTORIES = ['lib', 'app']
const SOURCE_EXTENSIONS = ['.tsx', '.ts']

/**
 * Attributes the browser suites select on, with the component that owns each
 * one. Dynamic ids (`product-card-${meal._id}`) are matched by their prefix,
 * since the literal id only exists at runtime.
 */
const REQUIRED_TEST_IDS: Array<{
  testId: string
  owner: string
  usedBy: string
  dynamic?: boolean
}> = [
  {
    testId: 'customer-login-trigger',
    owner: 'lib/ui/screen-components/un-protected/layout/app-bar/index.tsx',
    usedBy: 'every mock spec — LoginPage.open()'
  },
  {
    testId: 'customer-cart-trigger',
    owner: 'lib/ui/screen-components/un-protected/layout/app-bar/index.tsx',
    usedBy: 'cart and checkout specs'
  },
  {
    testId: 'language-menu-trigger',
    owner: 'lib/ui/screen-components/un-protected/layout/app-bar/index.tsx',
    usedBy: 'localisation specs'
  },
  {
    testId: 'theme-toggle',
    owner: 'lib/ui/screen-components/un-protected/layout/app-bar/index.tsx',
    usedBy: 'theme specs'
  },
  {
    testId: 'restaurant-card-',
    owner: 'restaurant listing card',
    usedBy: 'discovery specs',
    dynamic: true
  },
  // These are currently present. They stay listed so a future merge that drops
  // them fails here instead of 60 seconds into a browser run.
  { testId: 'customer-auth-dialog', owner: 'auth dialog', usedBy: 'login specs' },
  { testId: 'customer-cart', owner: 'cart drawer', usedBy: 'cart specs' },
  { testId: 'add-to-cart', owner: 'product dialog', usedBy: 'cart specs' },
  { testId: 'go-to-checkout', owner: 'cart drawer', usedBy: 'checkout specs' },
  { testId: 'checkout-page', owner: 'checkout screen', usedBy: 'checkout specs' },
  { testId: 'checkout-total', owner: 'checkout screen', usedBy: 'checkout + order specs' },
  { testId: 'place-order', owner: 'checkout screen', usedBy: 'the real-order smoke' },
  {
    testId: 'product-card-',
    owner: 'menu item card',
    usedBy: 'menu, cart and order specs',
    dynamic: true
  },
  {
    testId: 'cart-item-',
    owner: 'cart line item',
    usedBy: 'cart specs and the real-order smoke',
    dynamic: true
  }
]

function sourceFiles(directory: string): string[] {
  let entries
  try {
    entries = readdirSync(directory, { withFileTypes: true })
  } catch {
    return []
  }
  return entries.flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) return []
      return sourceFiles(path)
    }
    return SOURCE_EXTENSIONS.some((extension) => entry.name.endsWith(extension)) ? [path] : []
  })
}

const files = SOURCE_DIRECTORIES.flatMap((directory) =>
  sourceFiles(join(WEB_APP_ROOT, directory))
)
const sources = new Map(files.map((file) => [file, readFileSync(file, 'utf8')]))

test('CW-CONTRACT-001 Customer Web keeps every QA test id the browser suites select on', () => {
  expect(
    files.length,
    `found no Customer Web source under ${WEB_APP_ROOT} — is the app checked out?`
  ).toBeGreaterThan(0)

  const missing: string[] = []

  for (const { testId, owner, usedBy, dynamic } of REQUIRED_TEST_IDS) {
    // A static id appears verbatim; a dynamic one appears as a template prefix.
    const needle = dynamic ? `${testId}$` : testId
    const found = [...sources.entries()].some(([, source]) => source.includes(needle))
    if (found) continue
    missing.push(
      [
        `  ✗ data-testid="${testId}${dynamic ? '${…}' : ''}"`,
        `      restore in : ${owner}`,
        `      needed by  : ${usedBy}`
      ].join('\n')
    )
  }

  expect(
    missing,
    missing.length === 0
      ? ''
      : [
          '',
          `${missing.length} QA test id(s) are missing from the Customer Web app.`,
          'Every browser spec that selects one fails with a 60s timeout that looks',
          'like a UI bug. Restore the attributes below, then rerun the mock suite.',
          '',
          ...missing,
          '',
          `Scanned ${files.length} source files under ${relative(process.cwd(), WEB_APP_ROOT)}/{${SOURCE_DIRECTORIES.join(',')}}.`,
          'Reference implementation: git show cea2ec27 -- enatega-multivendor-web',
          ''
        ].join('\n')
  ).toEqual([])
})
