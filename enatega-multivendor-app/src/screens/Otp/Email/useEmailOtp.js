import { useState, useContext, useEffect, useRef } from 'react'
import { sendOtpToEmail, createUser } from '../../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import UserContext from '../../../context/User'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import analytics from '../../../utils/analytics'
import AuthContext from '../../../context/Auth'
import { useTranslation } from 'react-i18next'
import ConfigurationContext from '../../../context/Configuration'
import useEnvVars from '../../../../environment'

const SEND_OTP_TO_EMAIL = gql`
  ${sendOtpToEmail}
`
const CREATEUSER = gql`
  ${createUser}
`
const useEmailOtp = () => {
  const { TEST_OTP } = useEnvVars()
  const Analytics = analytics()

  const { t } = useTranslation()
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)
  const route = useRoute()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const otpFrom = useRef(null)
  const [seconds, setSeconds] = useState(5)
  const [user] = useState(route.params?.user)
  const { setTokenAsync } = useContext(AuthContext)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  function onError(error) {
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }

  function onCompleted(data) {
    FlashMessage({
      message: t('otpSentToEmail')
    })
  }

  function onCreateUserError(error) {
    if (error.networkError) {
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }

  async function onCreateUserCompleted(data) {
    try {
      FlashMessage({
        message: t('accountCreated')
      })
      await Analytics.identify(
        {
          userId: data.createUser.userId
        },
        data.createUser.userId
      )
      await Analytics.track(Analytics.events.USER_CREATED_ACCOUNT, {
        userId: data.createUser.userId,
        name: data.createUser.name,
        email: data.createUser.email,
        type: 'email'
      })
      await setTokenAsync(data.createUser.token)
      navigation.navigate('PhoneOtp')
    } catch (e) {
      console.log(e)
    }
  }

  const [mutate, { loading }] = useMutation(SEND_OTP_TO_EMAIL, {
    onCompleted,
    onError
  })

  const [mutateUser, { loading: updateUserLoading }] = useMutation(CREATEUSER, {
    onCompleted: onCreateUserCompleted,
    onError: onCreateUserError
  })

  async function mutateRegister() {
    let notificationToken = null
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status === 'granted') {
        notificationToken = (await Notifications.getExpoPushTokenAsync()).data
      }
    }
    mutateUser({
      variables: {
        phone: user.phone,
        email: user.email,
        password: user.password,
        name: user.name,
        picture: '',
        notificationToken: notificationToken
      }
    })
  }

  const onCodeFilled = code => {
    if (configuration.skipEmailVerification || code === otpFrom.current) {
      mutateRegister()
    } else {
      setOtpError(true)
    }
  }

  const resendOtp = () => {
    otpFrom.current = Math.floor(100000 + Math.random() * 900000).toString()
    mutate({
      variables: { email: user.email, otp: otpFrom.current }
    })
    setSeconds(30)
  }

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        clearInterval(myInterval)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  })

  useEffect(() => {
    if (!configuration) return
    if (!configuration.skipEmailVerification) {
      otpFrom.current = Math.floor(100000 + Math.random() * 900000).toString()
      mutate({ variables: { email: user.email, otp: otpFrom.current } })
    }
  }, [configuration])

  useEffect(() => {
    let timer = null
    if (!configuration) return
    if (configuration.skipEmailVerification) {
      setOtp(TEST_OTP)
      timer = setTimeout(() => {
        onCodeFilled(TEST_OTP)
      }, 3000)
    }
    return () => {
      timer && clearTimeout(timer)
    }
  }, [configuration])

  return {
    otp,
    setOtp,
    otpError,
    seconds,
    profile,
    loading,
    updateUserLoading,
    onCodeFilled,
    resendOtp,
    currentTheme,
    themeContext
  }
}

export default useEmailOtp
