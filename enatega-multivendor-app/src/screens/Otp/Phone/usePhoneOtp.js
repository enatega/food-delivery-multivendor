import { useState, useContext, useEffect, useRef, useCallback } from 'react'
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
  const { name, phone, screen, token, prevScreen } = route?.params || {}
  const { setTokenAsync } = useContext(AuthContext)
  const resolvedName = name ?? profile?.name ?? ''
  const resolvedPhone = phone ?? profile?.phone ?? ''

  const logNavigationState = stage => {
    const state = navigation.getState()
    console.log(`[PhoneChange][PhoneOtp] Navigation state: ${stage}`, {
      index: state?.index ?? null,
      routes: state?.routes?.map(item => item.name) ?? []
    })
  }

  useEffect(() => {
    console.log('[PhoneChange][PhoneOtp] Mounted', {
      prevScreen: prevScreen ?? null,
      sourceScreen: screen ?? null,
      hasToken: Boolean(token),
      hasRouteName: Boolean(name),
      hasRoutePhone: Boolean(phone),
      hasProfile: Boolean(profile),
      hasProfileName: Boolean(profile?.name),
      hasProfilePhone: Boolean(profile?.phone),
      resolvedPhoneLength: resolvedPhone.length,
      skipMobileVerification: isMobileVerificationSkipped,
      demoOtpEnabled: isDemoOtpEnabled,
      configurationReady: Boolean(configuration)
    })
    logNavigationState('mount')

    return () => {
      console.log('[PhoneChange][PhoneOtp] Unmounted')
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!token) {
      console.log('[PhoneChange][PhoneOtp] No auth token handoff required')
      setAuthReady(true)
      return
    }

    console.log('[PhoneChange][PhoneOtp] Applying auth token before verification')
    ;(async () => {
      await setTokenAsync(token)
      console.log('[PhoneChange][PhoneOtp] Auth token applied', {
        stillMounted: isMounted
      })
      if (isMounted) setAuthReady(true)
    })()

    return () => {
      isMounted = false
    }
  }, [setTokenAsync, token])

  function onError(error) {
    console.log('[PhoneChange][PhoneOtp] OTP request/verification failed', {
      message: error?.message ?? null,
      hasNetworkError: Boolean(error?.networkError),
      graphQLErrorCount: error?.graphQLErrors?.length ?? 0
    })
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
    console.log('[PhoneChange][PhoneOtp] OTP send mutation completed', {
      hasResponse: Boolean(data)
    })
    FlashMessage({
      message: t('otpSentToPhone')
    })
  }

  function onUpdateUserError(error) {
    console.log('[PhoneChange][PhoneOtp] Verified-user update failed', {
      message: error?.message ?? null,
      hasNetworkError: Boolean(error?.networkError),
      graphQLErrorCount: error?.graphQLErrors?.length ?? 0
    })
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
    console.log('[PhoneChange][PhoneOtp] Verified-user update completed', {
      returnedUser: Boolean(data?.updateUser?._id),
      returnedPhoneVerified: data?.updateUser?.phoneIsVerified ?? null,
      prevScreen: prevScreen ?? null,
      sourceScreen: screen ?? null,
      hasToken: Boolean(token),
      hasProfileName: Boolean(profile?.name)
    })
    if (token) {
      console.log('[PhoneChange][PhoneOtp] Reapplying auth token after update')
      await setTokenAsync(token)
    }

    FlashMessage({
      message: t('numberVerified')
    })
    if (token) {
      console.log('[PhoneChange][PhoneOtp] Navigation decision: reset to Main/Discovery')
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
      console.log('[PhoneChange][PhoneOtp] Navigation decision: Profile edit-name')
      navigation.navigate('Profile', { editName: true })
    } else if (screen === 'Checkout') {
      console.log('[PhoneChange][PhoneOtp] Navigation decision: Checkout')
      navigation.navigate('Checkout')
    } else if (prevScreen === 'Account') {
      console.log('[PhoneChange][PhoneOtp] Navigation decision: Main/Profile')
      navigation.navigate('Main', { screen: 'Profile' })
    } else if (prevScreen) {
      console.log('[PhoneChange][PhoneOtp] Navigation decision: previous screen', {
        target: prevScreen
      })
      navigation.navigate(prevScreen)
    } else {
      console.log('[PhoneChange][PhoneOtp] Navigation decision: Main fallback')
      navigation.navigate({
        name: 'Main',
        merge: true
      })
    }

    logNavigationState('immediately after navigation command')
    setTimeout(() => logNavigationState('next tick after navigation command'), 0)
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

  const onCodeFilled = useCallback(async (otp_code) => {
    console.log('[PhoneChange][PhoneOtp] OTP submission started', {
      otpLength: otp_code?.length ?? 0,
      hasToken: Boolean(token),
      authReady,
      skipMobileVerification: isMobileVerificationSkipped,
      resolvedPhoneLength: resolvedPhone.length
    })
    if (token && !authReady) {
      console.log('[PhoneChange][PhoneOtp] Waiting for auth token during submission')
      await setTokenAsync(token)
      setAuthReady(true)
      console.log('[PhoneChange][PhoneOtp] Auth token ready during submission')
    }

    if (isMobileVerificationSkipped) {
      console.log('[PhoneChange][PhoneOtp] Verification skipped; updating user as verified')
      await mutateUser({
        variables: {
          name: resolvedName,
          phone: resolvedPhone,
          phoneIsVerified: true
        }
      })
      return
    }

    console.log('[PhoneChange][PhoneOtp] Calling verifyOtp mutation')
    const { data } = await verifyOTP({
      variables: {
        otp: otp_code,
        phone: resolvedPhone
      }
    })
    console.log('[PhoneChange][PhoneOtp] verifyOtp mutation completed', {
      verified: Boolean(data?.verifyOtp)
    })

    if (data?.verifyOtp) {
      console.log('[PhoneChange][PhoneOtp] OTP verified; updating user as verified')
      await mutateUser({
        variables: {
          name: resolvedName,
          phone: resolvedPhone,
          phoneIsVerified: true
        }
      })
    } else {
      console.log('[PhoneChange][PhoneOtp] OTP rejected')
      setOtpError(true)
    }
  }, [
    authReady,
    isMobileVerificationSkipped,
    mutateUser,
    resolvedName,
    resolvedPhone,
    setTokenAsync,
    token,
    verifyOTP
  ])

  const onSendOTPHandler = () => {
    console.log('[PhoneChange][PhoneOtp] OTP send requested', {
      phoneSource: phone ? 'route' : profile?.phone ? 'profile' : 'missing',
      phoneLength: (phone ?? profile?.phone ?? '').length
    })
    try {
      if (!phone && !profile?.phone) {
        console.log('[PhoneChange][PhoneOtp] OTP send blocked: phone missing')
        FlashMessage({
          message: t('mobileErr1')
        })
        return
      }

      sendOTPToPhone({ variables: { phone: phone ?? profile?.phone } })
    } catch (err) {
      console.log('[PhoneChange][PhoneOtp] OTP send threw synchronously', {
        message: err?.message ?? null
      })
      FlashMessage({
        message: t('somethingWentWrong')
      })
    }
  }

  const resendOtp = () => {
    console.log('[PhoneChange][PhoneOtp] Resend OTP pressed')
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
    console.log('[PhoneChange][PhoneOtp] OTP-send effect evaluated', {
      configurationReady: Boolean(configuration),
      skipMobileVerification: isMobileVerificationSkipped,
      demoOtpEnabled: isDemoOtpEnabled,
      hasRoutePhone: Boolean(phone)
    })
    if (!configuration) return
    if (!isMobileVerificationSkipped && !isDemoOtpEnabled) {
      onSendOTPHandler()
    }
  }, [configuration, phone])

  useEffect(() => {
    console.log('[PhoneChange][PhoneOtp] Auto-submit effect evaluated', {
      configurationReady: Boolean(configuration),
      authReady,
      skipMobileVerification: isMobileVerificationSkipped,
      demoOtpEnabled: isDemoOtpEnabled,
      alreadySubmitted: autoSubmittedRef.current
    })
    if (!configuration) return
    if ((isMobileVerificationSkipped || isDemoOtpEnabled) && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true
      console.log('[PhoneChange][PhoneOtp] Prefilling and submitting demo OTP', {
        otpLength: demoOtp.length
      })
      setOtp(demoOtp)
      void onCodeFilled(demoOtp)
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
