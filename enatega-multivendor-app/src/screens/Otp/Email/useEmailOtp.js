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
import { getStoredReferralCode } from '../../../utils/branch.io'
import { getReferralCode } from '../../../utils/referralStorage'

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
      
      // Check if referral was processed during registration
      const referralData = await getStoredReferralCode()
      const storedReferralCode = await getReferralCode()
      const hadReferralCode = referralData?.code || storedReferralCode
      
      if (hadReferralCode) {
        // Clear the processed referral codes
        const { clearStoredReferralCode } = require('../../../utils/branch.io')
        const { clearReferralCode } = require('../../../utils/referralStorage')
        await clearStoredReferralCode()
        await clearReferralCode()
        
        // Referral was processed, go directly to phone verification
        navigation.navigate('PhoneOtp', {
          name: data?.createUser?.name,
          phone: data?.createUser?.phone
        })
      } else {
        // No referral processed, show referral entry screen after account creation
        navigation.navigate('ReferralCodeEntry', {
          isNewUser: true,
          onComplete: () => {
            navigation.navigate('PhoneOtp', {
              name: data?.createUser?.name,
              phone: data?.createUser?.phone
            })
          }
        })
      }
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

      const referralData = await getStoredReferralCode()
      const branchReferralCode = referralData?.code || null
      const storedReferralCode = await getReferralCode()
      const finalReferralCode = storedReferralCode || branchReferralCode

      await mutateUser({
        variables: {
          phone: user?.phone ?? '',
          email: user.email,
          password: user.password,
          name: user.name,
          picture: '',
          notificationToken: notificationToken,
          emailIsVerified: true,
          isPhoneExists: isPhoneExists || false,
          ...(finalReferralCode && { referralCode: finalReferralCode })
        }
      })
    } catch (error) {
      console.log('Error catched in mutateRegister:', error)
      FlashMessage({ message: t('somethingWentWrong') })
    }
  }

  const onCodeFilled = async (otp_code) => {
    if (configuration?.skipEmailVerification) {
      // If email verification is skipped, check if entered OTP matches test OTP
      if (TEST_OTP && otp_code === TEST_OTP) {
        // For email signup, navigate to referral entry instead of creating user here
        navigation.navigate('ReferralCodeEntry', {
          isNewUser: true,
          isEmailSignup: true,
          userData: {
            phone: user?.phone ?? '',
            email: user.email,
            password: user.password,
            name: user.name,
            isPhoneExists: isPhoneExists || false
          },
          onComplete: () => {
            // ReferralCodeEntry will handle user creation and navigation
          }
        })
        return
      } else if (!TEST_OTP) {
        // If no test OTP is set, navigate to referral entry
        navigation.navigate('ReferralCodeEntry', {
          isNewUser: true,
          isEmailSignup: true,
          userData: {
            phone: user?.phone ?? '',
            email: user.email,
            password: user.password,
            name: user.name,
            isPhoneExists: isPhoneExists || false
          },
          onComplete: () => {
            // ReferralCodeEntry will handle user creation and navigation
          }
        })
        return
      } else {
        // Wrong test OTP entered
        setOtpError(true)
        return
      }
    }

    // Normal OTP verification flow
    const { data } = await verifyOTP({
      variables: { otp: otp_code, email: user.email }
    })

    if (data?.verifyOtp) {
      // For email signup, navigate to referral entry instead of creating user here
      navigation.navigate('ReferralCodeEntry', {
        isNewUser: true,
        isEmailSignup: true,
        userData: {
          phone: user?.phone ?? '',
          email: user.email,
          password: user.password,
          name: user.name,
          isPhoneExists: isPhoneExists || false
        },
        onComplete: () => {
          // ReferralCodeEntry will handle user creation and navigation
        }
      })
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
  }, [seconds])

  useEffect(() => {
    if (!configuration) return
    if (!configuration.skipEmailVerification) {
      sendOTPToEmail({ variables: { email: user.email } })
    }
  }, [configuration])

  useEffect(() => {
    let timer = null
    if (!configuration) return
    if (configuration.skipEmailVerification && TEST_OTP) {
      setOtp(TEST_OTP)
      timer = setTimeout(async () => {
        await onCodeFilled(TEST_OTP)
      }, 3000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [configuration, TEST_OTP])

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
