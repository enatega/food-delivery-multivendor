import { useState, useContext, useEffect, useRef } from 'react'
import { sendOtpToPhoneNumber, updateUser } from '../../../apollo/mutations'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import UserContext from '../../../context/User'
import { useNavigation, useRoute } from '@react-navigation/native'
import getEnvVars from '../../../../environment'

const SEND_OTP_TO_PHONE = gql`
  ${sendOtpToPhoneNumber}
`
const UPDATEUSER = gql`
  ${updateUser}
`
const { TEST_OTP } = getEnvVars()
const usePhoneOtp = () => {
  const navigation = useNavigation()
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
      message: 'OTP sent to your phone.'
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
      message: 'Phone number has been verified successfully!.'
    })
    route.params?.prevScreen
      ? navigation.navigate(route.params.prevScreen)
      : navigation.navigate({
        name: 'Main',
        merge: true
      })
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
    if (code === otpFrom.current || code === TEST_OTP) {
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
    otpFrom.current = Math.floor(100000 + Math.random() * 900000).toString()
    mutate({ variables: { phone: profile?.phone, otp: otpFrom.current } })
  }, [])

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
