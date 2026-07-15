/**
 * Dynamic Expo config — extends app.json with per-tenant overrides baked in
 * at EAS build time via environment variables.
 *
 * Variables consumed (all optional — fall back to defaults):
 *   TENANT_SLUG        slug of the hardcoded tenant (e.g. "natra-1a2b")
 *   TENANT_APP_NAME    app name shown on launcher  (e.g. "NATRA Delivery")
 *   TENANT_ICON_URL    public URL of the tenant logo — downloaded by
 *                      scripts/prepare-tenant-icon.js before the build
 */
module.exports = ({ config }) => {
  const tenantSlug = process.env.TENANT_SLUG || null
  const tenantName = process.env.TENANT_APP_NAME || null
  // prepare-tenant-icon.js downloads the logo to this path before expo prebuild
  const customIconPath = './assets/tenant-icon.png'
  const hasCustomIcon  = Boolean(tenantSlug && process.env.TENANT_ICON_URL)

  return {
    ...config,
    name:   tenantName || config.name,
    icon:   hasCustomIcon ? customIconPath : config.icon,
    android: {
      ...config.android,
      adaptiveIcon: hasCustomIcon
        ? { foregroundImage: customIconPath, backgroundColor: '#000000' }
        : config.android?.adaptiveIcon,
    },
    extra: {
      ...config.extra,
      tenantSlug: tenantSlug,
      tenantName: tenantName,
    },
  }
}
