import { makeExecutableSchema } from '@graphql-tools/schema';
import { parse, Kind, type GraphQLSchema } from 'graphql';
import { z } from 'zod';
import { loadTypeDefs } from './load-schema.js';
import { DateTimeScalar, inputScalar, JSONScalar, TimestampScalar } from './scalars.js';
import type { GraphQLModule, ResolverMap } from './module.js';
import { modules } from '../modules/index.js';

function mergeResolvers(list: GraphQLModule[]): ResolverMap {
  const out: ResolverMap = {};
  for (const m of list) {
    for (const [type, fields] of Object.entries(m.resolvers)) {
      out[type] ??= {};
      for (const [field, fn] of Object.entries(fields)) {
        if (out[type]![field]) throw new Error(`Resolver ${type}.${field} is defined twice (module ${m.name})`);
        out[type]![field] = fn;
      }
    }
  }
  return out;
}

export function buildSchema(opts: { strictInputs?: boolean } = {}): GraphQLSchema {
  const typeDefs = loadTypeDefs();
  const doc = parse(typeDefs);
  const declaredScalars = doc.definitions
    .filter((d) => d.kind === Kind.SCALAR_TYPE_DEFINITION)
    .map((d) => (d.kind === Kind.SCALAR_TYPE_DEFINITION ? d.name.value : ''));

  const inputSchemas: Record<string, z.ZodType> = {};
  for (const m of modules) Object.assign(inputSchemas, m.inputs ?? {});

  const scalarResolvers: Record<string, unknown> = { JSON: JSONScalar, DateTime: DateTimeScalar, Timestamp: TimestampScalar };
  const missing: string[] = [];
  for (const name of declaredScalars) {
    if (scalarResolvers[name]) continue;
    const zs = inputSchemas[name];
    if (!zs) missing.push(name);
    scalarResolvers[name] = inputScalar(name, zs ?? z.unknown());
  }
  if (missing.length && opts.strictInputs !== false) {
    throw new Error(`Missing zod schemas for input scalars: ${missing.join(', ')}`);
  }

  const resolvers = mergeResolvers(modules);
  resolvers.Query = { ...(resolvers.Query ?? {}), _health: () => 'ok' };
  resolvers.Mutation = { ...(resolvers.Mutation ?? {}), _noop: () => true };

  return makeExecutableSchema({
    typeDefs: doc,
    resolvers: [scalarResolvers as never, resolvers as never],
    resolverValidationOptions: { requireResolversToMatchSchema: 'error' },
  });
}
