import { expect, test } from '@playwright/test'

import {
  buildMobileRun,
  validateMobileCloudTarget,
  validateMobileMultiVendorEnvironment,
  validateMobileSmokeEnvironment
} from '../../scripts/mobile-runner.js'

const smokeEnvironment = {
  QA_MOBILE_ENV: 'production',
  QA_MOBILE_GRAPHQL_URL: 'https://aws-server-v2.enatega.com/graphql',
  QA_MOBILE_ALLOWED_HOSTNAMES: 'aws-server-v2.enatega.com',
  QA_CUSTOMER_EMAIL: 'maestro-customer@example.test',
  QA_CUSTOMER_PASSWORD: 'not-a-real-secret',
  QA_MOBILE_RESTAURANT_NAME: 'Automation Restaurant',
  QA_MOBILE_PRODUCT_NAME: 'Automation Meal',
  QA_MOBILE_PRODUCT_ID: 'product-456',
  QA_MOBILE_OPTION_ID: 'option-789',
  QA_MOBILE_CURRENCY: 'USD',
  QA_MAX_ORDER_TOTAL: '25.00'
}

test('validates the non-ordering production smoke environment', () => {
  expect(validateMobileSmokeEnvironment(smokeEnvironment)).toEqual({
    appId: 'com.enatega.multivendor.qa',
    graphqlUrl: 'https://aws-server-v2.enatega.com/graphql',
    customerEmail: 'maestro-customer@example.test',
    customerPassword: 'not-a-real-secret',
    restaurantName: 'Automation Restaurant',
    productName: 'Automation Meal',
    productId: 'product-456',
    optionId: 'option-789',
    currency: 'USD',
    maxOrderTotal: 25
  })
})

test('rejects a smoke endpoint outside the exact allowlist', () => {
  expect(() =>
    validateMobileSmokeEnvironment({
      ...smokeEnvironment,
      QA_MOBILE_GRAPHQL_URL: 'https://unexpected.example/graphql'
    })
  ).toThrow('Mobile production hostname is not allowlisted')
})

test('builds a smoke invocation that excludes the production-write flow', () => {
  const run = buildMobileRun('smoke', smokeEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p0-smoke.yaml')
  expect(run.args).toContain('APP_ID=com.enatega.multivendor.qa')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.args).toContain('PRODUCT_ID=product-456')
  expect(run.args).toContain('OPTION_ID=option-789')
  expect(run.reportDirectory).toBe('reports/maestro/run-123')
})

test('builds a regression invocation that runs the read-only P1 directory', () => {
  const run = buildMobileRun('regression', smokeEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p1')
  expect(run.args).toContain('APP_ID=com.enatega.multivendor.qa')
  expect(run.args).toContain('PRODUCT_ID=product-456')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.reportDirectory).toBe('reports/maestro/run-123')
})

test('builds a navigation invocation that runs the read-only P3 directory', () => {
  const run = buildMobileRun('navigation', smokeEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p3')
  expect(run.args).toContain('APP_ID=com.enatega.multivendor.qa')
  expect(run.args).toContain('PRODUCT_ID=product-456')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.reportDirectory).toBe('reports/maestro/run-123')
})

test('rejects a navigation run that fails the read-only environment checks', () => {
  expect(() =>
    buildMobileRun(
      'navigation',
      { ...smokeEnvironment, QA_MOBILE_GRAPHQL_URL: 'https://evil.example.com/graphql' },
      'run-123'
    )
  ).toThrow('Mobile production hostname is not allowlisted')
})

test('rejects a regression run that fails the read-only environment checks', () => {
  expect(() =>
    buildMobileRun(
      'regression',
      { ...smokeEnvironment, QA_MOBILE_ENV: 'staging' },
      'run-123'
    )
  ).toThrow('QA_MOBILE_ENV must be exactly "production"')
})

