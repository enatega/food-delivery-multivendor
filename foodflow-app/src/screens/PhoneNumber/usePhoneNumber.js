import { useState, useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { updateUser } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { phoneRegex } from '../../utils/regex'
import { useNavigation, useRoute } from '@react-navigation/native'
import UserContext from '../../context/User'
import countryCallingCodes from './countryCodes'
import { useIsFocused } from '@react-navigation/native'
import ConfigurationContext from '../../context/Configuration'
import { useTranslation } from 'react-i18next'
import { useCountryFromIP } from '../../utils/useCountryFromIP'

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
  const isFocused = useIsFocused()
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
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(t('mobileErr2'))
      result = false
    }
    return result
  }

  async function onCompleted(data) {
    let concatPhone = '+'.concat(country.callingCode[0] ?? "").concat(phone ?? "")
    if (navigation && route && profile) {
      if (configuration.twilioEnabled) {
        FlashMessage({
          message: 'Phone number has been added successfully!'
        })
        await refetchProfile()
        navigation.navigate({
          name: 'PhoneOtp',
          merge: true,
          params: {name, phone: concatPhone, screen: route?.params?.screen}
        })
      } else {
        mutate({
          variables: {
            name: profile.name,
            phone: concatPhone,
            phoneIsVerified: true
          }
        })
        if (isFocused) {
          navigation.navigate({
            name: 'Profile'
          })
        }
      }
    }
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
        phone: '+'.concat(country.callingCode[0] ?? "").concat(phone ?? ""),
        phoneIsVerified: false
      }
    })
  }

  function registerAction() {
    if (validateCredentials()) {
      mutateRegister()
    }
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
