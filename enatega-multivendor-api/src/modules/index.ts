import type { GraphQLModule } from '../graphql/module.js';
import { customersModule } from './customers.js';
import { accountsModule } from './accounts.js';
import { platformModule } from './platform.js';
import { restaurantsModule } from './restaurants.js';
import { menuModule } from './menu.js';
import { catalogModule } from './catalog.js';
import { ordersModule } from './orders.js';
import { singleVendorModule } from './single-vendor.js';
import { ridersModule } from './riders.js';
import { dashboardsModule } from './dashboards.js';

export const modules: GraphQLModule[] = [customersModule, accountsModule, platformModule, restaurantsModule, menuModule, catalogModule, ordersModule, singleVendorModule, ridersModule, dashboardsModule];