test('builds the production invocation only after all write guards pass', () => {
  const run = buildMobileRun(
    'production-order',
    {
      ...smokeEnvironment,
      QA_MOBILE_ALLOW_PRODUCTION_WRITES: 'true',
      QA_PLACE_REAL_ORDER: 'true',
      QA_MOBILE_RESTAURANT_ID: 'restaurant-123',
      QA_MOBILE_PRODUCT_ID: 'product-456',
      QA_MOBILE_FULFILLMENT: 'pickup',
      QA_MOBILE_PAYMENT_METHOD: 'COD',
      QA_RUN_ID: 'mobile-20260827-1200-abc1234'
    },
    'run-123'
  )

  expect(run.flow).toBe(
    'maestro/customer/flows/p0-production-order.yaml'
  )
  expect(run.args).toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.args).toContain('RUN_ID=mobile-20260827-1200-abc1234')
})

test('rejects unsafe report path components', () => {
  expect(() => buildMobileRun('smoke', smokeEnvironment, '../escape')).toThrow(
    'report Run ID contains unsupported characters'
  )
})

const multiVendorEnvironment = {
  ...smokeEnvironment,
  QA_MOBILE_SECOND_RESTAURANT_NAME: 'Second Automation Restaurant',
  QA_MOBILE_SECOND_PRODUCT_ID: 'product-999'
}

test('validates the multi-vendor fixtures on top of the read-only environment', () => {
  expect(validateMobileMultiVendorEnvironment(multiVendorEnvironment)).toEqual({
    ...validateMobileSmokeEnvironment(smokeEnvironment),
    secondRestaurantName: 'Second Automation Restaurant',
    secondProductId: 'product-999'
  })
})

test('rejects a multi-vendor run whose second vendor is not a second vendor', () => {
  expect(() =>
    validateMobileMultiVendorEnvironment({
      ...multiVendorEnvironment,
      QA_MOBILE_SECOND_RESTAURANT_NAME: '  automation restaurant  '
    })
  ).toThrow(
    'QA_MOBILE_SECOND_RESTAURANT_NAME must differ from QA_MOBILE_RESTAURANT_NAME'
  )

  expect(() =>
    validateMobileMultiVendorEnvironment({
      ...multiVendorEnvironment,
      QA_MOBILE_SECOND_PRODUCT_ID: 'product-456'
    })
  ).toThrow('QA_MOBILE_SECOND_PRODUCT_ID must differ from QA_MOBILE_PRODUCT_ID')
})

test('rejects a multi-vendor run that is missing its extra fixtures', () => {
  expect(() =>
    validateMobileMultiVendorEnvironment(smokeEnvironment)
  ).toThrow('QA_MOBILE_SECOND_RESTAURANT_NAME is required')
})

test('builds a multi-vendor invocation that stays read-only', () => {
  const run = buildMobileRun('multi-vendor', multiVendorEnvironment, 'run-123')

  expect(run.flow).toBe('maestro/customer/flows/p2')
  expect(run.args).toContain('SECOND_RESTAURANT_NAME=Second Automation Restaurant')
  expect(run.args).toContain('SECOND_PRODUCT_ID=product-999')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.args).not.toContain('FULFILLMENT=pickup')
})

const cloudEnvironment = {
  ...smokeEnvironment,
  QA_MOBILE_APP_FILE: 'builds/EnategaQA.app.zip',
  MAESTRO_CLOUD_API_KEY: 'not-a-real-key'
}

test('validates a cloud target that ships a binary', () => {
  expect(validateMobileCloudTarget(cloudEnvironment)).toMatchObject({
    appFile: 'builds/EnategaQA.app.zip',
    appBinaryId: undefined,
    apiKey: 'not-a-real-key'
  })
})

test('rejects a cloud target with no app to run against', () => {
  expect(() => validateMobileCloudTarget(smokeEnvironment)).toThrow(
    'Cloud runs require QA_MOBILE_APP_FILE'
  )
})

