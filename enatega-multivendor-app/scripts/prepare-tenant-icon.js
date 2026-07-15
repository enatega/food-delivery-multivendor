/**
 * EAS pre-install hook — runs BEFORE npm install in the EAS cloud worker.
 * Downloads the tenant logo from TENANT_ICON_URL and saves it as
 * assets/tenant-icon.png so app.config.js can reference it as the app icon.
 *
 * Only uses Node.js built-ins (no npm packages) since this runs before install.
 */
const https = require('https')
const http  = require('http')
const fs    = require('fs')
const path  = require('path')

const iconUrl = process.env.TENANT_ICON_URL
if (!iconUrl) {
  console.log('[prepare-tenant-icon] TENANT_ICON_URL not set — skipping, default icon will be used')
  process.exit(0)
}

const dest = path.join(__dirname, '..', 'assets', 'tenant-icon.png')
console.log('[prepare-tenant-icon] Downloading icon from:', iconUrl)

// Handle base64 data URLs (PNG or JPEG) directly — no HTTP request needed
if (iconUrl.startsWith('data:')) {
  const match = iconUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/)
  if (!match) {
    console.warn('[prepare-tenant-icon] Unsupported data URL type (only PNG/JPEG/WEBP) — using default icon')
    process.exit(0)
  }
  try {
    const buf = Buffer.from(match[2], 'base64')
    fs.writeFileSync(dest, buf)
    console.log('[prepare-tenant-icon] Icon written from base64 data URL:', dest)
  } catch (e) {
    console.error('[prepare-tenant-icon] Failed to write icon:', e.message)
  }
  process.exit(0)
}

// HTTPS/HTTP URL — download with redirect follow
function download(url, destPath, redirects) {
  if (redirects > 5) {
    console.error('[prepare-tenant-icon] Too many redirects')
    process.exit(0)
  }
  const mod = url.startsWith('https') ? https : http
  mod.get(url, res => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return download(res.headers.location, destPath, redirects + 1)
    }
    if (res.statusCode !== 200) {
      console.error('[prepare-tenant-icon] HTTP', res.statusCode, '— using default icon')
      process.exit(0)
    }
    const file = fs.createWriteStream(destPath)
    res.pipe(file)
    file.on('finish', () => {
      file.close()
      console.log('[prepare-tenant-icon] Icon saved to:', destPath)
    })
    file.on('error', err => {
      fs.unlink(destPath, () => {})
      console.error('[prepare-tenant-icon] Write error:', err.message)
    })
  }).on('error', err => {
    console.error('[prepare-tenant-icon] Download error:', err.message, '— using default icon')
    process.exit(0)
  })
}

download(iconUrl, dest, 0)
