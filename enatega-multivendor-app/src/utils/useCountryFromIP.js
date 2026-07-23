import { useEffect, useState } from 'react'
import * as Localization from 'expo-localization'
import countryCallingCodes from '../screens/PhoneNumber/countryCodes'

function getDeviceRegionCode() {
  try {
    const locales =
      typeof Localization.getLocales === 'function'
        ? Localization.getLocales()
        : []
    return locales?.[0]?.regionCode || Localization.region || 'PK'
  } catch {
    return 'PK'
  }
}

function buildCountryFromRegion(code) {
  const normalizedCode = code || 'PK'
  const callingCode = countryCallingCodes[normalizedCode] || countryCallingCodes.PK || '92'
  return {
    callingCode: [callingCode.toString()],
    cca2: normalizedCode,
    currency: [],
    flag: 'flag-' + normalizedCode.toLowerCase(),
    name: normalizedCode,
    region: '',
    subregion: ''
  }
}

// SEC-008: The previous implementation sent the user's IP to api.ipify.org and
// then ipinfo.io on every mount, disclosing PII to third parties with no
// consent. Country is now derived on-device from the locale/region — no network
// request is made and no IP is collected. The hook API is unchanged for callers.
export const useCountryFromIP = () => {
  const initialRegion = getDeviceRegionCode()
  const [country, setCountry] = useState(buildCountryFromRegion(initialRegion))
  const [currentCountry, setCurrentCountry] = useState(initialRegion)
  // Kept for backwards compatibility with consumers; no IP is ever collected.
  const [ipAddress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trigger, setTrigger] = useState(0)

  const detectCountry = () => {
    setIsLoading(true)
    setError(null)
    try {
      const locales =
        typeof Localization.getLocales === 'function'
          ? Localization.getLocales()
          : []
      const code = locales?.[0]?.regionCode || Localization.region || null

      if (code) {
        setCurrentCountry(code)
        setCountry(buildCountryFromRegion(code))
      }
    } catch (err) {
      console.error('Error determining country from device locale:', err)
      setError('Failed to determine country from device locale.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    detectCountry()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  const refetch = () => {
    setTrigger((prev) => prev + 1)
  }

  return {
    country,
    currentCountry,
    setCurrentCountry,
    ipAddress,
    isLoading,
    error,
    refetch,
    setCountry
  }
}
