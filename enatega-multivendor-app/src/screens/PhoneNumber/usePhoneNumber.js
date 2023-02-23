import { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { updateUser } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { phoneRegex } from '../../utils/regex'
import { useNavigation, useRoute } from '@react-navigation/native'
import UserContext from '../../context/User'
import i18n from '../../../i18n'

const UPDATEUSER = gql`
  ${updateUser}
`

const useRegister = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(null)

  const [countryCode, setCountryCode] = useState('PK')
  const [country, setCountry] = useState({
    callingCode: ['92'],
    cca2: 'PK',
    currency: ['PKR'],
    flag: 'flag-pk',
    name: 'Pakistan',
    region: 'Asia',
    subregion: 'Southern Asia'
  })

  const onCountrySelect = country => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const { profile } = useContext(UserContext)
  const { refetchProfile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const [mutate, { loading }] = useMutation(UPDATEUSER, {
    onCompleted,
    onError
  })

  function validateCredentials() {
    let result = true

    if (!phone) {
      setPhoneError(i18n.t('mobileErr1'))
      result = false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(i18n.t('mobileErr2'))
      result = false
    }
    return result
  }

  async function onCompleted(data) {
    FlashMessage({
      message: 'Phone number has been added successfully!.'
    })
    await refetchProfile()
    navigation.navigate({ name: 'PhoneOtp', merge: true, params: route.params })
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
        phone: '+'.concat(country.callingCode[0]).concat(phone),
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
    registerAction
  }
}

export default useRegister
