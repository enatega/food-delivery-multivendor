import { GraphQLScalarType, Kind, valueFromASTUntyped, type ValueNode } from 'graphql';
import { z } from 'zod';
import { badInput } from '../lib/errors.js';

function toDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const d = /^\d{10,}$/.test(value) ? new Date(Number(value)) : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 date-time string.',
  serialize(value) {
    const d = toDate(value);
    return d ? d.toISOString() : null;
  },
  parseValue(value) {
    const d = toDate(value);
    if (!d) throw badInput('Invalid DateTime');
    return d;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      const d = toDate(ast.kind === Kind.INT ? Number(ast.value) : ast.value);
      if (d) return d;
    }
    throw badInput('Invalid DateTime');
  },
});

export const TimestampScalar = new GraphQLScalarType({
  name: 'Timestamp',
  description: 'Unix epoch milliseconds as a string.',
  serialize(value) {
    const d = toDate(value);
    return d ? String(d.getTime()) : null;
  },
  parseValue(value) {
    const d = toDate(value);
    if (!d) throw badInput('Invalid Timestamp');
    return d;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      const d = toDate(ast.kind === Kind.INT ? Number(ast.value) : ast.value);
      if (d) return d;
    }
    throw badInput('Invalid Timestamp');
  },
});

export const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'Arbitrary JSON value.',
  serialize: (v) => v,
  parseValue: (v) => v,
  parseLiteral: (ast, variables) => valueFromASTUntyped(ast, variables ?? undefined),
});

function hasVariables(ast: ValueNode): boolean {
  if (ast.kind === Kind.VARIABLE) return true;
  if (ast.kind === Kind.LIST) return ast.values.some(hasVariables);
  if (ast.kind === Kind.OBJECT) return ast.fields.some((f) => hasVariables(f.value));
  return false;
}

function formatIssues(error: z.ZodError): { path: string; message: string }[] {
  return error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
}

/**
 * Builds a scalar that validates its input with a zod schema. Used for every
 * client-facing input/enum type (see the header of schema/00-base.graphql).
 */
export function inputScalar(name: string, schema: z.ZodType, description?: string): GraphQLScalarType {
  const parse = (raw: unknown) => {
    const result = schema.safeParse(raw);
    if (!result.success) {
      const issues = formatIssues(result.error);
      const first = issues[0];
      throw badInput(`Invalid ${name}${first ? `: ${first.path ? `${first.path} ` : ''}${first.message}` : ''}`, {
        validation: issues,
      });
    }
    return result.data;
  };
  return new GraphQLScalarType({
    name,
    description: description ?? `Validated input (${name}).`,
    serialize: (v) => v,
    parseValue: parse,
    parseLiteral: (ast: ValueNode, variables) => {
      // During document validation graphql-js calls parseLiteral without variable values.
      // Literals that embed variables (e.g. `reviewInput: { order: $order }`) are validated
      // at execution time, when the variables are known.
      if (!variables && hasVariables(ast)) return {};
      return parse(valueFromASTUntyped(ast, variables ?? undefined));
    },
  });
}
