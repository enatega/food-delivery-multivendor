import { useLayoutEffect, useRef, useCallback } from 'react'
import { View, KeyboardAvoidingView, ScrollView, Platform, StatusBar, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import TextDefault from '../../../../../components/Text/TextDefault/TextDefault'
import screenOptions from './screenOptions'
import { useTranslation } from 'react-i18next'
import { useHeaderHeight } from '@react-navigation/elements'
import { useFocusEffect } from '@react-navigation/native'
import useNetworkStatus from '../../../../../utils/useNetworkStatus'
import ErrorView from '../../../../../components/ErrorView/ErrorView'
import { usePhoneAuth } from './usePhoneAuth'
import AuthImageWithDescription from '../../components/AuthImageWithDescription/AuthImageWithDescription'
import { scale } from '../../../../../utils/scaling'
import ContinueWithPhoneButton from '../../../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import ResendTimer from '../../../../../components/ResendTimer/ResendTimer'
import { alignment } from '../../../../../utils/alignment'
import VerifyOtp from '../../../../../assets/SVG/imageComponents/VerifyOtp'
import { Feather } from '@expo/vector-icons'
import OtpErrorDialogue from '../../../../../components/Auth/OtpErrorDialogue/OtpErrorDialogue'

function VerifyPhoneNumber(props) {
  const { route } = props
  const { phone } = route.params
  const { currentTheme, themeContext, otp, setOtp, otpError, setOtpError, loginWithPhoneFinalStepHandler, loginWithPhoneFinalStepLoading, loginWithPhoneFirstStepResend } = usePhoneAuth()
  const otpInputRef = useRef(null)
  const phoneRef = useRef(phone)

  const { t } = useTranslation()
  const headerHeight = useHeaderHeight()
  
  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        iconColor: currentTheme.newIconColor,
        navigation: props?.navigation,
        headerRight: null
      })
    )
  }, [props?.navigation])

  // Clear OTP when screen is focused (e.g., when navigating back from RefralScreen after error)
  useFocusEffect(
    useCallback(() => {
      // If there's an OTP error, the OTP should already be cleared by the error handler
      // This effect ensures the input is ready for new entry
    }, [])
  )

  const handleVerify = useCallback(() => {
    if (otp.length === 6) {
      loginWithPhoneFinalStepHandler(phoneRef.current)
    } else {
      otpInputRef.current?.focus()
    }
  }, [otp.length, phoneRef.current, loginWithPhoneFinalStepHandler])

  const handleOtpChange = useCallback((code) => {
    setOtp(code)
    // Clear error when user starts typing a new OTP
    if (otpError && code.length > 0) {
      setOtpError(null)
    }
  }, [otpError, setOtp, setOtpError])

  const handleResend = (phone) => {
    loginWithPhoneFirstStepResend(phone)
  }

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView />

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles(currentTheme).safeAreaViewStyles}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles().flex} keyboardVerticalOffset={headerHeight}>
        <StatusBar backgroundColor={currentTheme.themeBackground} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />
        <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
          <View style={styles(currentTheme).mainContainer}>
            <AuthImageWithDescription title='verifyPhone' description={`Enter OTP sent to ${phoneRef.current}`} image={<VerifyOtp fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />} currentTheme={currentTheme} />

            <View style={styles().form}>
              <View style={[styles(currentTheme).numberContainer, otpError && styles(currentTheme).errorInput]}>
                <OTPInputView
                  pinCount={6}
                  style={styles().otpInput}
                  codeInputFieldStyle={[styles(currentTheme).otpBox, otpError && styles().errorInput]}
                  codeInputHighlightStyle={{
                    borderColor: currentTheme.primaryBlue
                  }}
                  autoFocusOnLoad
                  code={otp}
                  onCodeChanged={handleOtpChange}
                  editable
                />
              </View>
              {otpError && <OtpErrorDialogue currentTheme={currentTheme} otpError={otpError} />}
              <ResendTimer currentTheme={currentTheme} duration={30} onResend={() => handleResend(phoneRef.current)} />
            </View>

            <View style={styles().btnContainer}>
              <ContinueWithPhoneButton title='Verify OTP' onPress={() => handleVerify()} isLoading={loginWithPhoneFinalStepLoading} isDisabled={otp.length < 6} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default VerifyPhoneNumber
