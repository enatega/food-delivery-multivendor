import { useState, useContext } from 'react'
import { forgotPassword } from '../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { useNavigation, useRoute } from '@react-navigation/native'
import {useTranslation} from 'react-i18next'

const FORGOT_PASSWORD = gql`
  ${forgotPassword}
`
export const useForgotPassword = () => {
  const {t, i18n} = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const [email, setEmail] = useState(route.params?.email || '')
  const [emailError, setEmailError] = useState(null)
  const [otp] = useState(Math.floor(100000 + Math.random() * 900000).toString())

  const [mutate, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted,
    onError
  })

  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}

  function validateCredentials() {
    let result = true
    setEmailError(null)
    if (!email) {
      setEmailError(t('emailErr1'))
      result = false
    } else {
      const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
      if (emailRegex.test(email) !== true) {
        setEmailError(t('emailErr2'))
        result = false
      }
    }
    return result
  }

  function forgotPassword() {
    if (validateCredentials()) {
      mutate({ variables: { email: email.toLowerCase().trim() } })
    }
  }

  function onCompleted(data) {
    FlashMessage({
      message: t('otpForResetPassword')
    })
    navigation.navigate('ForgotPasswordOtp', { email })
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
  return {
    email,
    setEmail,
    emailError,
    otp,
    onError,
    onCompleted,
    forgotPassword,
    themeContext,
    currentTheme,
    loading
  }
}
