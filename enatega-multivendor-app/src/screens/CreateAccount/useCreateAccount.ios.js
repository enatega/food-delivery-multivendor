// useCreateAccount.ios.js

import { useEffect, useState, useContext } from 'react'
import { StatusBar } from 'react-native'
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
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

WebBrowser.maybeCompleteAuthSession()

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

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: EXPO_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID_GOOGLE,
    iosClientId: IOS_CLIENT_ID_GOOGLE,
    scopes: ['profile', 'email', 'openid']
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication, params } = response
      const idToken = authentication?.idToken ?? params?.id_token
      const accessToken = authentication?.accessToken ?? params?.access_token

      if (!idToken) {
        FlashMessage({ message: socialLoginMessages.missingToken })
        setLoading(false)
        loginButtonSetter(null)
        return
      }

      fetchUserInfo({ accessToken, idToken })
    } else if (response?.type === 'error') {
      FlashMessage({
        message: `Google sign-in failed: ${response.error.message || 'Unknown error'}`
      })
      setLoading(false)
      loginButtonSetter(null)
    } else if (response?.type === 'cancel') {
      FlashMessage({ message: 'Google sign-in cancelled.' })
      setLoading(false)
      loginButtonSetter(null)
    }
  }, [response])

  const fetchUserInfo = async ({ accessToken, idToken }) => {
    try {
      let user = {}

      if (accessToken) {
        const response = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        )
        user = await response.json()
      }

      const userData = {
        phone: '',
        email: user.email,
        idToken,
        password: '',
        name: user.name,
        picture: user.photo || '',
        type: 'google'
      }

      setGoogleUser(userData.name)
      await mutateLogin(userData)
    } catch (_error) {
      FlashMessage({ message: 'Failed to retrieve Google user info.' })
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  const signIn = async () => {
    try {
      if (!IOS_CLIENT_ID_GOOGLE) {
        FlashMessage({ message: socialLoginMessages.notConfigured })
        return
      }

      loginButtonSetter('Google')
      setLoading(true)

      if (!request) {
        FlashMessage({ message: 'Google sign-in is not ready. Please try again.' })
        setLoading(false)
        loginButtonSetter(null)
        return
      }

      await promptAsync({
        useProxy: false,
        windowFeatures: 'popup'
      })
    } catch (_error) {
      FlashMessage({ message: 'Google sign-in failed unexpectedly.' })
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
    try {
      if ((user.type === 'google' || user.type === 'apple') && !user.idToken) {
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

      mutate({
        variables: {
          ...user,
          notificationToken
        }
      })
    } catch (_error) {
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
    if (data.login.isActive === false) {
      FlashMessage({ message: t('accountDeactivated') })
      setLoading(false)
      loginButtonSetter(null)
      return
    }

    try {
      setTokenAsync(data.login.token)
      FlashMessage({ message: 'Successfully logged in' })

      if (data?.login?.phone === '') {
        navigateToPhone()
      } else {
        navigateToMain()
      }
    } finally {
      setLoading(false)
      loginButtonSetter(null)
    }
  }

  function onError(error) {
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
