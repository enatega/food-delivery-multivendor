import { useState, useContext } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { emailRegex, passRegex, nameRegex, phoneRegex } from '../../utils/regex'
import { useNavigation, useRoute } from '@react-navigation/native'
import i18n from '../../../i18n'

const useRegister = () => {
  const navigation = useNavigation()
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

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  function validateCredentials() {
    let result = true

    setEmailError(null)
    setPasswordError(null)
    setPhoneError(null)
    setFirstnameError(null)
    setLastnameError(null)

    if (!email) {
      setEmailError(i18n.t('emailErr1'))
      result = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailError(i18n.t('emailErr2'))
      result = false
    }

    if (!password) {
      setPasswordError(i18n.t('passErr1'))
      result = false
    } else if (passRegex.test(password) !== true) {
      setPasswordError(i18n.t('passErr2'))
      result = false
    }

    if (!phone) {
      setPhoneError(i18n.t('mobileErr1'))
      result = false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(i18n.t('mobileErr2'))
      result = false
    }

    if (!firstname) {
      setFirstnameError(i18n.t('firstnameErr1'))
      result = false
    } else if (!nameRegex.test(firstname)) {
      setFirstnameError(i18n.t('firstnameErr2'))
      result = false
    }

    if (!lastname) {
      setLastnameError(i18n.t('lastnameErr1'))
      result = false
    } else if (!nameRegex.test(lastname)) {
      setLastnameError(i18n.t('lastnameErr2'))
      result = false
    }
    return result
  }

  function registerAction() {
    if (validateCredentials()) {
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
    currentTheme
  }
}

export default useRegister
