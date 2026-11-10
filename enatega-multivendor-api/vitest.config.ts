import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);

export default defineConfig({
  resolve: {
    // Match Node's resolution (graphql@16 has no "exports" map, so Node loads the CJS build).
    // Vite would otherwise pick index.mjs and create a second graphql instance.
    alias: { graphql: require.resolve('graphql') },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/setup.ts'],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    fileParallelism: false,
    pool: 'forks',
  },
});
