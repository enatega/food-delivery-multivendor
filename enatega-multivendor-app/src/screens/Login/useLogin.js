import { useState, useContext, useRef } from 'react'
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
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const LOGIN = gql`
  ${login}
`
const EMAIL = gql`
  ${emailExist}
`

export const useLogin = () => {
  const Analytics = analytics()

  const navigation = useNavigation()
  const emailRef = useRef('demo-customer@enatega.com')
  const [password, setPassword] = useState('123123')
  const [showPassword, setShowPassword] = useState(true)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [registeredEmail, setRegisteredEmail] = useState(false)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { setTokenAsync } = useContext(AuthContext)
  const { t } = useTranslation()

  const [EmailEixst, { loading }] = useMutation(EMAIL, {
    onCompleted,
    onError
  })

  const [LoginMutation, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: onLoginCompleted,
    onError: onLoginError
  })

  // Debounce the setEmail function
  const setEmail = (email) => {
    emailRef.current = email
  }
  function validateCredentials() {
    let result = true
    setEmailError(null)
    setPasswordError(null)
    if (!emailRef.current) {
      setEmailError(t('emailErr1'))
      result = false
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
      if (emailRegex.test(emailRef.current) !== true) {
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
      if (emailExist._id !== null) {
        if (
          emailExist.userType !== 'apple' &&
          emailExist.userType !== 'google' &&
          emailExist.userType !== 'facebook'
        ) {
          setRegisteredEmail(true)
        } else {
          FlashMessage({
            message: `${t('emailAssociatedWith')} ${emailExist.userType} ${t(
              'continueWith'
            )} ${emailExist.userType}`
          })
          navigation.navigate({ name: 'Main', merge: true })
        }
      } else {
        navigation.navigate('Register', { email: emailRef.current })
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

  async function loginAction(email, password) {
    try {
      if (validateCredentials()) {
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
        LoginMutation({
          variables: {
            email,
            password,
            type: 'default',
            notificationToken
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

  function checkEmailExist() {
    EmailEixst({ variables: { email: emailRef.current } })
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
    emailRef
  }
}
