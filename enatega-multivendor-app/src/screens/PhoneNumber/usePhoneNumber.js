import { useState, useContext } from 'react'
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

  const [mutate, { loading }] = useMutation(UPDATEUSER, {
    onCompleted,
    onError
  })

  function validateCredentials() {
    let result = true

    if (!phone) {
      setPhoneError(t('mobileErr1'))
      result = false
    } else if (!isValidPhoneNumber(phone, country?.cca2)) {
      const example = getPhoneExample(country?.cca2)
      setPhoneError(example ? t('mobileErrFormat', { example }) : t('mobileErr2'))
      result = false
    }
    return result
  }

  async function onCompleted(data) {
    await refetchProfile()
    navigation.navigate('Main', { screen: 'Profile' })
  }
  function onError(error) {
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
    mutate({
      variables: {
        name: profile.name,
        phone: toE164(phone, country?.cca2),
        phoneIsVerified: true
      }
    })
  }

  function registerAction() {
    if (!validateCredentials()) return

    if (!configuration.twilioEnabled) {
      mutateRegister()
      return
    }

    const concatPhone = toE164(phone, country?.cca2)
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
