import { GET_SINGLE_VENDOR_DISCOVERY } from '../apollo/queries'

// Must match the variables Home queries with, so the warmed cache entry is reused.
export const SINGLE_VENDOR_DISCOVERY_VARIABLES = { previewLimit: 10, dealLimit: 5 }

// Fills the single-vendor Apollo cache (and its public token, via the request
// link) in the background while the user is in multi-vendor, so switching modes
// renders Home from cache instead of waiting on the network.
export const prewarmSingleVendor = (client) => {
  if (!client) return Promise.resolve(null)
  return client
    .query({ query: GET_SINGLE_VENDOR_DISCOVERY, variables: SINGLE_VENDOR_DISCOVERY_VARIABLES })
    .catch(() => null)
}
