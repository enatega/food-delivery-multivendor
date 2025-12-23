import { useState, useContext, useRef, useEffect } from 'react'
import { Alert } from 'react-native'
import _ from 'lodash' // Import lodash
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { loginWithPhoneFirstStep, loginWithPhoneFinalStep, onBoardingComplete } from '../../../../../apollo/mutations'
import ThemeContext from '../../../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../../../utils/themeColors'
import * as Notifications from 'expo-notifications'
import { FlashMessage } from '../../../../../ui/FlashMessage/FlashMessage'
import analytics from '../../../../../utils/analytics'
import AuthContext from '../../../../../context/Auth'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { useCountryFromIP } from '../../../../../utils/useCountryFromIP'
import { phoneRegex } from '../../../../../utils/regex'

export const usePhoneAuth = () => {
  const { t, i18n } = useTranslation()
  const Analytics = analytics()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const { setTokenAsync } = useContext(AuthContext)
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState(null)
  const [verifyPhoneError, setVerifyPhoneError] = useState(null)
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [otpError, setOtpError] = useState(null)

  const { country, setCountry, currentCountry: countryCode, setCurrentCountry: setCountryCode, isLoading: isCountryLoading } = useCountryFromIP()

  const [mutateLoginWithPhoneFirstStep, { data: loginWithPhoneFirstStepData, loading: loginWithPhoneFirstStepLoading, error: loginWithPhoneFirstStepError }] = useMutation(loginWithPhoneFirstStep, {
    onCompleted: loginWithPhoneFirstStepOnCompleted,
    onError: loginWithPhoneFirstStepOnError
  })

  const [mutateloginWithPhoneFinalStep, { data: loginWithPhoneFinalStepData, loading: loginWithPhoneFinalStepLoading, error: loginWithPhoneFinalStepError }] = useMutation(loginWithPhoneFinalStep, {
    onCompleted: loginWithPhoneFinalStepOnCompleted,
    onError: loginWithPhoneFinalStepOnError
  })

  const [mutateonBoardingComplete, { data: onBoardingCompleteData, loading: onBoardingCompleteLoading, error: onBoardingCompleteError }] = useMutation(onBoardingComplete, {
    onCompleted: onBoardingCompleteOnCompleted,
    onError: onBoardingCompleteOnError
  })

  const onCountrySelect = (country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }

  function validatePhoneNumber() {
    let result = true

    setPhoneError(null)

    if (!phone) {
      setPhoneError(t('mobileErr1'))
      result = false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(t('mobileErr2'))
      result = false
    }
    return result
  }

  function loginWithPhoneFirstStepHandler() {
    try {
      if (validatePhoneNumber()) {
        mutateLoginWithPhoneFirstStep({
          variables: {
            phone: ''.concat('+', country.callingCode[0], phone)
          }
        })
      }
    } catch (error) {
      FlashMessage({
        message: t(error)
      })
    }
  }

  function loginWithPhoneFinalStepHandler(phone) {
    try {
      if (otp.length) {
        mutateloginWithPhoneFinalStep({
          variables: {
            phone: phone,
            otp: otp
          }
        })
      }
    } catch (error) {
      FlashMessage({
        message: t(error)
      })
    }
  }

  function onBoardingCompleteHandler() {
    try {
      if (name.length) {
        mutateonBoardingComplete({
          variables: {
            name: name
          }
        })
      }
    } catch (error) {
      FlashMessage({
        message: t(error)
      })
    }
  }

  function loginWithPhoneFirstStepOnCompleted(data) {
    try {
      FlashMessage({
        message: t(data?.loginWithPhoneFirstStep?.message)
      })
      navigation.navigate('VerifyPhoneNumber', {
        phone: ''.concat('+', country.callingCode[0], phone)
      })
    } catch (error) {
      console.log('error=>', error)
    }
  }

  function loginWithPhoneFinalStepOnCompleted(data) {
    try {
      setTokenAsync(data.loginWithPhoneFinalStep.token)
      if (data.loginWithPhoneFinalStep.onboarding) {
        navigation.navigate({
          name: 'Main',
          merge: true
        })
      } else {
        navigation.navigate({
          name: 'OnBoarding'
        })
        FlashMessage({
          message: t('accountCreated')
        })
      }
    } catch (error) {
      console.log('error=>', error)
    }
  }

  function onBoardingCompleteOnCompleted(data) {
    try {
      FlashMessage({
        message: t('userInfoUpdated')
      })
      navigation.navigate({
        name: 'Main',
        merge: true
      })
    } catch (error) {
      console.log('error=>', error)
    }
  }

  function loginWithPhoneFirstStepOnError(error) {
    console.log('onError')
    FlashMessage({
      message: error.graphQLErrors[0].message
    })
  }

  function loginWithPhoneFinalStepOnError(error) {
    // console.log('onError')
    // FlashMessage({
    //   message: error.graphQLErrors[0].message
    // })
    if (error.graphQLErrors[0].message === 'Invalid OTP') {
      setOtpError('The code you entered is incorrect.')
    }
  }

  function onBoardingCompleteOnError(error) {
    FlashMessage({
      message: error.graphQLErrors[0].message
    })
  }

  function loginWithPhoneFirstStepResend(phoneNumber) {
    setVerifyPhoneError(null)
    mutateLoginWithPhoneFirstStep({
      variables: {
        phone: phoneNumber
      }
    })
  }

  return {
    themeContext,
    currentTheme,

    country,
    countryCode,
    onCountrySelect,
    isCountryLoading,

    phone,
    setPhone,
    phoneError,
    setPhoneError,
    loginWithPhoneFirstStepData,
    loginWithPhoneFirstStepLoading,
    loginWithPhoneFirstStepError,
    loginWithPhoneFirstStepResend,
    loginWithPhoneFirstStepHandler,
    verifyPhoneError,
    setVerifyPhoneError,

    otp,
    setOtp,
    otpError,
    setOtpError,
    loginWithPhoneFinalStepHandler,
    loginWithPhoneFinalStepData,
    loginWithPhoneFinalStepLoading,
    loginWithPhoneFinalStepError,

    name,
    setName,
    onBoardingCompleteHandler,
    onBoardingCompleteData,
    onBoardingCompleteError,
    onBoardingCompleteLoading
  }
}
