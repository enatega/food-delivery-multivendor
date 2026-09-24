/**
 * How Customer Web namespaces localStorage.
 *
 * Since main's single-vendor work, most keys are scoped by app mode:
 * `@enatega/multi/<key>` (getModeStorageKey in
 * enatega-multivendor-web/lib/mode/storage.ts). Reading or seeding a bare
 * legacy key such as `token` or `restaurant` reaches nothing — it is always
 * null — so specs must use the scoped name. A handful of shared keys (theme,
 * locale, the mode itself) stay unscoped.
 *
 * Values here are plain strings so they can be passed into `addInitScript` and
 * `page.evaluate`, which run in the browser and cannot close over imports.
 */
export const APP_MODE = 'MULTI'
export const APP_MODE_STORAGE_KEY = '@enatega/app-mode'
export const MODE_KEY_PREFIX = `@enatega/${APP_MODE.toLowerCase()}/`

export const modeKey = (key: string) => `${MODE_KEY_PREFIX}${key}`
