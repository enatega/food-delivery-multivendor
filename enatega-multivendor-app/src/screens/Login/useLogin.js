import { useState, useContext, useRef, useEffect, useCallback } from 'react'
import { Alert } from 'react-native'
import _ from 'lodash' // Import lodash
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { login, emailExist } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import * as Notifications from 'expo-notifications'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import analytics from '../../utils/analytics'
import AuthContext from '../../context/Auth'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import useNotifications from '../../utils/useNotifications'

const LOGIN = gql`
  ${login}
`
const EMAIL = gql`
  ${emailExist}
`

export const useLogin = () => {
  const { t, i18n } = useTranslation()
  const Analytics = analytics()

  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const emailRef = useRef('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [registeredEmail, setRegisteredEmail] = useState(false)
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const { setTokenAsync } = useContext(AuthContext)
  
  // Refs to store pending login/registration data for referral screen
  const pendingLoginDataRef = useRef(null) // { email } for login
  const pendingRegistrationDataRef = useRef(null) // { email } for signup
  const referralCallbacksRef = useRef({ onContinue: null, onSkip: null })
  const referralCodeRef = useRef(null) // Store referral code for login
  const { registerForPushNotificationsAsync } = useNotifications()

  const [EmailEixst, { loading }] = useMutation(EMAIL, {
    onCompleted,
    onError
  })

  const [LoginMutation, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: onLoginCompleted,
    onError: onLoginError
  })

  // Update both state and ref
  const handleSetEmail = (newEmail) => {
    setEmail(newEmail)
    emailRef.current = newEmail
    if (emailError) {
      setEmailError(null)
    }
  }

  // Reset password when registeredEmail becomes true
  useEffect(() => {
    if (registeredEmail) {
      if (emailRef.current === 'demo-customer@enatega.com') {
        setPassword('123123')
      } else {
        setPassword('')
      }
    }
  }, [registeredEmail])
  function validateCredentials() {
    let result = true
    setEmailError(null)
    setPasswordError(null)

    // Use the state value for validation
    if (!email.trim()) {
      setEmailError(t('emailErr1'))
      result = false
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
      if (emailRegex.test(email) !== true) {
        setEmailError(t('emailErr2'))
        result = false
      }
    }
    if (!password && registeredEmail) {
      setPasswordError(t('passErr1'))
      result = false
    }
    return result
  }

  function onCompleted({ emailExist }) {
    if (validateCredentials()) {
      if (emailExist && emailExist._id) {
        if (
          emailExist.userType !== 'apple' &&
          emailExist.userType !== 'google' &&
          emailExist.userType !== 'facebook'
        ) {
          //  setRegisteredEmail(true)

          // User exists - store email and navigate to referral screen
          // Password will be entered after returning from referral screen
          pendingLoginDataRef.current = {
            email: emailRef.current
          }
          console.log('📧 User exists - navigating to RefralScreen for login')
          navigation.navigate('RefralScreen', {
            emailAuthData: {
              email: emailRef.current,
              isLogin: true
            },
            onContinue: referralCallbacksRef.current.onContinue,
            onSkip: referralCallbacksRef.current.onSkip
          })
        } else {
          FlashMessage({
            message: `${t('emailAssociatedWith')} ${emailExist.userType} ${t('continueWith')} ${emailExist.userType}`
          })
          navigation.navigate({ name: 'Main', merge: true })
        }
      } else {
        // User doesn't exist - store registration data and navigate to referral screen
        pendingRegistrationDataRef.current = {
          email: emailRef.current
        }
        console.log('📧 User does not exist - navigating to RefralScreen for signup')
        navigation.navigate('RefralScreen', {
          emailAuthData: {
            email: emailRef.current,
            isLogin: false
          },
          onContinue: referralCallbacksRef.current.onContinue,
          onSkip: referralCallbacksRef.current.onSkip
        })
      }
    }
  }

  function onError(error) {
    try {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    } catch (e) {
      FlashMessage({
        message: t('mailCheckingError')
      })
    }
  }

  async function onLoginCompleted(data) {
    // Clear pending login data and referral code on successful login
    pendingLoginDataRef.current = null
    referralCodeRef.current = null
    
    if (data.login.isActive == false) {
      FlashMessage({ message: t('accountDeactivated') })
    } else {
      try {
        await Analytics.identify(
          {
            userId: data.login.userId
          },
          data.login.userId
        )
        await Analytics.track(Analytics.events.USER_LOGGED_IN, {
          userId: data.login.userId,
          name: data.login.name,
          email: data.login.email
        })
        setTokenAsync(data.login.token)
        navigation.navigate({
          name: 'Main',
          merge: true
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  function onLoginError(error) {
    try {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    } catch (e) {
      FlashMessage({ message: t('errorInLoginError') })
    }
  }

  async function loginAction(email, password, referralCode = null) {
    try {
      if (validateCredentials()) {

        let token = null
        token = await registerForPushNotificationsAsync()

        // Use stored referral code if available, otherwise use passed one
        const finalReferralCode = referralCodeRef.current !== null ? referralCodeRef.current : (referralCode || null)
       
        LoginMutation({
          variables: {
            email,
            password,
            type: 'default',
            notificationToken:token,
            referralCode: finalReferralCode
          }
        })
      }
    } catch (e) {
      FlashMessage({
        message: t('errorWhileLogging')
      })
    } finally {
    }
  }
  
  // Handle referral continue with code for email login
  const handleReferralContinue = useCallback(async (referralCode) => {
    const loginData = pendingLoginDataRef.current
    if (!loginData) {
      console.error('❌ No pending login data')
      return
    }

    console.log('🔐 Storing referral code for login:', referralCode)
    // Store referral code and show password field
    referralCodeRef.current = referralCode
    setRegisteredEmail(true)
    // Go back to Login screen to show password field
    navigation.goBack()
  }, [navigation])

  // Handle referral skip for email login
  const handleReferralSkip = useCallback(async () => {
    const loginData = pendingLoginDataRef.current
    if (!loginData) {
      console.error('❌ No pending login data')
      return
    }

    console.log('🔐 Skipping referral code for login')
    // Don't store referral code and show password field
    referralCodeRef.current = null
    setRegisteredEmail(true)
    // Go back to Login screen to show password field
    navigation.goBack()
  }, [navigation])
  
  // Handle referral continue for registration (signup)
  const handleRegistrationReferralContinue = useCallback(async (referralCode) => {
    const registrationData = pendingRegistrationDataRef.current
    if (!registrationData) {
      console.error('❌ No pending registration data')
      return
    }

    console.log('📝 Navigating to Register with referral code:', referralCode)
    navigation.navigate('Register', { 
      email: registrationData.email,
      referralCode: referralCode
    })
    // Clear pending data after navigation
    pendingRegistrationDataRef.current = null
  }, [navigation])

  // Handle referral skip for registration (signup)
  const handleRegistrationReferralSkip = useCallback(async () => {
    const registrationData = pendingRegistrationDataRef.current
    if (!registrationData) {
      console.error('❌ No pending registration data')
      return
    }

    console.log('📝 Navigating to Register without referral code')
    navigation.navigate('Register', { 
      email: registrationData.email,
      referralCode: null
    })
    // Clear pending data after navigation
    pendingRegistrationDataRef.current = null
  }, [navigation])
  
  // Store callbacks in ref for navigation params
  useEffect(() => {
    referralCallbacksRef.current = {
      onContinue: (referralCode) => {
        // Check if it's login or signup based on pending data
        if (pendingLoginDataRef.current) {
          handleReferralContinue(referralCode)
        } else if (pendingRegistrationDataRef.current) {
          handleRegistrationReferralContinue(referralCode)
        }
      },
      onSkip: () => {
        // Check if it's login or signup based on pending data
        if (pendingLoginDataRef.current) {
          handleReferralSkip()
        } else if (pendingRegistrationDataRef.current) {
          handleRegistrationReferralSkip()
        }
      }
    }
  }, [handleReferralContinue, handleReferralSkip, handleRegistrationReferralContinue, handleRegistrationReferralSkip])
  
  // Navigation listener to handle fallback case when callbacks don't work
  useFocusEffect(
    useCallback(() => {
      const params = navigation.getState()?.routes?.find(r => r.name === 'Login' || r.name === 'Register')?.params
      if (params) {
        const { referralCode, referralSkipped } = params
        const loginData = pendingLoginDataRef.current
        const registrationData = pendingRegistrationDataRef.current
        
        if (loginData) {
          if (referralCode) {
            console.log('🔐 Handling referral code from navigation params for login:', referralCode)
            handleReferralContinue(referralCode)
            // Clear params
            navigation.setParams({ referralCode: undefined })
          } else if (referralSkipped) {
            console.log('🔐 Handling referral skip from navigation params for login')
            handleReferralSkip()
            // Clear params
            navigation.setParams({ referralSkipped: undefined })
          }
        } else if (registrationData) {
          if (referralCode) {
            console.log('📝 Handling referral code from navigation params for signup:', referralCode)
            handleRegistrationReferralContinue(referralCode)
            // Clear params
            navigation.setParams({ referralCode: undefined })
          } else if (referralSkipped) {
            console.log('📝 Handling referral skip from navigation params for signup')
            handleRegistrationReferralSkip()
            // Clear params
            navigation.setParams({ referralSkipped: undefined })
          }
        }
      }
    }, [navigation, handleReferralContinue, handleReferralSkip, handleRegistrationReferralContinue, handleRegistrationReferralSkip])
  )

  function checkEmailExist() {
    if (validateCredentials()) {
      EmailEixst({ variables: { email: emailRef.current } })
    }
  }

  function onBackButtonPressAndroid() {
    navigation.navigate({
      name: 'Main',
      merge: true
    })
    return true
  }

  return {
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    emailError,
    passwordError,
    registeredEmail,
    currentTheme,
    loading,
    loginLoading,
    loginAction,
    checkEmailExist,
    onBackButtonPressAndroid,
    emailRef,
    themeContext,
    handleSetEmail
  }
}
