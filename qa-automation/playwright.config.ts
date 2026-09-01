import { defineConfig, devices } from '@playwright/test'
import { config as loadDotenv } from 'dotenv'

import { validateCustomerWebEnvironment } from './src/config/customer-web-environment.js'

loadDotenv({ path: '.env', quiet: true })

const customerEnvironment = validateCustomerWebEnvironment(process.env)
const runCustomerWebServer =
  (customerEnvironment.mode === 'mock' ||
    customerEnvironment.mode === 'production-readonly') &&
  process.env.QA_START_CUSTOMER_WEB === 'true'
const useFrontendEnvironment = process.env.QA_USE_FRONTEND_ENV === 'true'
const customerAuthState = 'reports/auth/customer.json'
const frontendEnvironment: Record<string, string> = {}

if (useFrontendEnvironment) {
  const result = loadDotenv({
    path: '../enatega-multivendor-web/.env',
    processEnv: frontendEnvironment,
    quiet: true
  })
  if (result.error) throw new Error('Unable to load Customer Web .env')

  const serverUrl = frontendEnvironment.NEXT_PUBLIC_SERVER_URL
  if (!serverUrl) throw new Error('NEXT_PUBLIC_SERVER_URL is required')
  process.env.QA_READ_ONLY_GRAPHQL_URL = new URL('graphql', serverUrl).toString()
}

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // A single shared Customer Web dev server cannot absorb many parallel browser
  // workers without flaking, so cap concurrency whenever we boot it. Override
  // with QA_WEB_WORKERS when running against a faster (production) build.
  workers: runCustomerWebServer
    ? Number(process.env.QA_WEB_WORKERS ?? 1)
    : customerEnvironment.mode === 'qa' && process.env.CI
      ? 1
      : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/playwright.xml' }],
    ['github']
  ],
  use: {
    baseURL: customerEnvironment.baseUrl,
    permissions: ['geolocation'],
    geolocation: {
      latitude: customerEnvironment.latitude,
      longitude: customerEnvironment.longitude
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'customer-setup',
      testMatch: /web\/customer\/setup\/.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'customer-mock-chromium',
      testMatch: /web\/customer\/mock\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'customer-qa-chromium',
      testMatch: /web\/customer\/qa\/.*\.spec\.ts/,
      dependencies: ['customer-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: customerAuthState
      }
    },
    {
      name: 'customer-mobile-chromium',
      testMatch: /web\/customer\/mock\/.*\.spec\.ts/,
      grep: /@mobile/,
      use: { ...devices['Pixel 7'] }
    },
    {
      name: 'customer-production-smoke',
      testMatch: /web\/customer\/production-readonly\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'customer-production-auth-setup',
      testMatch: /web\/customer\/production-auth\/.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        trace: 'off',
        screenshot: 'off',
        video: 'off'
      }
    },
    {
      name: 'customer-production-authenticated',
      testMatch: /web\/customer\/production-auth\/.*\.spec\.ts/,
      dependencies: ['customer-production-auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: customerAuthState,
        trace: 'off',
        screenshot: 'off',
        video: 'off'
      }
    },
    {
      // Places REAL COD orders against the configured backend. Intentionally
      // separate from the read-only projects and never wired into per-push CI.
      name: 'customer-production-order',
      testMatch: /web\/customer\/production-order\/.*\.spec\.ts/,
      dependencies: ['customer-production-auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: customerAuthState,
        trace: 'retain-on-failure',
        video: 'retain-on-failure'
      }
    },
    {
      name: 'customer-firefox',
      testMatch: /web\/customer\/mock\/.*\.spec\.ts/,
      grep: /@cross-browser/,
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'customer-webkit',
      testMatch: /web\/customer\/mock\/.*\.spec\.ts/,
      grep: /@cross-browser/,
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'admin-chromium',
      testMatch: /web\/admin\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'unit',
      testMatch: /unit\/.*\.spec\.ts/
    },
    {
      name: 'preflight',
      testMatch: /preflight\/.*\.spec\.ts/
    }
  ],
  outputDir: 'reports/test-results',
  webServer: runCustomerWebServer
    ? {
        command: 'npm run dev',
        cwd: '../enatega-multivendor-web',
        env: useFrontendEnvironment
          ? frontendEnvironment
          : {
              NEXT_PUBLIC_SERVER_URL: `${customerEnvironment.baseUrl}/__qa-api/`,
              NEXT_PUBLIC_WS_SERVER_URL: `${customerEnvironment.baseUrl.replace(/^http/, 'ws')}/__qa-api/`
            },
        url: customerEnvironment.baseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000
      }
    : undefined
})
