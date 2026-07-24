import { useState, useContext, useEffect, useRef } from 'react'
import { sendOtpToPhoneNumber, updateUser, VERIFY_OTP } from '../../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import UserContext from '../../../context/User'
import { useNavigation, useRoute } from '@react-navigation/native'
import AuthContext from '../../../context/Auth'

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
  const autoSubmittedRef = useRef(false)
  const demoOtp = TEST_OTP || '111111'
  const { t } = useTranslation()
  const navigation = useNavigation()
  const configuration = useContext(ConfigurationContext)
  const isMobileVerificationSkipped =
    !!configuration?.skipMobileVerification
  const isDemoOtpEnabled = !!TEST_OTP
  const route = useRoute()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const { profile, loadingProfile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const [seconds, setSeconds] = useState(30)
  const { name, phone, screen, token } = route?.params || {}
  const { setTokenAsync } = useContext(AuthContext)
  const resolvedName = name ?? profile?.name ?? ''
  const resolvedPhone = phone ?? profile?.phone ?? ''

  useEffect(() => {
    let isMounted = true

    if (!token) {
      setAuthReady(true)
      return
    }

    ;(async () => {
      await setTokenAsync(token)
      if (isMounted) setAuthReady(true)
    })()

    return () => {
      isMounted = false
    }
  }, [setTokenAsync, token])

  function onError(error) {
    if (error.networkError) {
      // networkError.result is null on raw connectivity failures — guard the
      // chain and fall back to a friendly message instead of crashing (QUAL-004).
      FlashMessage({
        message:
          error.networkError?.result?.errors?.[0]?.message ?? t('networkError')
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
        message:
          error.networkError?.result?.errors?.[0]?.message ?? t('networkError')
      })
    } else if (error.graphQLErrors) {
      FlashMessage({
        message: error.graphQLErrors[0].message
      })
    }
  }

  async function onUpdateUserCompleted(data) {
    if (token) {
      await setTokenAsync(token)
    }

    FlashMessage({
      message: t('numberVerified')
    })
    if (token) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            params: {
              screen: 'Discovery'
            }
          }
        ]
      })
    } else if (!profile?.name) {
      navigation.navigate('Profile', { editName: true })
    } else if (screen === 'Checkout') {
      navigation.navigate('Checkout')
    } else {
      route.params?.prevScreen
        ? navigation.navigate(route.params.prevScreen)
        : navigation.navigate({
            name: 'Main',
            merge: true
          })
    }
  }

  const [sendOTPToPhone, { loading }] = useMutation(SEND_OTP_TO_PHONE, {
    onCompleted,
    onError
  })

  const [verifyOTP] = useMutation(VERIFY_OTP, {
    onError
  })

  const [mutateUser, { loading: updateUserLoading }] = useMutation(UPDATEUSER, {
    onCompleted: onUpdateUserCompleted,
    onError: onUpdateUserError
  })

  const onCodeFilled = async (otp_code) => {
    if (token && !authReady) {
      await setTokenAsync(token)
      setAuthReady(true)
    }

    if (isMobileVerificationSkipped) {
      await mutateUser({
        variables: {
          name: resolvedName,
          phone: resolvedPhone,
          phoneIsVerified: true
        }
      })
      return
    }

    const { data } = await verifyOTP({
      variables: {
        otp: otp_code,
        phone: resolvedPhone
      }
    })

    if (data?.verifyOtp) {
      await mutateUser({
        variables: {
          name: resolvedName,
          phone: resolvedPhone,
          phoneIsVerified: true
        }
      })
    } else {
      setOtpError(true)
    }
  }

  const onSendOTPHandler = () => {
    try {
      if (!profile?.phone && !phone) {
        FlashMessage({
          message: t('mobileErr1')
        })
        return
      }

      sendOTPToPhone({ variables: { phone: profile?.phone ?? phone } })
    } catch (err) {
      FlashMessage({
        message: t('somethingWentWrong')
      })
    }
  }

  const resendOtp = () => {
    onSendOTPHandler()
    setSeconds(30)
  }

  useEffect(() => {
    // Depend on [seconds] so the interval is recreated per tick instead of on
    // every render — otherwise the countdown resets continuously and the resend
    // button never re-enables (PERF-003 / QUAL-005).
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
  }, [seconds])

  useEffect(() => {
    if (!configuration) return
    if (!isMobileVerificationSkipped && !isDemoOtpEnabled) {
      onSendOTPHandler()
    }
  }, [configuration, phone])

  useEffect(() => {
    let timer = null
    if (!configuration) return
    if ((isMobileVerificationSkipped || isDemoOtpEnabled) && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true
      setOtp(demoOtp)
      timer = setTimeout(() => {
        onCodeFilled(demoOtp)
      }, 300)
    }

    return () => {
      timer && clearTimeout(timer)
    }
  }, [authReady, configuration, demoOtp, isDemoOtpEnabled, onCodeFilled])

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
    themeContext,
    loadingProfile,
    demoOtp,
    isDemoOtpEnabled: isMobileVerificationSkipped || isDemoOtpEnabled
  }
}

export default usePhoneOtp
