function stripQueryAndHash(url = '') {
  return url.split('#')[0].split('?')[0]
}

function getSignedUrlExpiresAt(url = '') {
  const match = url.match(/[?&]Expires=(\d+)/i)
  if (!match) return null

  const expiresAt = Number(match[1]) * 1000
  return Number.isFinite(expiresAt) ? expiresAt : null
}

function isSignedUrlExpired(url, now = Date.now()) {
  const expiresAt = getSignedUrlExpiresAt(url)
  return expiresAt !== null && expiresAt <= now
}

module.exports = {
  getSignedUrlExpiresAt,
  isSignedUrlExpired,
  stripQueryAndHash
}
