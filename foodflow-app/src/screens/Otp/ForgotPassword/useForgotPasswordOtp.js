import { useState, useContext, useEffect, useRef } from 'react'
import { forgotPassword, VERIFY_OTP } from '../../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import { useRoute, useNavigation } from '@react-navigation/native'
import {useTranslation} from 'react-i18next'

const FORGOT_PASSWORD = gql`
  ${forgotPassword}
`

export const useForgotPasswordOtp = () => {
  const {t, i18n} = useTranslation()
  const route = useRoute()
  const navigation = useNavigation()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const otpFrom = useRef(null)
  const [email] = useState(route?.params.email)
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}
  const [seconds, setSeconds] = useState(30)

  function onCompleted(data) {
    FlashMessage({
      message: t('otpResentToEmail')
    })
  }

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

  const [mutate, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted,
    onError
  })

  const [verifyOTP] = useMutation(VERIFY_OTP)

  
  const onCodeFilled = async (code) => {    
    const { data } = await verifyOTP({
      variables: {
        otp: code,
        email: email ?? ''
      }
    })
    if (data?.verifyOtp) {
      navigation.navigate('SetYourPassword', { email })
    } else {
      setOtpError(true)
    }
  }

  const resendOtp = () => {
    mutate({
      variables: { email: email.toLowerCase().trim() }
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
    otpFrom.current = route?.params.otp
  }, [])

  return {
    otp,
    setOtp,
    otpError,
    setOtpError,
    seconds,
    setSeconds,
    currentTheme,
    mutate,
    loading,
    onCodeFilled,
    email,
    otpFrom,
    themeContext,
    resendOtp
  }
}
