import { expect, test as base } from '@playwright/test'

import { CustomerApp } from '../../src/pages/customer/customer-app.js'

type CustomerFixtures = {
  customerApp: CustomerApp
}

export const test = base.extend<CustomerFixtures>({
  customerApp: async ({ page }, use) => {
    await use(new CustomerApp(page))
  }
})

export { expect }
