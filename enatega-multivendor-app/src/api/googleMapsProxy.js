import axios from 'axios'

const DEFAULT_TIMEOUT_MS = 10000

const normalizeBaseUrl = (baseUrl) => {
  if (!baseUrl) {
    throw new Error('Server URL is not configured')
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

const buildUrl = (baseUrl, path) => `${normalizeBaseUrl(baseUrl)}/maps${path}`

const createProxyError = (fallbackMessage, error) => {
  if (axios.isCancel(error)) {
    throw error
  }

  if (error?.response?.data?.error?.message) {
    return new Error(error.response.data.error.message)
  }

  if (error?.code === 'ECONNABORTED') {
    return new Error('Request timed out')
  }

  if (error?.request) {
    return new Error('Network error - check your connection')
  }

  return new Error(fallbackMessage)
}

export const fetchPlaceAutocomplete = async ({
  baseUrl,
  input,
  language = 'en',
  types = 'geocode',
  cancelToken
}) => {
  try {
    const response = await axios.get(buildUrl(baseUrl, '/autocomplete'), {
      params: {
        input,
        language,
        types
      },
      timeout: DEFAULT_TIMEOUT_MS,
      cancelToken
    })

    return response.data.data
  } catch (error) {
    throw createProxyError('Search failed', error)
  }
}

export const fetchPlaceDetails = async ({
  baseUrl,
  placeId,
  language = 'en'
}) => {
  try {
    const response = await axios.get(buildUrl(baseUrl, '/place-details'), {
      params: {
        placeId,
        language
      },
      timeout: DEFAULT_TIMEOUT_MS
    })

    return response.data.data
  } catch (error) {
    throw createProxyError('Unable to load location details', error)
  }
}

export const fetchReverseGeocode = async ({
  baseUrl,
  latitude,
  longitude,
  language = 'en'
}) => {
  try {
    const response = await axios.get(buildUrl(baseUrl, '/reverse-geocode'), {
      params: {
        latitude,
        longitude,
        language
      },
      timeout: DEFAULT_TIMEOUT_MS
    })

    return response.data.data
  } catch (error) {
    throw createProxyError('Unable to fetch address', error)
  }
}
