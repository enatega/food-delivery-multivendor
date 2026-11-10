/**
 * Client contract check.
 *
 * Extracts every GraphQL document (gql`` tags, `#graphql` strings and plain
 * template strings that start with query/mutation/subscription/fragment) from
 * the client applications in this monorepo and validates them against the
 * server schema. Fails (exit 1) on any validation error that is not listed in
 * KNOWN_EXCEPTIONS.
 *
 * Usage: npm run check:contract [-- --root ../]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parse as babelParse } from '@babel/parser';
import {
  buildASTSchema,
  parse,
  validate,
  visit,
  Kind,
  type DocumentNode,
  type FragmentDefinitionNode,
  type DefinitionNode,
} from 'graphql';
import { loadTypeDefs } from '../src/graphql/load-schema.js';

const CLIENT_APPS = [
  'enatega-multivendor-app',
  'enatega-multivendor-web',
  'enatega-multivendor-rider',
  'enatega-multivendor-store',
  'enatega-multivendor-admin',
  'enatega-singlevendor-admin',
  'lib',
];

/** Documents that are known to be invalid and are not used at runtime. */
const KNOWN_EXCEPTIONS: { file: string; operation: string; reason: string }[] = [
  {
    file: 'enatega-multivendor-rider/lib/apollo/queries/order/order-2.query.ts',
    operation: 'GetRecentOrderRestaurants',
    reason:
      'Dead code (never imported): spreads RestaurantPreviewFields on recentOrderRestaurantsPreview, which returns RestaurantCarouselPreview for the customer app and web.',
  },
  {
    file: 'enatega-multivendor-app/src/apollo/queries.js',
    operation: '<anonymous>',
    reason: 'Dead code (export `versions` is never imported): selects AppVersion objects without subfields; the app uses `getVersions` instead.',
  },
];

const argRoot = process.argv.indexOf('--root');
const repoRoot = resolve(argRoot > -1 ? process.argv[argRoot + 1] : join(import.meta.dirname, '..', '..'));

function walk(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.') || name === 'cypress' || name === 'dist') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(js|jsx|ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) out.push(p);
  }
}

type AnyNode = { type?: string; [k: string]: unknown };
function traverse(node: unknown, fn: (n: AnyNode) => void): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const n of node) traverse(n, fn);
    return;
  }
  const n = node as AnyNode;
  if (typeof n.type === 'string') fn(n);
  for (const key of Object.keys(n)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key.endsWith('Comments')) continue;
    const v = n[key];
    if (v && typeof v === 'object') traverse(v, fn);
  }
}

interface Extracted {
  file: string;
  line: number;
  doc: DocumentNode;
}

