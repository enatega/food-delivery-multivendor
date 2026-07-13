import { useLayoutEffect, useEffect, useRef } from 'react'
import { View, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import screenOptions from '../screenOptions'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import useEmailOtp from './useEmailOtp'
import { useTranslation } from 'react-i18next'
import { useRoute } from '@react-navigation/native'
import VerifyOtp from '../../../assets/SVG/imageComponents/VerifyOtp'
import OtpErrorDialogue from '../../../components/Auth/OtpErrorDialogue/OtpErrorDialogue'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import ResendTimer from '../../../components/ResendTimer/ResendTimer'
import useKeyboardState from '../../../singlevendor/utils/useKeyboardState'
import { useHeaderHeight } from '@react-navigation/elements'

function EmailOtp(props) {
  const scrollViewRef = useRef(null)
  const headerHeight = useHeaderHeight()
  const { isKeyboardVisible, keyboardHeight } = useKeyboardState()
  const route = useRoute()
  const userData = route?.params?.user
  const isPhoneExists = route?.params?.isPhoneExists || false
  const { otp, setOtp, otpError, seconds, loading, updateUserLoading, onCodeFilled, resendOtp, currentTheme, themeContext } = useEmailOtp(isPhoneExists)

  const { t, i18n } = useTranslation()
  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        iconColor: currentTheme.newIconColors,
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        navigation: props?.navigation
      })
    )
  }, [props?.navigation])

  useEffect(() => {
    if (!isKeyboardVisible) return

    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 120)

    return () => clearTimeout(timer)
  }, [isKeyboardVisible, keyboardHeight])

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar backgroundColor={currentTheme.themeBackground} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView style={styles().flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight + 30 : 30}>
        <ScrollView
          ref={scrollViewRef}
          style={styles().flex}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: isKeyboardVisible ? (Platform.OS === 'android' ? 20  : 30) : 0
          }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles(currentTheme).mainContainer}>
            <View style={styles().subContainer}>
              <VerifyOtp fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />
              <View>
                <TextDefault
                  H2
                  bolder
                  textColor={currentTheme.newFontcolor}
                  style={{
                    ...alignment.MTlarge,
                    ...alignment.MBmedium
                  }}
                  isRTL
                >
                  {t('verifyEmail')}
                </TextDefault>
                <TextDefault H5 bold textColor={currentTheme.fontSecondColor} isRTL>
                  {t('otpSentToEmail')}
                </TextDefault>
              </View>
              <View>
                <OTPInputView
                  pinCount={6}
                  style={styles().otpInput}
                  codeInputFieldStyle={[styles(currentTheme).otpBox, otpError && styles(currentTheme).errorInput]}
                  codeInputHighlightStyle={{
                    borderColor: currentTheme.primaryBlue
                  }}
                  autoFocusOnLoad
                  code={otp}
                  onCodeChanged={(code) => setOtp(code)}
                  editable
                />
                {otpError && <OtpErrorDialogue currentTheme={currentTheme} otpError='The code you entered is incorrect.' />}
                <ResendTimer currentTheme={currentTheme} duration={30} onResend={() => resendOtp()} />
              </View>
            </View>
            <View>{loading || (updateUserLoading && <Spinner backColor={currentTheme.themeBackground} spinnerColor={currentTheme.main} size='large' />)}</View>
            <View
              style={{
                ...alignment.MTlarge,
                ...alignment.MTlarge,
                width: '100%',
                marginBottom: 20
              }}
            >
              {loading || updateUserLoading ? <Spinner backColor={currentTheme.color3} spinnerColor={currentTheme.color3} size='small' /> : <ContinueWithPhoneButton title='getRegistered' onPress={() => onCodeFilled(otp)} isDisabled={otp.length < 6} />}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
export default EmailOtp
