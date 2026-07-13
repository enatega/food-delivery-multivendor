// useCreateAccount.android.js

import { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { StatusBar, Platform, Alert } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import useEnvVars from '../../../environment' // Adjust path if necessary
import gql from 'graphql-tag'
import { login } from '../../apollo/mutations' // Adjust path if necessary
import ThemeContext from '../../ui/ThemeContext/ThemeContext' // Adjust path if necessary
import { theme } from '../../utils/themeColors' // Adjust path if necessary
import { useMutation } from '@apollo/client'
import * as AppleAuthentication from 'expo-apple-authentication' // Keep import, function will handle platform check
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage' // Adjust path if necessary
import analytics from '../../utils/analytics' // Adjust path if necessary
import AuthContext from '../../context/Auth' // Adjust path if necessary
import { useTranslation } from 'react-i18next'
import { GoogleSignin } from '@react-native-google-signin/google-signin' // Android-specific Google import
import useNotifications from '../../utils/useNotifications'
import useEmailExist from './useEmailExist'

const LOGIN = gql`
  ${login}
`

export const useCreateAccount = () => {
  const Analytics = analytics()
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const [mutate] = useMutation(LOGIN, { onCompleted, onError })
  const [enableApple, setEnableApple] = useState(false)
  const [loginButton, loginButtonSetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setTokenAsync } = useContext(AuthContext)
  const themeContext = useContext(ThemeContext)
  const [googleUser, setGoogleUser] = useState(null)
  const [pendingGoogleUserData, setPendingGoogleUserData] = useState(null)
  const pendingGoogleUserDataRef = useRef(null)
  const referralCallbacksRef = useRef({ onContinue: null, onSkip: null })
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }
  const { registerForPushNotificationsAsync } = useNotifications()
  const { checkEmailExist } = useEmailExist()
  const { IOS_CLIENT_ID_GOOGLE, ANDROID_CLIENT_ID_GOOGLE, EXPO_CLIENT_ID, TERMS_AND_CONDITIONS, PRIVACY_POLICY } = useEnvVars()

  // Configure Google Sign-In ONCE for Android
  useEffect(() => {
    console.log('🔧 Configuring Google Sign-In for Android...')
    GoogleSignin.configure({
      webClientId: '756039622157-tfukdfcu22keu8vcen8atkbvptvd0jdp.apps.googleusercontent.com', // Web client ID for Expo
      androidClientId: '756039622157-uvii3hb3tr8eleopl448dj8hrikrnv2i.apps.googleusercontent.com', // Android client ID
      iosClientId: '756039622157-n6rqegdvm03s1m85rne57akl3rkr5dv8.apps.googleusercontent.com', // iOS client ID
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true
    })
    console.log('✅ Google Sign-In configured for Android')
  }, [])

  // Google Sign-In Function for Android
  const signIn = async () => {
    try {
      loginButtonSetter('Google')
      setLoading(true)

      // Check for Google Play Services on Android
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices()
        console.log('✅ Google Play Services available')
      }

      const userInfo = await GoogleSignin.signIn()
      console.log('✅ Google sign-in successful!')
      console.log('👤 User:', userInfo)

      const userData = {
        phone: '',
        email: userInfo.user.email,
        password: '',
        name: userInfo.user.name,
        picture: userInfo.user.photo || '',
        type: 'google'
      }

      setGoogleUser(userInfo.user.name)
      setPendingGoogleUserData(userData)
      pendingGoogleUserDataRef.current = userData

      // Navigate to RefralScreen with user data and callbacks
      console.log('📱 Navigating to RefralScreen...')

      //check if email exist
      const result = await checkEmailExist(userInfo?.user?.email)
      setLoading(false)
      if (result?.error) {
        console.error('Error checking email:', result.error.message)
        // Handle error
        Alert.alert(t("networkError"))
      } else if (result?.exists) {
        console.log('Email exists! User data:', result.user)
        // Handle existing user
        handleReferralSkip()
      } else {
        console.log('Email does not exist')
        // Handle new user
        navigation.navigate('RefralScreen', {
          userData: userData,
          onContinue: referralCallbacksRef.current.onContinue,
          onSkip: referralCallbacksRef.current.onSkip
        })
      }
    } catch (error) {
      console.error('❌ Google sign-in error:', error)

      if (error.code === 'SIGN_IN_CANCELLED') {
        console.log('❌ User cancelled')
      } else if (error.code === 'IN_PROGRESS') {
        console.log('⏳ Sign in already in progress')
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        console.log('❌ Google Play Services not available')
        FlashMessage({ message: 'Google Play Services not available' })
      } else {
        FlashMessage({ message: 'Google sign in failed' })
      }

      setLoading(false)
      loginButtonSetter(null)
    }
  }

  // Handle referral continue with code
  const handleReferralContinue = useCallback(async (referralCode) => {
    const userData = pendingGoogleUserDataRef.current
    if (!userData) {
      console.error('❌ No pending Google user data')
      return
    }

    setLoading(true)
    loginButtonSetter('Google')
    console.log('🔐 Logging in user with referral code:', referralCode)
    const response = await mutateLogin({ ...userData, referralCode })
    // Clear pending data after use
    pendingGoogleUserDataRef.current = null
    setPendingGoogleUserData(null)
  }, [])

  // Handle referral skip
  const handleReferralSkip = useCallback(async () => {
    const userData = pendingGoogleUserDataRef.current
    if (!userData) {
      console.error('❌ No pending Google user data')
      return
    }

    setLoading(true)
    loginButtonSetter('Google')
    console.log('🔐 Logging in user without referral code')
    await mutateLogin(userData)
    // Clear pending data after use
    pendingGoogleUserDataRef.current = null
    setPendingGoogleUserData(null)
  }, [])

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
      const params = navigation.getState()?.routes?.find((r) => r.name === 'CreateAccount')?.params
      if (params) {
        const { referralCode, referralSkipped } = params
        const userData = pendingGoogleUserDataRef.current

        if (userData) {
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

  // --- Common Navigation Functions ---
  const navigateToLogin = () => {
    navigation.navigate('Login')
  }

  const navigateToRegister = () => {
    navigation.navigate('Register')
  }

  const navigateToPhone = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'PhoneNumber',
          params: {
            name: googleUser,
            phone: ''
          }
        }
      ]
    })
  }

  const navigateToMain = () => {
    navigation.navigate({
      name: 'Main',
      merge: true
    })
  }

  // --- Common Login Mutation Function ---
  async function mutateLogin(user) {
    try {
      console.log('🔐 [Login Debug] Starting login mutation for:', user.email)
      console.log('🔐 [Login Debug] User type:', user.type)
      console.log('🔐 [Login Debug] Referral code:', user.referralCode || 'none')
      console.log('🔐 [Login Debug] Full user object:', user)

      let token = null
      token = await registerForPushNotificationsAsync()
      console.log('🚀 ~ mutateLogin ~ token:', token)

      // Extract referralCode from user object if present
      const { referralCode, ...userWithoutReferral } = user
      const mutationVariables = {
        ...userWithoutReferral,
        notificationToken: token,
        referralCode: referralCode || null
      }

      console.log('🔐 [Login Debug] About to call GraphQL mutation with variables:', {
        ...mutationVariables,
        notificationToken: token ? 'token_present' : 'no_token'
      })

      mutate({
        variables: mutationVariables
      })
    } catch (error) {
      console.error('🔐 [Login Debug] ❌ Error in mutateLogin:', error)
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  // --- Common Apple Authentication Check (will always be false on Android) ---
  useEffect(() => {
    checkIfSupportsAppleAuthentication()
  }, [])

  async function checkIfSupportsAppleAuthentication() {
    try {
      console.log('🍎 [Apple Debug] Checking Apple Authentication support...')
      console.log('🍎 [Apple Debug] Platform:', Platform.OS) // Will always be 'android' in this file
      console.log('🍎 [Apple Debug] Device type:', Device.deviceType)

      const isAvailable = await AppleAuthentication.isAvailableAsync()
      console.log('🍎 [Apple Debug] Apple Authentication available:', isAvailable)

      if (Platform.OS === 'ios') {
        console.log('🍎 [Apple Debug] Running on iOS - Apple should be available')
      } else {
        // This block will always be hit in .android.js
        console.log('🍎 [Apple Debug] Not running on iOS - Apple will not be available')
      }

      setEnableApple(isAvailable) // This will correctly be false on Android
    } catch (error) {
      console.error('🍎 [Apple Debug] ❌ Error checking Apple Authentication:', error)
      setEnableApple(false)
    }
  }

  // --- Common Login Success Handler ---
  async function onCompleted(data) {
    console.log('✅ [Login Debug] Login mutation completed successfully')
    console.log('✅ [Login Debug] Response data:', data)
    console.log('✅ [Login Debug] User email:', data.login.email)
    console.log('✅ [Login Debug] User active status:', data.login.isActive)
    console.log('✅ [Login Debug] User phone:', data.login.phone)

    if (data.login.isActive === false) {
      console.log('❌ [Login Debug] Account is deactivated')
      FlashMessage({ message: t('accountDeactivated') })
      setLoading(false)
      loginButtonSetter(null)
      return
    }

    try {
      console.log('✅ [Login Debug] Setting auth token...')
      setTokenAsync(data.login.token)
      FlashMessage({ message: 'Successfully logged in' })

      if (data?.login?.phone === '') {
        console.log('✅ [Login Debug] No phone number - navigating to phone screen')
        navigateToPhone()
      } else {
        console.log('✅ [Login Debug] Phone number exists - navigating to main app')
        navigateToMain()
      }
    } catch (error) {
      console.error('❌ [Login Debug] Error in onCompleted:', error)
    } finally {
      console.log('✅ [Login Debug] Resetting loading states')
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  // --- Common Login Error Handler ---
  function onError(error) {
    console.error('❌ [Login Debug] Login mutation error occurred')
    console.error('❌ [Login Debug] Error message:', error.message)
    console.error('❌ [Login Debug] Full error object:', error)
    console.error('❌ [Login Debug] GraphQL errors:', error.graphQLErrors)
    console.error('❌ [Login Debug] Network error:', error.networkError)

    FlashMessage({
      message: error.message || 'Login failed. Please try again.'
    })

    setLoading(false)
    loginButtonSetter(null)
  }

  // --- Common Focus Effect for Status Bar (with Android-specific styling) ---
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      // StatusBar.setBackgroundColor(currentTheme.main)
    }
    StatusBar.setBarStyle(themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content')
  })

  // --- Common Link Handlers ---
  const openTerms = () => {
    Linking.openURL(TERMS_AND_CONDITIONS)
  }

  const openPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY)
  }

  return {
    enableApple,
    loginButton,
    loginButtonSetter,
    loading,
    setLoading,
    themeContext,
    mutateLogin,
    currentTheme,
    navigateToLogin,
    navigateToRegister,
    openTerms,
    openPrivacyPolicy,
    navigateToMain,
    navigation,
    signIn, // Android-specific signIn function
    handleReferralContinue,
    handleReferralSkip
  }
}
