function stripQueryAndHash(url = '') {
  return url.split('#')[0].split('?')[0]
}

function getUrlSearchParams(url = '') {
  try {
    return new URL(url).searchParams
  } catch (_error) {
    return null
  }
}

function decodeBase64Url(value = '') {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '=')
    return atob(normalized)
  } catch (_error) {
    return null
  }
}

function getCloudFrontPolicyExpiresAt(url = '') {
  const params = getUrlSearchParams(url)
  const policy = params?.get('Policy')
  if (!policy) return null

  try {
    const decodedPolicy = decodeBase64Url(policy)
    if (!decodedPolicy) return null

    const parsedPolicy = JSON.parse(decodedPolicy)
    const epochLessThan = parsedPolicy?.Statement?.[0]?.Condition?.DateLessThan?.['AWS:EpochTime']
    const expiresAt = Number(epochLessThan) * 1000
    return Number.isFinite(expiresAt) ? expiresAt : null
  } catch (_error) {
    return null
  }
}

function getSignedUrlExpiresAt(url = '') {
  const cloudFrontExpires = url.match(/[?&]Expires=(\d+)/i)
  if (cloudFrontExpires) {
    const expiresAt = Number(cloudFrontExpires[1]) * 1000
    return Number.isFinite(expiresAt) ? expiresAt : null
  }

  const policyExpiresAt = getCloudFrontPolicyExpiresAt(url)
  if (policyExpiresAt !== null) return policyExpiresAt

  const params = getUrlSearchParams(url)
  const amzDate = params?.get('X-Amz-Date')
  const amzExpires = params?.get('X-Amz-Expires')
  if (amzDate && amzExpires) {
    const match = amzDate.match(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/
    )
    if (match) {
      const [, year, month, day, hour, minute, second] = match
      const issuedAt = Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second)
      )
      const expiresAt = issuedAt + (Number(amzExpires) * 1000)
      return Number.isFinite(expiresAt) ? expiresAt : null
    }
  }

  return null
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
