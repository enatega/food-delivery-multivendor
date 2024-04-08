import { useState, useContext, useEffect, useRef } from 'react'
import { sendOtpToPhoneNumber, updateUser } from '../../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import UserContext from '../../../context/User'
import { useNavigation, useRoute } from '@react-navigation/native'

import useEnvVars from '../../../../environment'

import { useTranslation } from 'react-i18next'
import ConfigurationContext from '../../../context/Configuration'

const SEND_OTP_TO_PHONE = gql`
  ${sendOtpToPhoneNumber}
`
const UPDATEUSER = gql`
  ${updateUser}
`

const usePhoneOtp = () => {
  const { TEST_OTP } = useEnvVars()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)
  const route = useRoute()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const otpFrom = useRef(null)
  const { profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [seconds, setSeconds] = useState(30)

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
      message: t('otpSentToPhone')
    })
  }

  function onUpdateUserError(error) {
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

  function onUpdateUserCompleted(data) {
    FlashMessage({
      message: t('numberVerified')
    })
    if (!profile?.name) navigation.navigate('Profile', { editName: true })
    else {
      route.params?.prevScreen
      ? navigation.navigate(route.params.prevScreen)
      : navigation.navigate({
        name: 'Main',
        merge: true
      })
    }
  }

  const [mutate, { loading }] = useMutation(SEND_OTP_TO_PHONE, {
    onCompleted,
    onError
  })

  const [mutateUser, { loading: updateUserLoading }] = useMutation(UPDATEUSER, {
    onCompleted: onUpdateUserCompleted,
    onError: onUpdateUserError
  })

  const onCodeFilled = code => {
    if (configuration.skipMobileVerification || code === otpFrom.current || code === TEST_OTP) {
      mutateUser({
        variables: {
          name: profile.name,
          phone: profile.phone,
          phoneIsVerified: true
        }
      })
    } else {
      setOtpError(true)
    }
  }

  const resendOtp = () => {
    otpFrom.current = Math.floor(100000 + Math.random() * 900000).toString()
    mutate({ variables: { phone: profile.phone, otp: otpFrom.current } })
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
    if (!configuration.skipMobileVerification) {
      otpFrom.current = Math.floor(100000 + Math.random() * 900000).toString()
      mutate({ variables: { phone: profile?.phone, otp: otpFrom.current } })
    }
  }, [configuration])

  useEffect(() => {
    let timer = null
    if (!configuration || !profile) return
    if (configuration.skipMobileVerification) {
      setOtp(TEST_OTP)
      timer = setTimeout(() => {
        onCodeFilled(TEST_OTP)
      }, 3000)
    }

    return () => { timer && clearTimeout(timer) }
  }, [configuration, profile])

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

export default usePhoneOtp
