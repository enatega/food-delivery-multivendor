import { useEffect, useState, useContext } from 'react'
import { StatusBar, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import getEnvVars from '../../../environment'
import gql from 'graphql-tag'
import { login } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import { useMutation } from '@apollo/client'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import Analytics from '../../utils/analytics'
import AuthContext from '../../context/Auth'

const config = getEnvVars()
const {
  IOS_CLIENT_ID_GOOGLE,
  ANDROID_CLIENT_ID_GOOGLE,
  EXPO_CLIENT_ID
} = getEnvVars()

const LOGIN = gql`
  ${login}
`

export const useCreateAccount = () => {
  const navigation = useNavigation()
  const [mutate] = useMutation(LOGIN, { onCompleted, onError })
  const [enableApple, setEnableApple] = useState(false)
  const [loginButton, loginButtonSetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setTokenAsync } = useContext(AuthContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [
    googleRequest,
    googleResponse,
    googlePromptAsync
  ] = Google.useAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID_GOOGLE,
    iosStandaloneAppClientId: IOS_CLIENT_ID_GOOGLE,
    androidClientId: ANDROID_CLIENT_ID_GOOGLE,
    androidStandaloneAppClientId: ANDROID_CLIENT_ID_GOOGLE,
    redirectUrl: `${AuthSession.OAuthRedirect}:/oauth2redirect/google`,
    scopes: ['profile', 'email']
  })

  const navigateToLogin = () => {
    navigation.navigate('Login')
  }
  const navigateToRegister = () => {
    navigation.navigate('Register')
  }
  const navigateToPhone = () => {
    navigation.navigate('PhoneNumber')
  }
  const navigateToMain = () => {
    navigation.navigate({
      name: 'Main',
      merge: true
    })
  }

  async function mutateLogin(user) {
    setLoading(true)
    let notificationToken = null
    if (Device.isDevice) {
      const {
        status: existingStatus
      } = await Notifications.getPermissionsAsync()
      if (existingStatus === 'granted') {
        notificationToken = (await Notifications.getExpoPushTokenAsync()).data
      }
    }
    mutate({
      variables: {
        ...user,
        notificationToken: notificationToken
      }
    })
  }

  const googleSignUp = () => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse
      ;(async () => {
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` }
          }
        )
        const googleUser = await userInfoResponse.json()
        const user = {
          phone: '',
          email: googleUser.email,
          password: '',
          name: googleUser.name,
          picture: googleUser.picture,
          type: 'google'
        }
        mutateLogin(user)
      })()
    }
  }

  useEffect(() => {
    googleSignUp()
  }, [googleResponse])

  useEffect(() => {
    checkIfSupportsAppleAuthentication()
  }, [])

  async function checkIfSupportsAppleAuthentication() {
    setEnableApple(await AppleAuthentication.isAvailableAsync())
  }

  async function onCompleted(data) {
    if (data.login.isActive == false) {
      FlashMessage({ message: "Can't Login, This Account is Deleted!" })
      setLoading(false)
    } else {
      try {
        if (data.login.inNewUser) {
          await Analytics.identify(
            {
              userId: data.login.userId
            },
            data.login.userId
          )
          await Analytics.track(Analytics.events.USER_CREATED_ACCOUNT, {
            userId: data.login.userId,
            name: data.login.name,
            email: data.login.email
          })
        } else {
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
        }
        setTokenAsync(data.login.token)
        // eslint-disable-next-line no-unused-expressions
        data.login?.phone === '' ? navigateToPhone() : navigateToMain()
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
  }

  function onError(error) {
    try {
      FlashMessage({
        message: error.message
      })
      loginButtonSetter(null)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  const openTerms = () => {
    Linking.openURL(config.TERMS_AND_CONDITIONS)
  }
  const openPrivacyPolicy = () => {
    Linking.openURL(config.PRIVACY_POLICY)
  }
  return {
    enableApple,
    loginButton,
    loginButtonSetter,
    googleRequest,
    googlePromptAsync,
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
    navigation
  }
}
