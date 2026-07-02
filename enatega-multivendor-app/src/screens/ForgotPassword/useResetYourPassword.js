import { useState, useContext, useEffect } from 'react'
import { resetPassword } from '../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

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
  const [email] = useState(route?.params?.email)
  const [otp] = useState(route?.params?.otp)

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
      FlashMessage({
        message: error.networkError.result.errors[0].message
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }

  function resetYourPassword() {
    if (!email || !otp) {
      FlashMessage({
        message: 'This OTP is expired or invalid. Please request a new one.'
      })
      navigation.replace('ForgotPassword', { email })
      return
    }

    if (validateCredentials()) {
      if (password === confirmPassword) {
        mutate({ variables: { password, email: email.toLowerCase().trim(), otp } })
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
