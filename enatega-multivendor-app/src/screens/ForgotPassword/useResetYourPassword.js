import { useState, useContext, useEffect } from 'react'
import { resetPassword } from '../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import {
  getResetSession,
  clearResetSession
} from '../../utils/resetPasswordSession'

const RESET_PASSWORD = gql`
  ${resetPassword}
`

export const useResetYourPassword = () => {
  const { t } = useTranslation()
  const route = useRoute()
  const navigation = useNavigation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState(null)
  // SEC-015: the OTP is read from the ephemeral in-memory store, not nav params.
  const initialSession = getResetSession() || {}
  const [email] = useState(initialSession.email ?? route?.params?.email)
  const [otp] = useState(initialSession.otp)

  // Clear the OTP from memory when leaving the screen (covers backing out without
  // completing the reset — "remove after used" for every exit path).
  useEffect(() => {
    return () => {
      clearResetSession()
    }
  }, [])

  const [mutate, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted,
    onError
  })

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  useEffect(() => {
    if (!email || !otp) {
      FlashMessage({
        message: 'This OTP is expired or invalid. Please request a new one.'
      })
      navigation.replace('ForgotPassword', { email })
    }
  }, [email, navigation, otp])

  function validateCredentials() {
    let result = true
    setPasswordError(null)
    if (!password) {
      setPasswordError(t('passErr1'))
      result = false
    } else {
      const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/
      if (passRegex.test(password) !== true) {
        setPasswordError(t('passErr2'))
        result = false
      }
    }
    if (!confirmPassword) {
      setConfirmPasswordError(t('confirmPassRequired'))
      result = false
    }
    return result
  }

  function onCompleted(data) {
    // Password changed — the OTP is spent; drop it immediately.
    clearResetSession()
    FlashMessage({
      message: t('passwordResetSuccessfully')
    })
    navigation.replace('Login')
  }

  function onError(error) {
    const rawMessage =
      error?.networkError?.result?.errors?.[0]?.message ||
      error?.graphQLErrors?.[0]?.message ||
      ''
    const normalizedMessage = rawMessage.toLowerCase()

    if (
      !otp ||
      normalizedMessage.includes('token') ||
      normalizedMessage.includes('expired') ||
      normalizedMessage.includes('invalid') ||
      normalizedMessage.includes('reuse')
    ) {
      FlashMessage({
        message: 'This OTP is expired or invalid. Please request a new one.'
      })
      navigation.replace('ForgotPassword', { email })
    } else if (error.networkError) {
      // networkError.result is null on raw connectivity failures — reuse the
      // safely-computed rawMessage and fall back to a friendly string (QUAL-008).
      FlashMessage({
        message: rawMessage || t('networkError')
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }

  function resetYourPassword() {
    // Re-read from the store at submit time so a background/kill/TTL clear
    // invalidates a stale OTP even if this screen stayed mounted.
    const currentOtp = getResetSession()?.otp
    if (!email || !currentOtp) {
      FlashMessage({
        message: 'This OTP is expired or invalid. Please request a new one.'
      })
      navigation.replace('ForgotPassword', { email })
      return
    }

    if (validateCredentials()) {
      if (password === confirmPassword) {
        mutate({ variables: { password, email: email.toLowerCase().trim(), otp: currentOtp } })
      } else {
        setConfirmPasswordError(t('passwordMustMatch'))
      }
    }
  }

  return {
    email,
    password,
    setPassword,
    confirmPassword,
    confirmPasswordError,
    setConfirmPassword,
    passwordError,
    resetPassword,
    currentTheme,
    themeContext,
    resetYourPassword,
    loading
  }
}
