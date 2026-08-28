import { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { updateUser } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useNavigation, useRoute } from '@react-navigation/native'
import UserContext from '../../context/User'
import ConfigurationContext from '../../context/Configuration'
import { useTranslation } from 'react-i18next'
import { useCountryFromIP } from '../../utils/useCountryFromIP'
import { getPhoneExample, isValidPhoneNumber, toE164 } from '../../utils/phone'
import { useAppMode } from '../../mode/AppModeContext'
import { getModeProfileTabRoute } from '../../mode/navigation'
import AuthContext from '../../context/Auth'

const UPDATEUSER = gql`
  ${updateUser}
`

const useRegister = () => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()
  const { mode } = useAppMode()
  const route = useRoute()
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(null)
  const configuration = useContext(ConfigurationContext)
  const { name } = route?.params || {}

  const {
    country,
    setCountry,
    currentCountry: countryCode,
    setCurrentCountry: setCountryCode,
    isLoading: isCountryLoading
  } = useCountryFromIP()

  const onCountrySelect = country => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const { token } = useContext(AuthContext)
  const {
    profile,
    refetchProfile,
    loadingProfile
  } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

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

  async function onCompleted() {
    await refetchProfile()
    const profileRoute = getModeProfileTabRoute(mode)
    navigation.navigate(profileRoute.name, profileRoute.params)
  }
  function onError(error) {
    const message =
      error?.graphQLErrors?.[0]?.message ||
      error?.networkError?.result?.errors?.[0]?.message ||
      error?.networkError?.message ||
      t('somethingWentWrong')

    FlashMessage({ message })
  }

  async function mutateRegister() {
    try {
      await mutate({
        variables: {
          name: profile?.name?.trim() || name?.trim() || '',
          phone: toE164(phone, country?.cca2),
          phoneIsVerified: true
        }
      })
    } catch (_error) {
      // Apollo invokes onError for GraphQL/network failures. Keeping this
      // rejection handled prevents the button press from failing silently.
    }
  }

  function registerAction() {
    if (!validateCredentials()) return

    if (!token) {
      FlashMessage({ message: t('loginRequired') })
      navigation.navigate('CreateAccount')
      return
    }

    if (!configuration.twilioEnabled) {
      mutateRegister()
      return
    }

    const concatPhone = toE164(phone, country?.cca2)
    navigation.navigate({
      name: 'PhoneOtp',
      merge: true,
      params: {
        name: profile?.name?.trim() || name?.trim() || '',
        phone: concatPhone,
        screen: route?.params?.screen,
        prevScreen: route?.params?.prevScreen
      }
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
    loading: loading || loadingProfile,
    registerAction,
    setPhoneError,
    isCountryLoading
  }
}

export default useRegister
