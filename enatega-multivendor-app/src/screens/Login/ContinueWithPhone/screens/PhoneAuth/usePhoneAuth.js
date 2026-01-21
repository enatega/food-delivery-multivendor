import { useState, useContext, useRef, useEffect, useCallback } from 'react'
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
import { useNavigation, useFocusEffect } from '@react-navigation/native'
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
  const pendingPhoneAuthDataRef = useRef(null)
  const referralCallbacksRef = useRef({ onContinue: null, onSkip: null })

  const { country, setCountry, currentCountry: countryCode, setCurrentCountry: setCountryCode, isLoading: isCountryLoading } = useCountryFromIP()

  const [mutateLoginWithPhoneFirstStep, { data: loginWithPhoneFirstStepData, loading: loginWithPhoneFirstStepLoading, error: loginWithPhoneFirstStepError }] = useMutation(loginWithPhoneFirstStep, {
    onCompleted: loginWithPhoneFirstStepOnCompleted,
    onError
  })

  const [mutateloginWithPhoneFinalStep, { data: loginWithPhoneFinalStepData, loading: loginWithPhoneFinalStepLoading, error: loginWithPhoneFinalStepError }] = useMutation(loginWithPhoneFinalStep, {
    onCompleted: loginWithPhoneFinalStepOnCompleted,
    onError: loginWithPhoneFinalStepOnError
  })

  const [mutateonBoardingComplete, { data: onBoardingCompleteData, loading: onBoardingCompleteLoading, error: onBoardingCompleteError }] = useMutation(onBoardingComplete, {
    onCompleted: onBoardingCompleteOnCompleted,
    onError
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
      if (otp.length === 6) {
        // Clear any previous OTP errors
        setOtpError(null)
        
        // Store phone and OTP data for referral screen
        const phoneAuthData = {
          phone: phone,
          otp: otp
        }
        pendingPhoneAuthDataRef.current = phoneAuthData
        
        // Navigate to RefralScreen instead of directly calling mutation
        console.log('📱 Navigating to RefralScreen after OTP verification...')
        // Use the callbacks from ref (they should be set by now via useEffect)
        navigation.navigate('RefralScreen', {
          phoneAuthData: phoneAuthData,
          onContinue: referralCallbacksRef.current.onContinue,
          onSkip: referralCallbacksRef.current.onSkip
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

  // Handle referral continue with code for phone auth
  const handleReferralContinue = useCallback(async (referralCode) => {
    const phoneAuthData = pendingPhoneAuthDataRef.current
    if (!phoneAuthData) {
      console.error('❌ No pending phone auth data continue')
      return
    }

    console.log('🔐 Logging in user with phone and referral code:', referralCode)
    try {
      mutateloginWithPhoneFinalStep({
        variables: {
          phone: phoneAuthData.phone,
          otp: phoneAuthData.otp,
          referralCode: referralCode || null
        }
      })
      // Don't clear pending data here - only clear on success in onCompleted
      // This allows retry if OTP is wrong
    } catch (error) {
      console.error('❌ Error in handleReferralContinue:', error)
      FlashMessage({
        message: error.message || 'Login failed. Please try again.'
      })
    }
  }, [mutateloginWithPhoneFinalStep])

  // Handle referral skip for phone auth
  const handleReferralSkip = useCallback(async () => {
    const phoneAuthData = pendingPhoneAuthDataRef.current
    if (!phoneAuthData) {
      navigation.goBack();
      console.error('❌ No pending phone auth data here')
      return
    }

    console.log('🔐 Logging in user with phone without referral code')
    try {
      mutateloginWithPhoneFinalStep({
        variables: {
          phone: phoneAuthData.phone,
          otp: phoneAuthData.otp,
          referralCode: null
        }
      })
      // Don't clear pending data here - only clear on success in onCompleted
      // This allows retry if OTP is wrong
    } catch (error) {
      console.error('❌ Error in handleReferralSkip:', error)
      FlashMessage({
        message: error.message || 'Login failed. Please try again.'
      })
    }
  }, [mutateloginWithPhoneFinalStep, navigation])

  // Store callbacks in ref for navigation params
  useEffect(() => {
    referralCallbacksRef.current = {
      onContinue: handleReferralContinue,
      onSkip: handleReferralSkip
    }
  }, [handleReferralContinue, handleReferralSkip])

  // Navigation listener to handle fallback case when callbacks don't work
  useFocusEffect(
    useCallback(() => {
      const params = navigation.getState()?.routes?.find(r => r.name === 'PhoneAuth' || r.name === 'VerifyPhoneNumber')?.params
      if (params) {
        const { referralCode, referralSkipped } = params
        const phoneAuthData = pendingPhoneAuthDataRef.current
        
        if (phoneAuthData) {
          if (referralCode) {
            console.log('🔐 Handling referral code from navigation params:', referralCode)
            handleReferralContinue(referralCode)
            // Clear params
            navigation.setParams({ referralCode: undefined })
          } else if (referralSkipped) {
            console.log('🔐 Handling referral skip from navigation params')
            handleReferralSkip()
            // Clear params
            navigation.setParams({ referralSkipped: undefined })
          }
        }
      }
    }, [navigation, handleReferralContinue, handleReferralSkip])
  )

  function loginWithPhoneFinalStepOnCompleted(data) {
    try {
      // Clear pending data only on successful login
      pendingPhoneAuthDataRef.current = null
      setOtpError(null)
      setOtp('')
      
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

  function onError(error) {
    FlashMessage({
      message: error.graphQLErrors[0].message
    })
  }

  function loginWithPhoneFinalStepOnError(error) {
    const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || ''
    
    if (errorMessage === 'Invalid OTP' || errorMessage.includes('OTP') || errorMessage.includes('otp')) {
      console.log('❌ Invalid OTP detected, navigating back to VerifyPhoneNumber')
      
      // Set OTP error state
      setOtpError('The code you entered is incorrect.')
      
      // Clear the OTP state so user can enter a new one
      setOtp('')
      
      // Preserve phone number but clear the wrong OTP from pending data
      const phoneAuthData = pendingPhoneAuthDataRef.current
      if (phoneAuthData) {
        // Keep phone number for retry, but clear OTP so user can enter new one
        pendingPhoneAuthDataRef.current = {
          phone: phoneAuthData.phone,
          otp: '' // Clear wrong OTP
        }
      }
      
      // Navigate back to VerifyPhoneNumber screen
      // Check if we're currently on RefralScreen
      const currentRoute = navigation.getState()?.routes?.[navigation.getState()?.index]
      if (currentRoute?.name === 'RefralScreen') {
        navigation.navigate('VerifyPhoneNumber', {
          phone: phoneAuthData?.phone || phone
        })
      } else {
        // Fallback: try to go back
        navigation.navigate('VerifyPhoneNumber', {
          phone: phoneAuthData?.phone || phone
        })
      }
      
      FlashMessage({
        message: 'The code you entered is incorrect. Please try again.'
      })
    } else {
      // Handle other errors
      FlashMessage({
        message: errorMessage || 'Login failed. Please try again.'
      })
    }
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
    onBoardingCompleteLoading,

    handleReferralContinue,
    handleReferralSkip
  }
}
