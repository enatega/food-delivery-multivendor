import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

import { expect, test } from '@playwright/test'
import { parseAllDocuments } from 'yaml'

/**
 * CM-CONTRACT-001 — every Maestro flow must still be runnable against the app
 * source it was written for.
 *
 * The iOS suites cannot run on a hosted CI runner: Maestro needs a BUILT app,
 * and the build is a local, patched, multi-minute affair (see MOBILE-IOS.md).
 * So a change that breaks a flow is normally discovered hours later, on a
 * simulator, as a 30-second "Element not found" timeout that reads like a UI
 * bug. This catches the static half of that on every push, in milliseconds:
 *
 *   1. every flow parses into Maestro's two-document shape;
 *   2. every `runFlow` it calls exists on disk;
 *   3. every `id:` it selects on is still instrumented in the app source.
 *
 * (3) is the one that matters most. It is exactly the failure Customer Web has
 * already suffered twice — an upstream merge silently dropping test IDs — and
 * CW-CONTRACT-001 guards the web half. This guards the mobile half, and it
 * derives the required IDs from the flows themselves, so it can never drift
 * from what the flows actually use.
 *
 * It cannot prove a flow PASSES — a control can exist and still be off-screen
 * or behind a modal. That remains the simulator run's job.
 */

const QA_ROOT = resolve('.')
const MONOREPO_ROOT = resolve('..')

const WORKSPACES = [
  {
    name: 'customer',
    flows: 'maestro/customer',
    sources: ['enatega-multivendor-app/src', 'enatega-multivendor-app/App.js']
  },
  {
    name: 'store',
    flows: 'maestro/store',
    sources: ['enatega-multivendor-store/lib', 'enatega-multivendor-store/app']
  },
  {
    name: 'rider',
    flows: 'maestro/rider',
    sources: ['enatega-multivendor-rider/lib', 'enatega-multivendor-rider/app']
  }
] as const

// IDs that belong to iOS itself rather than to any app under test.
// `spotlight-pill` is SpringBoard: launch.yaml asserts it is ABSENT to detect a
// crash back to the home screen, so it will never appear in app source.
const PLATFORM_IDS = new Set(['spotlight-pill'])

const SOURCE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx']
const SKIPPED_DIRECTORIES = new Set(['node_modules', 'ios', 'android', '.expo', 'build', 'dist'])

function walk(path: string, keep: (file: string) => boolean): string[] {
  if (!existsSync(path)) return []
  if (statSync(path).isFile()) return keep(path) ? [path] : []
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) return []
    return walk(join(path, entry.name), keep)
  })
}

function readSources(roots: readonly string[]): string {
  return roots
    .flatMap((root) =>
      walk(join(MONOREPO_ROOT, root), (file) =>
        SOURCE_EXTENSIONS.some((extension) => file.endsWith(extension))
      )
    )
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n')
}

function flowFiles(workspace: string): string[] {
  return walk(join(QA_ROOT, workspace), (file) => file.endsWith('.yaml'))
    // config.yaml is Maestro's workspace manifest, not a flow.
    .filter((file) => !file.endsWith('/config.yaml'))
    .sort()
}

type Parsed = { file: string; config: unknown; commands: unknown }

function parseFlow(file: string): Parsed {
  const documents = parseAllDocuments(readFileSync(file, 'utf8'))
  if (!Array.isArray(documents)) throw new Error('empty file')
  const errors = documents.flatMap((document) => document.errors)
  if (errors.length > 0) throw new Error(errors[0].message)
  if (documents.length !== 2) {
    throw new Error(`expected a config document and a command list, found ${documents.length} document(s)`)
  }
  return { file, config: documents[0].toJS(), commands: documents[1].toJS() }
}

/** Every value under a key named `key`, at any depth. */
function collect(node: unknown, key: string, found: unknown[] = []): unknown[] {
  if (Array.isArray(node)) {
    for (const child of node) collect(child, key, found)
  } else if (node && typeof node === 'object') {
    for (const [name, value] of Object.entries(node)) {
      if (name === key) found.push(value)
      collect(value, key, found)
    }
  }
  return found
}

