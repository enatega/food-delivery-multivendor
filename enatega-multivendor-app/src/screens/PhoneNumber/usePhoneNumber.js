import { useState, useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { updateUser } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useNavigation, useRoute } from '@react-navigation/native'
import UserContext from '../../context/User'
import countryCallingCodes from './countryCodes'
import ConfigurationContext from '../../context/Configuration'
import { useTranslation } from 'react-i18next'
import { useCountryFromIP } from '../../utils/useCountryFromIP'
import { getPhoneExample, isValidPhoneNumber, toE164 } from '../../utils/phone'

const UPDATEUSER = gql`
  ${updateUser}
`

const useRegister = () => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(null)
  const configuration = useContext(ConfigurationContext)
  const { name } = route?.params
 

  const {
      country,
      setCountry,
      currentCountry: countryCode,
      setCurrentCountry: setCountryCode,
      ipAddress,
      isLoading: isCountryLoading,
      error: countryError,
      refetch
    } = useCountryFromIP()


 

  const onCountrySelect = country => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const { profile } = useContext(UserContext)
  const { refetchProfile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}

  useEffect(() => {
    console.log('[PhoneChange][PhoneNumber] Screen state', {
      prevScreen: route?.params?.prevScreen ?? null,
      sourceScreen: route?.params?.screen ?? null,
      hasProfile: Boolean(profile),
      hasExistingPhone: Boolean(profile?.phone),
      twilioEnabled: configuration?.twilioEnabled ?? null,
      country: country?.cca2 ?? null
    })
  }, [
    configuration?.twilioEnabled,
    country?.cca2,
    profile,
    route?.params?.prevScreen,
    route?.params?.screen
  ])

  const [mutate, { loading }] = useMutation(UPDATEUSER, {
    onCompleted,
    onError
  })

  function validateCredentials() {
    let result = true

    if (!phone) {
      console.log('[PhoneChange][PhoneNumber] Validation failed: empty phone')
      setPhoneError(t('mobileErr1'))
      result = false
    } else if (!isValidPhoneNumber(phone, country?.cca2)) {
      console.log('[PhoneChange][PhoneNumber] Validation failed: invalid phone', {
        country: country?.cca2 ?? null,
        inputLength: phone.length
      })
      const example = getPhoneExample(country?.cca2)
      setPhoneError(example ? t('mobileErrFormat', { example }) : t('mobileErr2'))
      result = false
    }
    console.log('[PhoneChange][PhoneNumber] Validation result', { valid: result })
    return result
  }

  async function onCompleted(data) {
    console.log('[PhoneChange][PhoneNumber] Direct verified update completed', {
      returnedUser: Boolean(data?.updateUser?._id),
      returnedPhoneVerified: data?.updateUser?.phoneIsVerified ?? null,
      prevScreen: route?.params?.prevScreen ?? null
    })
    await refetchProfile()
    console.log('[PhoneChange][PhoneNumber] Navigating directly to Main/Profile')
    navigation.navigate('Main', { screen: 'Profile' })
  }
  function onError(error) {
    console.log('[PhoneChange][PhoneNumber] updateUser failed', {
      message: error?.message ?? null,
      hasNetworkError: Boolean(error?.networkError),
      graphQLErrorCount: error?.graphQLErrors?.length ?? 0
    })
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }

  async function mutateRegister() {
    console.log('[PhoneChange][PhoneNumber] Starting direct verified update', {
      country: country?.cca2 ?? null,
      inputLength: phone.length,
      nextPhoneIsVerified: true
    })
    mutate({
      variables: {
        name: profile.name,
        phone: toE164(phone, country?.cca2),
        phoneIsVerified: true
      }
    })
  }

  function registerAction() {
    console.log('[PhoneChange][PhoneNumber] Send code pressed')
    if (!validateCredentials()) return

    if (!configuration.twilioEnabled) {
      mutateRegister()
      return
    }

    const concatPhone = toE164(phone, country?.cca2)
    console.log('[PhoneChange][PhoneNumber] Navigating to PhoneOtp without pre-saving phone', {
      prevScreen: route?.params?.prevScreen ?? null,
      sourceScreen: route?.params?.screen ?? null,
      normalizedPhoneLength: concatPhone.length
    })
    navigation.navigate({
      name: 'PhoneOtp',
      merge: true,
      params: {name, phone: concatPhone, screen: route?.params?.screen, prevScreen: route?.params?.prevScreen}
    })
  }
  return {
    phone,
    setPhone,
    phoneError,
    country,
    countryCode,
    onCountrySelect,
    themeContext,
    currentTheme,
    loading,
    registerAction,
    setPhoneError,
    isCountryLoading
  }
}

export default useRegister
