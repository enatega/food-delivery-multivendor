import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/** Returns the full SDL (all files in ./schema, sorted by name). */
export function loadTypeDefs(dir = join(here, 'schema')): string {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.graphql'))
    .sort()
    .map((f) => readFileSync(join(dir, f), 'utf8'))
    .join('\n');
}
