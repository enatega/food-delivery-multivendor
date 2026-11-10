import type { z } from 'zod';
import type { GraphQLContext } from './context.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Resolver<TArgs = any, TParent = any, TResult = unknown> = (
  parent: TParent,
  args: TArgs,
  ctx: GraphQLContext,
  info: any,
) => TResult | Promise<TResult>;

export type ResolverMap = Record<string, Record<string, Resolver | { subscribe: Resolver; resolve?: Resolver }>>;

export interface GraphQLModule {
  name: string;
  resolvers: ResolverMap;
  /** zod schemas for the input scalars declared in schema/01-inputs.graphql */
  inputs?: Record<string, z.ZodType>;
}

export const defineModule = (m: GraphQLModule): GraphQLModule => m;
