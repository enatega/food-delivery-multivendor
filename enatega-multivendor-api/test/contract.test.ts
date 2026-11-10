import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runContractCheck } from '../scripts/check-client-contract.js';
import { buildSchema } from '../src/graphql/schema.js';

describe('schema', () => {
  it('builds with a validated input schema for every input scalar', () => {
    expect(() => buildSchema()).not.toThrow();
  });

  const hasClients = existsSync(join(import.meta.dirname, '..', '..', 'enatega-multivendor-app'));
  it.skipIf(!hasClients)('accepts every GraphQL document used by the client apps', () => {
    const errors: string[] = [];
    const r = runContractCheck((m) => errors.push(m));
    expect(errors).toEqual([]);
    expect(r.operations).toBeGreaterThan(800);
  });
});
