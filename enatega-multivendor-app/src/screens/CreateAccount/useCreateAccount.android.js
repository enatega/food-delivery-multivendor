// useCreateAccount.android.js

import { useEffect, useState, useContext } from 'react'
import { StatusBar, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import useEnvVars from '../../../environment'
import gql from 'graphql-tag'
import { login } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { useMutation } from '@apollo/client'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import analytics from '../../utils/analytics'
import AuthContext from '../../context/Auth'
import { useTranslation } from 'react-i18next'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import {
  logStep,
  logError,
  redactToken,
  describeGoogleUser,
  describeLoginPayload
} from '../../utils/googleSignInLogger'

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
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }
  const socialLoginMessages = {
    missingToken:
      'Your social sign-in did not return a valid token. Please try again.',
    invalidToken:
      'Your social sign-in token is invalid or expired. Please sign in again.',
    notConfigured:
      'Social login is not configured right now. Please use email and password.'
  }

  const {
    TERMS_AND_CONDITIONS,
    PRIVACY_POLICY,
    EXPO_CLIENT_ID,
    ANDROID_CLIENT_ID_GOOGLE,
    IOS_CLIENT_ID_GOOGLE
  } = useEnvVars()

  useEffect(() => {
    logStep('configure: env vars', {
      platform: Platform.OS,
      hasExpoClientId: !!EXPO_CLIENT_ID,
      hasAndroidClientId: !!ANDROID_CLIENT_ID_GOOGLE,
      hasIosClientId: !!IOS_CLIENT_ID_GOOGLE
    })

    if (!EXPO_CLIENT_ID || !ANDROID_CLIENT_ID_GOOGLE) {
      logStep('configure: skipped — missing client id(s)')
      return
    }

    GoogleSignin.configure({
      webClientId: EXPO_CLIENT_ID,
      androidClientId: ANDROID_CLIENT_ID_GOOGLE,
      iosClientId: IOS_CLIENT_ID_GOOGLE,
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true
    })
    logStep('configure: GoogleSignin.configure() done')
  }, [EXPO_CLIENT_ID, ANDROID_CLIENT_ID_GOOGLE, IOS_CLIENT_ID_GOOGLE])

  const signIn = async () => {
    logStep('signIn: tapped')
    try {
      if (!EXPO_CLIENT_ID || !ANDROID_CLIENT_ID_GOOGLE) {
        logStep('signIn: aborted — not configured')
        FlashMessage({ message: socialLoginMessages.notConfigured })
        return
      }

      loginButtonSetter('Google')
      setLoading(true)

      if (Platform.OS === 'android') {
        logStep('signIn: checking Play Services')
        const hasPlayServices = await GoogleSignin.hasPlayServices()
        logStep('signIn: Play Services OK', { hasPlayServices })
      }

      logStep('signIn: opening Google account picker')
      const userInfo = await GoogleSignin.signIn()
      logStep('signIn: GoogleSignin.signIn() returned', describeGoogleUser(userInfo))

      const idToken = userInfo.idToken ?? userInfo?.data?.idToken
      logStep('signIn: extracted idToken', { idToken: redactToken(idToken) })

      if (!idToken) {
        logStep('signIn: aborted — no idToken in Google response')
        FlashMessage({ message: socialLoginMessages.missingToken })
        setLoading(false)
        loginButtonSetter(null)
        return
      }

      const userData = {
        phone: '',
        email: userInfo.user.email,
        idToken,
        password: '',
        name: userInfo.user.name,
        picture: userInfo.user.photo || '',
        type: 'google'
      }

      setGoogleUser(userInfo.user.name)
      logStep('signIn: handing off to mutateLogin', describeLoginPayload(userData))
      await mutateLogin(userData)
    } catch (error) {
      logError('signIn: caught error', error)
      if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        FlashMessage({ message: socialLoginMessages.notConfigured })
      } else if (
        error.code === 'DEVELOPER_ERROR' ||
        error.code === 'SIGN_IN_REQUIRED'
      ) {
        FlashMessage({ message: socialLoginMessages.invalidToken })
      } else if (error.code !== 'SIGN_IN_CANCELLED') {
        FlashMessage({ message: 'Google sign in failed' })
      }

      setLoading(false)
      loginButtonSetter(null)
    }
  }

  const navigateToLogin = () => {
    navigation.navigate('Login')
  }

  const navigateToRegister = () => {
    navigation.navigate('Register')
  }

  const navigateToPhone = () => {
    navigation.navigate('PhoneNumber', {
      name: googleUser,
      phone: ''
    })
  }

  const navigateToMain = () => {
    navigation.navigate({
      name: 'Main',
      merge: true
    })
  }

  async function mutateLogin(user) {
    logStep('mutateLogin: start', describeLoginPayload(user))
    try {
      if ((user.type === 'google' || user.type === 'apple') && !user.idToken) {
        logStep('mutateLogin: aborted — social login without idToken')
        FlashMessage({ message: socialLoginMessages.missingToken })
        setLoading(false)
        loginButtonSetter(null)
        return
      }

      let notificationToken = null

      if (Device.isDevice) {
        try {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync()

          if (existingStatus === 'granted') {
            try {
              const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId
              })
              notificationToken = tokenData.data
            } catch (_tokenError) {
              notificationToken = null
            }
          }
        } catch (_permissionError) {
          notificationToken = null
        }
      }

      logStep('mutateLogin: firing LOGIN mutation', {
        ...describeLoginPayload(user),
        hasNotificationToken: !!notificationToken
      })
      mutate({
        variables: {
          ...user,
          notificationToken
        }
      })
    } catch (error) {
      logError('mutateLogin: caught error', error)
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  useEffect(() => {
    checkIfSupportsAppleAuthentication()
  }, [])

  async function checkIfSupportsAppleAuthentication() {
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync()
      setEnableApple(isAvailable)
    } catch (_error) {
      setEnableApple(false)
    }
  }

  async function onCompleted(data) {
    logStep('onCompleted: LOGIN mutation succeeded', {
      isActive: data?.login?.isActive,
      hasToken: !!data?.login?.token,
      token: redactToken(data?.login?.token),
      userId: data?.login?.userId,
      email: data?.login?.email,
      isNewUser: data?.login?.isNewUser,
      hasPhone: data?.login?.phone !== ''
    })
    if (data.login.isActive === false) {
      logStep('onCompleted: account deactivated — stopping')
      FlashMessage({ message: t('accountDeactivated') })
      setLoading(false)
      loginButtonSetter(null)
      return
    }

    try {
      setTokenAsync(data.login.token)
      FlashMessage({ message: 'Successfully logged in' })

      if (data?.login?.phone === '') {
        logStep('onCompleted: no phone on account → navigate to PhoneNumber')
        navigateToPhone()
      } else {
        logStep('onCompleted: navigate to Main')
        navigateToMain()
      }
    } finally {
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  function onError(error) {
    logError('onError: LOGIN mutation failed', error)
    FlashMessage({
      message: getSocialLoginErrorMessage(error) || 'Login failed. Please try again.'
    })

    setLoading(false)
    loginButtonSetter(null)
  }

  function getSocialLoginErrorMessage(error) {
    const message =
      error?.graphQLErrors?.[0]?.message ||
      error?.networkError?.message ||
      error?.message ||
      ''
    const normalizedMessage = message.toLowerCase()

    if (normalizedMessage.includes('not configured')) {
      return socialLoginMessages.notConfigured
    }

    if (
      normalizedMessage.includes('idtoken') ||
      normalizedMessage.includes('identity token') ||
      normalizedMessage.includes('missing token')
    ) {
      return socialLoginMessages.missingToken
    }

    if (
      normalizedMessage.includes('invalid token') ||
      normalizedMessage.includes('expired token') ||
      normalizedMessage.includes('jwt') ||
      normalizedMessage.includes('token')
    ) {
      return socialLoginMessages.invalidToken
    }

    return message
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.main)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

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
    signIn
  }
}
