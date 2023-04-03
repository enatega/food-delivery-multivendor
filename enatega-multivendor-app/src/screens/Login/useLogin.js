import { useState, useContext } from 'react'
import * as Device from 'expo-device'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { login, emailExist } from '../../apollo/mutations'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import * as Notifications from 'expo-notifications'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import Analytics from '../../utils/analytics'
import AuthContext from '../../context/Auth'
import { useNavigation } from '@react-navigation/native'
import i18n from '../../../i18n'

const LOGIN = gql`
  ${login}
`
const EMAIL = gql`
  ${emailExist}
`

export const useLogin = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [registeredEmail, setRegisteredEmail] = useState(false)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { setTokenAsync } = useContext(AuthContext)

  const [EmailEixst, { loading }] = useMutation(EMAIL, {
    onCompleted,
    onError
  })

  const [LoginMutation, { loading: loginLoading }] = useMutation(LOGIN, {
    onCompleted: onLoginCompleted,
    onError: onLoginError
  })

  function validateCredentials() {
    let result = true
    setEmailError(null)
    setPasswordError(null)

    if (!email) {
      setEmailError(i18n.t('emailErr1'))
      result = false
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
      if (emailRegex.test(email) !== true) {
        setEmailError(i18n.t('emailErr2'))
        result = false
      }
    }
    if (!password && registeredEmail) {
      setPasswordError(i18n.t('passErr1'))
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
            message: `Your email is associated with ${emailExist.userType}. Kindly continue with ${emailExist.userType}`
          })
          navigation.navigate({ name: 'Main', merge: true })
        }
      } else {
        navigation.navigate('Register', { email })
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
        message: 'Error while checking email. Try again later!'
      })
    }
  }
  async function onLoginCompleted(data) {
    if (data.login.isActive == false) {
      FlashMessage({ message: "Can't Login, This Account is Deleted!" })
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
      FlashMessage({ message: 'Error in login Error' })
    }
  }

  async function loginAction(email, password) {
    try {
      if (validateCredentials()) {
        let notificationToken = null
        if (Device.isDevice) {
          const {
            status: existingStatus
          } = await Notifications.getPermissionsAsync()
          if (existingStatus === 'granted') {
            notificationToken = (await Notifications.getExpoPushTokenAsync())
              .data
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
        message: 'Error while logging in. Please try again later'
      })
    } finally {
    }
  }

  function checkEmailExist(email) {
    EmailEixst({ variables: { email } })
  }

  function onBackButtonPressAndroid() {
    navigation.navigate({
      name: 'Main',
      merge: true
    })
    return true
  }

  return {
    email,
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
    onBackButtonPressAndroid
  }
}
