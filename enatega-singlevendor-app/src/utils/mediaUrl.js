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

export { isAbsoluteMediaUrl, isDomainLikeMediaUrl, normalizeMediaUrl }
