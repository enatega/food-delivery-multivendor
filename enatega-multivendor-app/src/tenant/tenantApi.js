import { TENANT_RESOLVER_BASE } from './tenantTypes'

/**
 * Fetch mobile-safe public config for a tenant slug from the trusted resolver.
 * Never use an apiBaseUrl from a QR code directly — always go through this function.
 */
export async function fetchTenantConfig(slug) {
  const url = `${TENANT_RESOLVER_BASE}/api/tenants/mobile-config/${encodeURIComponent(slug)}`
  let response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new Error('NETWORK_ERROR')
  }

  if (response.status === 404) throw new Error('TENANT_NOT_FOUND')
  if (response.status === 410) throw new Error('TENANT_EXPIRED')
  if (response.status === 429) throw new Error('RATE_LIMITED')
  if (!response.ok) throw new Error('TENANT_API_ERROR')

  const data = await response.json()
  if (!data.slug || !data.apiBaseUrl) throw new Error('INVALID_RESPONSE')
  return data
}

/**
 * Parse a QR scan string into a tenant slug.
 * Supports: plain slug, deep link, HTTPS URL with /t/ path, JSON payload.
 * Returns null if the payload cannot be recognized.
 */
export function extractSlugFromPayload(raw) {
  const trimmed = (raw || '').trim()
  if (!trimmed) return null

  // JSON: { "tenantId": "foo" } or { "slug": "foo" }
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed)
      const slug = parsed.tenantId || parsed.slug
      return isValidSlug(slug) ? slug : null
    } catch {
      return null
    }
  }

  // Deep link: enatega://tenant/foo or enategamultivendor://tenant/foo
  const deepMatch = trimmed.match(/^(?:enatega|enategamultivendor):\/\/tenant\/([a-z0-9][a-z0-9-]{0,49})/i)
  if (deepMatch) return deepMatch[1].toLowerCase()

  // HTTPS URL with /t/ segment: https://demo.enatega.com/t/foo
  const tPathMatch = trimmed.match(/\/t\/([a-z0-9][a-z0-9-]{0,49})/i)
  if (tPathMatch) return tPathMatch[1].toLowerCase()

  // Plain slug: foo-bar-1234
  if (isValidSlug(trimmed)) return trimmed.toLowerCase()

  return null
}

function isValidSlug(s) {
  return typeof s === 'string' && /^[a-z0-9][a-z0-9-]{0,49}$/i.test(s)
}

export function humanizeError(code) {
  switch (code) {
    case 'TENANT_NOT_FOUND':   return 'Business not found. Please check the QR code or code.'
    case 'TENANT_EXPIRED':     return 'This business demo has expired.'
    case 'TENANT_DISABLED':    return 'This business is currently unavailable.'
    case 'NETWORK_ERROR':      return 'No internet connection. Please try again.'
    case 'RATE_LIMITED':       return 'Too many attempts. Please wait a moment.'
    case 'INVALID_QR':         return 'Invalid QR code. Please scan a valid business QR.'
    case 'INVALID_RESPONSE':   return 'Unable to load business configuration. Please try again.'
    default:                   return 'Something went wrong. Please try again.'
  }
}