/**
 * Reduce a Maestro `id:` selector to what must literally exist in source.
 *
 * Maestro matches `id` as an anchored regex, so flows escape their dots
 * (`customer\.cart\.item\..*\.quantity`) and use wildcards and `${VARS}` for
 * IDs that only exist at runtime. The literal part before the first dynamic
 * token is the contract: a dynamic source ID like
 * `` `customer.cart.item.${key}` `` must still start with it.
 */
export function staticPrefix(selector: string): { prefix: string; complete: boolean } {
  let prefix = ''
  for (let index = 0; index < selector.length; index += 1) {
    const character = selector[index]
    const next = selector[index + 1]
    if (character === '\\' && next !== undefined) {
      prefix += next
      index += 1
    } else if (character === '$' && next === '{') {
      return { prefix, complete: false }
    } else if (character === '.' && next === '*') {
      return { prefix, complete: false }
    } else if ('([|*+?^'.includes(character)) {
      return { prefix, complete: false }
    } else {
      prefix += character
    }
  }
  return { prefix, complete: true }
}

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * What the source can produce, beyond whole string literals. Components build
 * IDs two ways a literal search cannot see:
 *
 *   - a template with a static head: `` `store.auth.mode.${value}` `` renders
 *     `store.auth.mode.multi`, so the flow's literal is satisfied by the head;
 *   - a composed tail: the rider switch renders `` `${testID}.on` `` from a base
 *     its parent passes in, so `rider.availability.toggle.on` is the literal
 *     base `rider.availability.toggle` plus the tail `.on`.
 */
export function sourceShapes(source: string): { heads: string[]; tails: string[] } {
  const heads = [...source.matchAll(/`([^`$]+)\$\{/g)].map((match) => match[1])
  const tails = [...source.matchAll(/`\$\{[^}]+\}([^`$]+)`/g)].map((match) => match[1])
  return { heads: [...new Set(heads)], tails: [...new Set(tails)] }
}

export function isInstrumented(
  selector: string,
  source: string,
  shapes: { heads: string[]; tails: string[] }
): boolean {
  const { prefix, complete } = staticPrefix(selector)
  const literal = (id: string) => new RegExp(`['"\`]${escapeForRegex(id)}['"\`]`).test(source)
  const byHead = (id: string) => shapes.heads.some((head) => id.startsWith(head) && id.length > head.length)

  if (!complete) {
    // A dynamic selector needs its literal part to open some string in source,
    // or to extend a template head the source renders.
    return new RegExp(`['"\`]${escapeForRegex(prefix)}`).test(source) || byHead(prefix)
  }
  if (literal(prefix) || byHead(prefix)) return true
  return shapes.tails.some((tail) => {
    if (!prefix.endsWith(tail) || prefix.length <= tail.length) return false
    const base = prefix.slice(0, -tail.length)
    return literal(base) || byHead(base)
  })
}

