function isAbsoluteMediaUrl(url = '') {
  return /^(https?:|file:|content:|data:|blob:|\/\/)/i.test(url)
}

function isDomainLikeMediaUrl(url = '') {
  return /^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$|\?)/i.test(url)
}

function normalizeMediaUrl(remoteUrl, baseUrl = '') {
  if (!remoteUrl || typeof remoteUrl !== 'string') return remoteUrl

  const trimmed = remoteUrl.trim()
  if (!trimmed) return trimmed
  if (isAbsoluteMediaUrl(trimmed)) return trimmed
  if (isDomainLikeMediaUrl(trimmed)) return `https://${trimmed}`
  if (!baseUrl || typeof baseUrl !== 'string') return trimmed

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const relativePath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `${normalizedBase}${relativePath}`
}

function normalizeManagedMediaUrl(remoteUrl, baseUrl = '') {
  const publicMediaMatch = typeof remoteUrl === 'string'
    ? remoteUrl.trim().match(/^public-media\/(.+)$/i)
    : null
  if (publicMediaMatch && baseUrl) {
    return normalizeMediaUrl(`media/${publicMediaMatch[1]}`, baseUrl)
  }

  const normalized = normalizeMediaUrl(remoteUrl, baseUrl)
  if (!normalized || !baseUrl || typeof normalized !== 'string') return normalized

  try {
    const mediaUrl = new URL(normalized)
    if (!/^\/media\/[^/?#]+/i.test(mediaUrl.pathname)) return normalized

    return new URL(`${mediaUrl.pathname}${mediaUrl.search}`, baseUrl).toString()
  } catch (_) {
    return normalized
  }
}

function normalizeSingleVendorMediaUrl(remoteUrl) {
  return normalizeManagedMediaUrl(
    remoteUrl,
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_REST_URL
  )
}

export {
  isAbsoluteMediaUrl,
  isDomainLikeMediaUrl,
  normalizeMediaUrl,
  normalizeManagedMediaUrl,
  normalizeSingleVendorMediaUrl
}
