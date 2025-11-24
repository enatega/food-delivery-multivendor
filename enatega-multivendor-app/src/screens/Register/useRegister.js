import { useState, useContext } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { emailRegex, passRegex, nameRegex, phoneRegex } from '../../utils/regex'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { phoneExist } from '../../apollo/mutations'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { Alert } from 'react-native'
import { useCountryFromIP } from '../../utils/useCountryFromIP'

const PHONE = gql`
  ${phoneExist}
`

const useRegister = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const route = useRoute()
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState(route.params?.email || '')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [firstnameError, setFirstnameError] = useState(null)
  const [lastnameError, setLastnameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [phoneError, setPhoneError] = useState(null)

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


  const [phoneExist, { loading }] = useMutation(PHONE, {
    onCompleted,
    onError
  })

  const onCountrySelect = (country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }

  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  function validateCredentials() {
    let result = true

    setEmailError(null)
    setPasswordError(null)
    setPhoneError(null)
    setFirstnameError(null)
    setLastnameError(null)

    if (!email) {
      setEmailError(t('emailErr1'))
      result = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailError(t('emailErr2'))
      result = false
    }

    if (!password) {
      setPasswordError(t('passErr1'))
      result = false
    } else if (passRegex.test(password) !== true) {
      setPasswordError(t('passErr2'))
      result = false
    }

    if (!phone) {
      setPhoneError(t('mobileErr1'))
      result = false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(t('mobileErr2'))
      result = false
    }

    if (!firstname) {
      setFirstnameError(t('firstnameErr1'))
      result = false
    } else if (!nameRegex.test(firstname)) {
      setFirstnameError(t('firstnameErr2'))
      result = false
    }

    if (!lastname) {
      setLastnameError(t('lastnameErr1'))
      result = false
    } else if (!nameRegex.test(lastname)) {
      setLastnameError(t('lastnameErr2'))
      result = false
    }
    return result
  }

  function registerAction() {
    if (validateCredentials()) {
      phoneExist({
        variables: { phone: ''.concat('+', country.callingCode[0], phone) }
      })
    }
  }

  function onCompleted({ phoneExist }) {
    console.log('phoneExist', phoneExist)
    if (phoneExist  && phoneExist?.phone) {
      // FlashMessage({
      //   message: t('phoneNumberExist')
      // })

      Alert.alert(
        '',
        t('AlreadyExsistsAlert'),
        [
          {
            text: t('close'),
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: t('Confirm'),
            onPress: () => {
              navigation.navigate('EmailOtp', {
                user: {
                  phone: '+'.concat(country.callingCode[0]).concat(phone),
                  email: email.toLowerCase().trim(),
                  password: password,
                  name: firstname + ' ' + lastname
                },
                isPhoneExists: true
              })
            }
          }
        ],
        { cancelable: true }
      )
    } else {
      navigation.navigate('EmailOtp', {
        user: {
          phone: '+'.concat(country.callingCode[0]).concat(phone),
          email: email.toLowerCase().trim(),
          password: password,
          name: firstname + ' ' + lastname
        }
      })
    }
  }

  function onError(error) {
    try {
      // if (error.graphQLErrors[0]?.extensions?.exception.messageCode === 'NETWORK_ERROR') {
      //   Alert.alert(
      //     '',
      //     t('restaurantClosed'),
      //     [
      //       {
      //         text: t('close'),
      //         onPress: () => {},
      //         style: 'cancel'
      //       },
      //       {
      //         text: t('Confirm'),
      //         onPress: () => {}
      //       }
      //     ],
      //     { cancelable: true }
      //   )
      // } else {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
      // }
    } catch (e) {
      FlashMessage({
        message: t('phoneCheckingError')
      })
    }
  }

  return {
    email,
    setEmail,
    emailError,
    firstname,
    setFirstname,
    firstnameError,
    lastname,
    setLastname,
    lastnameError,
    password,
    setPassword,
    passwordError,
    phone,
    setPhone,
    phoneError,
    showPassword,
    setShowPassword,
    country,
    countryCode,
    registerAction,
    onCountrySelect,
    themeContext,
    currentTheme,
    setPhoneError,
    isCountryLoading
  }
}

export default useRegister