test('rejects a cloud target that names both an app file and a binary id', () => {
  expect(() =>
    validateMobileCloudTarget({
      ...cloudEnvironment,
      QA_MOBILE_APP_BINARY_ID: 'binary-123'
    })
  ).toThrow('Set only one of QA_MOBILE_APP_FILE or QA_MOBILE_APP_BINARY_ID')
})

test('rejects a cloud app file that is not a build artifact', () => {
  expect(() =>
    validateMobileCloudTarget({
      ...cloudEnvironment,
      QA_MOBILE_APP_FILE: 'builds/EnategaQA.tar.gz'
    })
  ).toThrow('QA_MOBILE_APP_FILE must end in')
})

test('builds a cloud smoke invocation that keeps the read-only guards', () => {
  const run = buildMobileRun('smoke', cloudEnvironment, 'run-123', {
    target: 'cloud'
  })

  expect(run.target).toBe('cloud')
  expect(run.args[0]).toBe('cloud')
  expect(run.args).toContain('--app-file=builds/EnategaQA.app.zip')
  expect(run.args).toContain('--flows=maestro/customer')
  expect(run.args).toContain('--include-tags=smoke')
  expect(run.args).toContain('--name=run-123')
  expect(run.args).toContain('--output=reports/maestro/run-123/junit.xml')
  expect(run.args).toContain('--api-key=not-a-real-key')
  expect(run.args).toContain('PRODUCT_ID=product-456')
  expect(run.args).not.toContain('QA_PLACE_REAL_ORDER=true')
  // Cloud has no local simulator and keeps its own artifacts.
  expect(run.args).not.toContain('--platform=ios')
  expect(run.args.some((arg) => arg.startsWith('--test-output-dir'))).toBe(false)
})

test('omits cloud selectors that were not configured', () => {
  const run = buildMobileRun('smoke', cloudEnvironment, 'run-123', {
    target: 'cloud'
  })

  expect(run.args.some((arg) => arg.startsWith('--device-model'))).toBe(false)
  expect(run.args.some((arg) => arg.startsWith('--project-id'))).toBe(false)
  expect(run.args).not.toContain('--async')
})

test('passes cloud device selection through when configured', () => {
  const run = buildMobileRun(
    'regression',
    {
      ...cloudEnvironment,
      QA_MOBILE_CLOUD_DEVICE_MODEL: 'iPhone-17-Pro',
      QA_MOBILE_CLOUD_DEVICE_OS: 'iOS-26-2',
      QA_MOBILE_CLOUD_DEVICE_LOCALE: 'en_US',
      QA_MOBILE_CLOUD_PROJECT_ID: 'project-42'
    },
    'run-123',
    { target: 'cloud', async: true }
  )

  expect(run.args).toContain('--device-model=iPhone-17-Pro')
  expect(run.args).toContain('--device-os=iOS-26-2')
  expect(run.args).toContain('--device-locale=en_US')
  expect(run.args).toContain('--project-id=project-42')
  expect(run.args).toContain('--async')
  expect(run.args).toContain('--flows=maestro/customer')
})

// A cloud upload is rooted at the path given to --flows, so a directory of
// flows uploaded alone cannot see ../../subflows and the run is rejected before
// it starts. Every mode must upload the workspace and select by tag instead.
// Every mode's fixtures at once, so one table can cover all five.
const everyModeEnvironment = {
  ...multiVendorEnvironment,
  ...cloudEnvironment,
  QA_MOBILE_ALLOW_PRODUCTION_WRITES: 'true',
  QA_PLACE_REAL_ORDER: 'true',
  QA_MOBILE_RESTAURANT_ID: 'restaurant-123',
  QA_MOBILE_FULFILLMENT: 'pickup',
  QA_MOBILE_PAYMENT_METHOD: 'COD',
  QA_RUN_ID: 'mobile-20260827-1200-abc1234'
}

