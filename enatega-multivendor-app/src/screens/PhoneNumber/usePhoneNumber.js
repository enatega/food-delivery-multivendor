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

const UPDATEUSER = gql`
  ${updateUser}
`

const useRegister = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(null)
  const configuration = useContext(ConfigurationContext)
  console.log(configuration)
  const isFocused = useIsFocused()
  const [countryCode, setCountryCode] = useState('')
  const [currentCountry, setCurrentCountry] = useState(null)
  const [ipAddress, setIpAddress] = useState(null)
  const [countryCallingCode, setCountryCallingCode] = useState(null)
  const [count, setCount] = useState(0)

  const retryCount = 3 // Number of retries
  let currentRetry = 0

  const [country, setCountry] = useState({
    callingCode: [],
    cca2: '',
    currency: ['PKR'],
    flag: '',
    name: 'Pakistan',
    region: 'Asia',
    subregion: 'Southern Asia'
  })

  const fetchIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org/?format=json')
      const data = await response.json()

      setIpAddress(data.ip)

      const response2 = await fetch(`https://ipinfo.io/${data.ip}/json`)
      const data2 = await response2.json()
      console.log(data2)
      setCurrentCountry(data2.country)
      setCountryCode(data2.country)

      return currentCountry
    } catch (error) {
      console.error('Error getting IP address:', error)

      if (currentRetry < retryCount) {
        // Retry the request
        currentRetry++
        console.log('Retrying...')
        return fetchIpAddress()
      }
    }

    // If all retries fail, you can return a default value or handle the error as needed.
    return null
  }

  useEffect(() => {
    const initializeCountry = async () => {
      try {
        const res = await fetchIpAddress()
        console.log(res)
        console.log(currentCountry)
        if (res) {
          const callingCode = countryCallingCodes[currentCountry]
          if (callingCode) {
            setCountry({
              ...country,
              callingCode: [callingCode.toString()],
              cca2: currentCountry,
              flag: 'flag-' + currentCountry
            })
          } else {
            console.log('Unknown')
          }
        } else {
          setCount(count + 1)
          console.log('Failed to fetch IP address.')
        }
      } catch (error) {
        console.error('Error initializing country:', error)
      }
    }

    initializeCountry()
  }, [count])

  const onCountrySelect = country => {
    console.log(country)
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
      setPhoneError(t('mobileErr1'))
      result = false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(t('mobileErr2'))
      result = false
    }
    return result
  }

  async function onCompleted(data) {
    if (navigation && route && profile) {
      if (configuration.twilioEnabled) {
        FlashMessage({
          message: 'Phone number has been added successfully!'
        })
        await refetchProfile()
        navigation.navigate({
          name: 'PhoneOtp',
          merge: true,
          params: route.params
        })
      } else {
        mutate({
          variables: {
            name: profile.name,
            phone: '+'.concat(country.callingCode[0]).concat(phone),
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