for (const workspace of WORKSPACES) {
  test.describe(`${workspace.name} flows`, () => {
    const files = flowFiles(workspace.flows)

    test('the workspace contains flows', () => {
      expect(files.length, `no flows found under ${workspace.flows}`).toBeGreaterThan(0)
    })

    test('every flow parses into a config document and a command list', () => {
      const broken = files.flatMap((file) => {
        try {
          const { config, commands } = parseFlow(file)
          if (!config || typeof config !== 'object' || !('appId' in config)) {
            return [`${relative(QA_ROOT, file)}: config document has no appId`]
          }
          if (!Array.isArray(commands)) {
            return [`${relative(QA_ROOT, file)}: second document is not a command list`]
          }
          return []
        } catch (error) {
          return [`${relative(QA_ROOT, file)}: ${(error as Error).message}`]
        }
      })
      expect(broken, broken.join('\n')).toEqual([])
    })

    test('every runFlow target exists', () => {
      const missing = files.flatMap((file) => {
        const { commands } = parseFlow(file)
        return collect(commands, 'runFlow').flatMap((target) => {
          // `runFlow: path.yaml` or `runFlow: { file: path.yaml, ... }`. The
          // inline form (`runFlow: { commands: [...] }`) names no file.
          const path =
            typeof target === 'string'
              ? target
              : target && typeof target === 'object' && 'file' in target
                ? String((target as { file: unknown }).file)
                : undefined
          if (!path) return []
          const absolute = resolve(dirname(file), path)
          return existsSync(absolute)
            ? []
            : [`${relative(QA_ROOT, file)} → ${path} (resolves to ${relative(QA_ROOT, absolute)})`]
        })
      })
      expect(missing, `runFlow targets that do not exist:\n${missing.join('\n')}`).toEqual([])
    })

    test('every selected test ID is still instrumented in the app', () => {
      const source = readSources(workspace.sources)
      expect(source.length, `no source read from ${workspace.sources.join(', ')}`).toBeGreaterThan(0)

      const selectors = new Map<string, string[]>()
      for (const file of files) {
        for (const value of collect(parseFlow(file).commands, 'id')) {
          if (typeof value !== 'string') continue
          const users = selectors.get(value) ?? []
          users.push(relative(QA_ROOT, file))
          selectors.set(value, users)
        }
      }

      const shapes = sourceShapes(source)
      const missing: string[] = []
      for (const [selector, users] of selectors) {
        if (PLATFORM_IDS.has(selector)) continue
        const { prefix, complete } = staticPrefix(selector)
        if (prefix.length === 0) {
          missing.push(`${selector} — no literal prefix to verify (used by ${users[0]})`)
          continue
        }
        if (!isInstrumented(selector, source, shapes)) {
          const where = [...new Set(users)].slice(0, 3).join(', ')
          missing.push(`${prefix}${complete ? '' : '…'} — selected by ${where}`)
        }
      }

      expect(
        missing,
        `Test IDs the ${workspace.name} flows select on that no longer exist in ` +
          `${workspace.sources.join(' / ')}. Restore the testID, or update the flow:\n` +
          missing.join('\n')
      ).toEqual([])
    })
  })
}

test.describe('staticPrefix', () => {
  test('keeps a plain ID whole', () => {
    expect(staticPrefix('customer.tab.discovery')).toEqual({ prefix: 'customer.tab.discovery', complete: true })
  })

  test('unescapes dots and stops at a wildcard', () => {
    expect(staticPrefix('customer\\.cart\\.item\\..*\\.quantity')).toEqual({
      prefix: 'customer.cart.item.',
      complete: false
    })
  })

  test('stops at a runtime variable', () => {
    expect(staticPrefix('customer.item.option.${OPTION_ID}')).toEqual({
      prefix: 'customer.item.option.',
      complete: false
    })
  })

  test('accepts a literal that a template head renders', () => {
    const source = 'testID={`store.auth.mode.${option.value}`}'
    expect(isInstrumented('store.auth.mode.multi', source, sourceShapes(source))).toBe(true)
  })

  test('accepts a literal composed from a base and a component tail', () => {
    const source = 'testID="rider.availability.toggle" ... testID={`${testID}.on`}'
    expect(isInstrumented('rider.availability.toggle.on', source, sourceShapes(source))).toBe(true)
  })

  test('still rejects an ID nothing in the source can produce', () => {
    const source = 'testID="customer.cart.screen" testID={`customer.cart.item.${key}`}'
    expect(isInstrumented('customer.checkout.total', source, sourceShapes(source))).toBe(false)
  })

  test('stops at an alternation group', () => {
    expect(staticPrefix('customer\\.orders\\.(active\\.card\\..*|active\\.empty)')).toEqual({
      prefix: 'customer.orders.',
      complete: false
    })
  })
})
