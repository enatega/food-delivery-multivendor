import type { Page } from '@playwright/test'

import { inspectGraphqlRequest } from '../../../../src/safety/graphql-read-only-guard.js'

export type ProductionReadOnlyMonitor = {
  allowedOperations: string[]
  blockedOperations: string[]
}

export async function installProductionReadOnlyGuard(
  page: Page
): Promise<ProductionReadOnlyMonitor> {
  const monitor: ProductionReadOnlyMonitor = {
    allowedOperations: [],
    blockedOperations: []
  }

  await page.route('**/graphql', async (route) => {
    let body: unknown
    try {
      body = route.request().postDataJSON()
    } catch {
      body = undefined
    }

    const inspection = inspectGraphqlRequest(body)
    if (inspection.allowed) {
      monitor.allowedOperations.push(inspection.operationName)
      await route.continue()
      return
    }

    monitor.blockedOperations.push(inspection.operationName)
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        errors: [
          {
            message:
              'Blocked by Customer Web production read-only automation guard'
          }
        ]
      })
    })
  })

  return monitor
}
