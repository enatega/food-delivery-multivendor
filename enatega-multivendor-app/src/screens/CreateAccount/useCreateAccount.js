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
import * as Google from 'expo-auth-session/providers/google'

const LOGIN = gql`
  ${login}
`
export const useCreateAccount = () => {
  const Analytics = analytics()
  const navigation = useNavigation()
  const [mutate] = useMutation(LOGIN, { onCompleted, onError })
  const [enableApple, setEnableApple] = useState(false)
  const [loginButton, loginButtonSetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setTokenAsync } = useContext(AuthContext)
  const themeContext = useContext(ThemeContext)
  const [user, setUser] = useState('')
  const currentTheme = theme[themeContext.ThemeValue]
  const {
    IOS_CLIENT_ID_GOOGLE,
    ANDROID_CLIENT_ID_GOOGLE,
    TERMS_AND_CONDITIONS,
    PRIVACY_POLICY
  } = useEnvVars()

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID_GOOGLE,
    iosClientId: IOS_CLIENT_ID_GOOGLE
  })

  const getUserInfo = async (token) => {
    //absent token
    if (!token) return
    //present token
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return await response.json()
    } catch (error) {
      console.error(
        'Failed to fetch user data:',
        response.status,
        response.statusText
      )
    }
  }

  const signIn = async () => {
    try {
      loginButtonSetter('Google')
      await promptAsync()
    } catch (err) {
      console.log('Sign in with Google error', err)
    }
  }

  const signInWithGoogle = async () => {
    try {
      if (response?.type === 'success') {
        const google_user = await getUserInfo(
          response.authentication.accessToken
        )

        const userData = {
          phone: '',
          email: google_user.email,
          password: '',
          name: google_user.name,
          picture: google_user.picture,
          type: 'google'
        }

        await mutateLogin(userData)
      }
    } catch (error) {
      // Handle any errors that occur during AsyncStorage retrieval or other operations
      console.error('Error retrieving user data from AsyncStorage:', error)
    }
  }

  //add it to a useEffect with response as a dependency
  useEffect(() => {
    signInWithGoogle()
  }, [response])

  /*   const signIn = async () => {
    try {
      loginButtonSetter('Google')
      await GoogleSignin.hasPlayServices()
      const user = await GoogleSignin.signIn()
      const userData = {
        phone: '',
        email: user.user.email,
        password: '',
        name: user.user.name,
        picture: user.user.photo,
        type: 'google'
      }
      await mutateLogin(userData)

      setUser(user)
    } catch (error) {
      console.log('🚀 ~ signIn ~ error:', error)
    }
  }
 */
  const { t } = useTranslation()
  // const [googleRequest, googleResponse, googlePromptAsync] =
  //   Google.useAuthRequest({
  //     expoClientId: EXPO_CLIENT_ID,
  //     iosClientId: IOS_CLIENT_ID_GOOGLE,
  //     iosStandaloneAppClientId: IOS_CLIENT_ID_GOOGLE,
  //     androidClientId: ANDROID_CLIENT_ID_GOOGLE,
  //     androidStandaloneAppClientId: ANDROID_CLIENT_ID_GOOGLE,
  //     redirectUrl: `${AuthSession.OAuthRedirect}:/oauth2redirect/google`,
  //     scopes: ['profile', 'email']
  //   })

  const navigateToLogin = () => {
    navigation.navigate('Login')
  }
  const navigateToRegister = () => {
    navigation.navigate('Register')
  }
  const navigateToPhone = () => {
    navigation.navigate('PhoneNumber', { backScreen: 'Main' })
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
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      if (existingStatus === 'granted') {
        notificationToken = (
          await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId
          })
        ).data
      }
    }
    mutate({
      variables: {
        ...user,
        notificationToken: notificationToken
      }
    })
  }

  // const googleSignUp = () => {
  //   if (googleResponse?.type === 'success') {
  //     const { authentication } = googleResponse
  //     ;(async () => {
  //       const userInfoResponse = await fetch(
  //         'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
  //         {
  //           headers: { Authorization: `Bearer ${authentication.accessToken}` }
  //         }
  //       )
  //       const googleUser = await userInfoResponse.json()
  //       const user = {
  //         phone: '',
  //         email: googleUser.email,
  //         password: '',
  //         name: googleUser.name,
  //         picture: googleUser.picture,
  //         type: 'google'
  //       }
  //       mutateLogin(user)
  //     })()
  //   }
  // }

  // useEffect(() => {
  //   googleSignUp()
  // }, [googleResponse])

  useEffect(() => {
    checkIfSupportsAppleAuthentication()
  }, [])
  async function checkIfSupportsAppleAuthentication() {
    setEnableApple(await AppleAuthentication.isAvailableAsync())
  }
  async function onCompleted(data) {
    if (data.login.isActive == false) {
      FlashMessage({ message: t('accountDeactivated') })
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
        FlashMessage({ message: 'Successfully logged in' })
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
    Linking.openURL(TERMS_AND_CONDITIONS)
  }
  const openPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY)
  }
  return {
    enableApple,
    loginButton,
    loginButtonSetter,
    // googleRequest,
    // googlePromptAsync,
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
    signIn,
    user
  }
}
