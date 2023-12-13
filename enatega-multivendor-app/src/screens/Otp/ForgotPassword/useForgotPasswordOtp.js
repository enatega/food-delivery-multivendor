import { useState, useContext, useEffect, useRef } from 'react'
import { forgotPassword } from '../../../apollo/mutations'
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
  const {t} = useTranslation()
  const route = useRoute()
  const navigation = useNavigation()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const otpFrom = useRef(null)
  const [email] = useState(route?.params.email)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
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

  const onCodeFilled = code => {
    if (code === otpFrom.current) {
      navigation.navigate('SetYourPassword', { email })
    } else {
      setOtpError(true)
    }
  }

  const resendOtp = () => {
    otpFrom.current = Math.floor(100000 + Math.random() * 900000).toString()
    mutate({
      variables: { email: email.toLowerCase().trim(), otp: otpFrom.current }
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
