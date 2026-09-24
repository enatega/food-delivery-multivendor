import type { BrowserContext } from '@playwright/test'

type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>

export function createCustomerOnlyAuthState(
  state: StorageState,
  customerOrigin: string
): StorageState {
  const allowedOrigin = new URL(customerOrigin).origin

  return {
    cookies: [],
    origins: state.origins.filter(({ origin }) => origin === allowedOrigin)
  }
}