function extract(app: string): { docs: Extracted[]; fragments: Map<string, FragmentDefinitionNode> } {
  const files: string[] = [];
  const appDir = join(repoRoot, app);
  try {
    walk(appDir, files);
  } catch {
    return { docs: [], fragments: new Map() };
  }
  const consts = new Map<string, AnyNode>();
  const asts: [string, AnyNode][] = [];
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    if (!src.includes('`')) continue;
    let ast: AnyNode;
    try {
      ast = babelParse(src, {
        sourceType: 'unambiguous',
        plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy'],
        errorRecovery: true,
      }) as unknown as AnyNode;
    } catch {
      continue;
    }
    asts.push([file, ast]);
    traverse(ast, (n) => {
      if (n.type !== 'VariableDeclarator') return;
      const id = n.id as AnyNode & { name?: string };
      let init = n.init as AnyNode | undefined;
      if (!init || id?.type !== 'Identifier') return;
      if (init.type === 'TaggedTemplateExpression') init = init.quasi as AnyNode;
      if (init.type === 'TemplateLiteral' || init.type === 'StringLiteral') consts.set(id.name!, init);
    });
  }
  const render = (node: AnyNode, depth = 0): string => {
    if (node.type === 'StringLiteral') return node.value as string;
    const quasis = node.quasis as { value: { cooked?: string; raw: string } }[];
    const exprs = node.expressions as AnyNode[];
    let s = '';
    quasis.forEach((q, i) => {
      s += q.value.cooked ?? q.value.raw;
      const e = exprs[i];
      if (!e) return;
      if (e.type === 'Identifier' && depth < 5) {
        const c = consts.get(e.name as string);
        if (c) {
          s += render(c, depth + 1);
          return;
        }
      }
      s += ' ';
    });
    return s;
  };
  const docs: Extracted[] = [];
  const fragments = new Map<string, FragmentDefinitionNode>();
  const seen = new Set<string>();
  for (const [file, ast] of asts) {
    traverse(ast, (n) => {
      if (n.type !== 'TemplateLiteral') return;
      const raw = render(n);
      const t = raw.trim().replace(/^(#[^\n]*\n\s*)+/, '');
      if (!/^(query|mutation|subscription|fragment)\b/.test(t) && !/^\{\s*\w+/.test(t)) return;
      let doc: DocumentNode;
      try {
        doc = parse(raw);
      } catch {
        return;
      }
      const line = (n.loc as { start: { line: number } }).start.line;
      const key = `${file}:${line}`;
      if (seen.has(key)) return;
      seen.add(key);
      for (const def of doc.definitions) if (def.kind === Kind.FRAGMENT_DEFINITION) fragments.set(def.name.value, def);
      docs.push({ file: relative(repoRoot, file), line, doc });
    });
  }
  return { docs, fragments };
}

/** Apollo strips `@client` fields before sending a request; do the same. */
function stripClientFields(doc: DocumentNode): DocumentNode {
  return visit(doc, {
    Field(node) {
      if (node.directives?.some((d) => d.name.value === 'client')) return null;
      return undefined;
    },
  });
}

function withFragments(doc: DocumentNode, fragments: Map<string, FragmentDefinitionNode>): DocumentNode {
  const defs: DefinitionNode[] = [...doc.definitions];
  const have = new Set(defs.filter((d) => d.kind === Kind.FRAGMENT_DEFINITION).map((d) => (d as FragmentDefinitionNode).name.value));
  let added = true;
  while (added) {
    added = false;
    const needed = new Set<string>();
    visit({ kind: Kind.DOCUMENT, definitions: defs } as DocumentNode, {
      FragmentSpread(node) {
        needed.add(node.name.value);
      },
    });
    for (const name of needed) {
      if (!have.has(name) && fragments.has(name)) {
        defs.push(fragments.get(name)!);
        have.add(name);
        added = true;
      }
    }
  }
  return { ...doc, definitions: defs };
}

const schema = buildASTSchema(parse(loadTypeDefs()));
let operations = 0;
let failures = 0;
let excepted = 0;
for (const app of CLIENT_APPS) {
  const { docs, fragments } = extract(app);
  for (const { file, line, doc } of docs) {
    const ops = doc.definitions.filter((d) => d.kind === Kind.OPERATION_DEFINITION);
    if (ops.length === 0) continue;
    operations += ops.length;
    const full = stripClientFields(withFragments(doc, fragments));
    const errors = validate(schema, full).filter((e) => !/Fragment ".*" is never used/.test(e.message));
    if (errors.length === 0) continue;
    const opNames = ops.map((o) => (o.kind === Kind.OPERATION_DEFINITION ? o.name?.value ?? '<anonymous>' : ''));
    const exception = KNOWN_EXCEPTIONS.find((e) => e.file === file && opNames.includes(e.operation));
    if (exception) {
      excepted++;
      continue;
    }
    failures++;
    for (const e of errors) console.error(`${file}:${line} [${opNames.join(',')}] ${e.message}`);
  }
}
console.log(`Client contract: ${operations} operations checked, ${failures} invalid documents, ${excepted} known exceptions.`);
process.exit(failures ? 1 : 0);
