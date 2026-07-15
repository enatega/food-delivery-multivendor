// Central key for the Railway tenant resolver — the only trusted source for tenant config
export const TENANT_RESOLVER_BASE = 'https://saas-demo-production-233c.up.railway.app'

// AsyncStorage keys owned by the tenant module
export const TENANT_STORAGE_KEY = '_tenant_config'
export const TENANT_SLUG_KEY = '_tenant_slug'

// Keys to wipe when the user switches tenant
export const CLEAR_KEYS_ON_SWITCH = [
  'token',
  'cartItems',
  'restaurant',
  'coupon',
  'searches',
  'location',
  '_sys_cache_v2',
  '_device_fp_id',
  '_session_ttl',
  '@lastNotificationHandledId',
  'enatega-language',
  'enatega-language-name',
  'hyp-session-id',
]
