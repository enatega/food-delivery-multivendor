// Copies non-TS runtime assets (GraphQL SDL) into dist after `tsc`.
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'dist/graphql'), { recursive: true });
cpSync(join(root, 'src/graphql/schema'), join(root, 'dist/graphql/schema'), { recursive: true });
console.log('Copied GraphQL schema to dist/graphql/schema');
