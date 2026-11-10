import type { GraphQLModule } from '../graphql/module.js';
import { customersModule } from './customers.js';

export const modules: GraphQLModule[] = [customersModule];