const cloudTagSelections = [
  { mode: 'smoke', include: '--include-tags=smoke' },
  { mode: 'production-order', include: '--include-tags=production-write' },
  {
    mode: 'regression',
    include: '--include-tags=regression',
    exclude: '--exclude-tags=multi-vendor,navigation'
  },
  { mode: 'multi-vendor', include: '--include-tags=multi-vendor' },
  { mode: 'navigation', include: '--include-tags=navigation' }
] as const

for (const selection of cloudTagSelections) {
  const { mode, include } = selection
  const exclude = 'exclude' in selection ? selection.exclude : undefined
  test(`uploads the whole workspace and selects ${mode} by tag`, () => {
    const run = buildMobileRun(mode, everyModeEnvironment, 'run-123', {
      target: 'cloud'
    })

    expect(run.args).toContain('--flows=maestro/customer')
    expect(run.args).toContain(include)
    expect(
      run.args.some((arg) => arg.startsWith('--flows=maestro/customer/flows'))
    ).toBe(false)
    if (exclude) {
      expect(run.args).toContain(exclude)
    } else {
      expect(run.args.some((arg) => arg.startsWith('--exclude-tags'))).toBe(false)
    }
  })
}

// p2 and p3 both carry the regression tag, so without the exclusions a
// regression run would silently pull in the multi-vendor and navigation suites.
test('keeps the multi-vendor and navigation suites out of a cloud regression run', () => {
  const run = buildMobileRun('regression', cloudEnvironment, 'run-123', {
    target: 'cloud'
  })

  expect(run.args).toContain('--exclude-tags=multi-vendor,navigation')
})

// Local runs still resolve ../../subflows on disk, so they keep taking a path.
test('leaves the local invocation pointed at a flow path', () => {
  const run = buildMobileRun('regression', smokeEnvironment, 'run-123')

  expect(run.args).toContain('maestro/customer/flows/p1')
  expect(run.args.some((arg) => arg.startsWith('--include-tags'))).toBe(false)
})

test('rejects a malformed cloud device locale', () => {
  expect(() =>
    validateMobileCloudTarget({
      ...cloudEnvironment,
      QA_MOBILE_CLOUD_DEVICE_LOCALE: 'english'
    })
  ).toThrow('QA_MOBILE_CLOUD_DEVICE_LOCALE must be an ISO locale')
})

test('runs a cloud production order only when it can be watched', () => {
  const productionEnvironment = {
    ...cloudEnvironment,
    QA_MOBILE_ALLOW_PRODUCTION_WRITES: 'true',
    QA_PLACE_REAL_ORDER: 'true',
    QA_MOBILE_RESTAURANT_ID: 'restaurant-123',
    QA_MOBILE_FULFILLMENT: 'pickup',
    QA_MOBILE_PAYMENT_METHOD: 'COD',
    QA_RUN_ID: 'mobile-20260827-1200-abc1234'
  }

  const run = buildMobileRun('production-order', productionEnvironment, 'run-123', {
    target: 'cloud'
  })
  expect(run.args).toContain('QA_PLACE_REAL_ORDER=true')
  expect(run.args).toContain('--flows=maestro/customer')
  expect(run.args).toContain('--include-tags=production-write')

  expect(() =>
    buildMobileRun('production-order', productionEnvironment, 'run-123', {
      target: 'cloud',
      async: true
    })
  ).toThrow('production-order cannot run with --async')
})

test('a cloud run still fails the environment guards it shares with local', () => {
  expect(() =>
    buildMobileRun(
      'smoke',
      { ...cloudEnvironment, QA_MOBILE_GRAPHQL_URL: 'https://evil.example.com/graphql' },
      'run-123',
      { target: 'cloud' }
    )
  ).toThrow('Mobile production hostname is not allowlisted')
})

test('defaults to a local run when no target is given', () => {
  const run = buildMobileRun('smoke', cloudEnvironment, 'run-123')

  expect(run.target).toBe('local')
  expect(run.args[0]).toBe('test')
  expect(run.args).toContain('--platform=ios')
  expect(run.args).not.toContain('--api-key=not-a-real-key')
})
