import { useState, useContext, useEffect, useRef } from 'react'
import { sendOtpToEmail, createUser, VERIFY_OTP } from '../../../apollo/mutations'
import gql from 'graphql-tag'
import Constants from 'expo-constants'
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
const useEmailOtp = (isPhoneExists) => {
  const { TEST_OTP } = useEnvVars()
  const Analytics = analytics()

  const { t } = useTranslation()
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)
  const route = useRoute()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
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
      navigation.navigate('PhoneOtp', {
        name: data?.createUser?.name,
        phone: data?.createUser?.phone
      })
    } catch (e) {
      console.log(e)
    }
  }

  const [sendOTPToEmail, { loading }] = useMutation(SEND_OTP_TO_EMAIL, {
    onCompleted,
    onError
  })
  const [verifyOTP] = useMutation(VERIFY_OTP, {
    onError
  })

  const [mutateUser, { loading: updateUserLoading }] = useMutation(CREATEUSER, {
    onCompleted: onCreateUserCompleted,
    onError: onCreateUserError
  })

  async function mutateRegister() {
    try {
      let notificationToken = null
      if (Device.isDevice) {
        try {
          const { status } = await Notifications.requestPermissionsAsync()
        if (status === 'granted') {
          notificationToken = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data
        }
        } catch (error) {
          console.log('Error catched in notificationToken:', error)
        }
      }
      console.log('mutation variables: create user', isPhoneExists)
      await mutateUser({
        variables: {
          phone: user?.phone ?? '',
          email: user.email,
          password: user.password,
          name: user.name,
          picture: '',
          notificationToken: notificationToken,
          emailIsVerified: true,
          isPhoneExists: isPhoneExists || false
        }
      })
    } catch (error) {
      console.log('Error catched in mutateRegister:', error)
      FlashMessage({ message: t('somethingWentWrong') })
    }
  }

  const onCodeFilled = async (otp_code) => {
    if (configuration?.skipEmailVerification) {
      await mutateRegister()
      return
    }

    const { data } = await verifyOTP({
      variables: { otp: otp_code, email: user.email }
    })

    if (data?.verifyOtp) {
      await mutateRegister()
    } else {
      setOtpError(true)
    }
  }

  const resendOtp = () => {
    sendOTPToEmail({
      variables: { email: user.email }
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
      sendOTPToEmail({ variables: { email: user.email } })
    }
  }, [configuration])

  useEffect(() => {
    let timer = null
    if (!configuration) return
    if (configuration.skipEmailVerification) {
      setOtp(TEST_OTP)
      timer = setTimeout(async () => {
        await onCodeFilled(TEST_OTP)
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
