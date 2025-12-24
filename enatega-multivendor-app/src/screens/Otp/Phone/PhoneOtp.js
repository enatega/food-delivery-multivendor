import { useLayoutEffect } from 'react'
import { View, StatusBar, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import screenOptions from '../screenOptions'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import usePhoneOtp from './usePhoneOtp'
import { useTranslation } from 'react-i18next'
import VerifyOtp from '../../../assets/SVG/imageComponents/VerifyOtp'
import OtpErrorDialogue from '../../../components/Auth/OtpErrorDialogue/OtpErrorDialogue'
import ResendTimer from '../../../components/ResendTimer/ResendTimer'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'

function PhoneOtp(props) {
  const { phone, otp, setOtp, otpError, seconds, loading, updateUserLoading, onCodeFilled, resendOtp, currentTheme, themeContext } = usePhoneOtp()

  const { t } = useTranslation()
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

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar backgroundColor={currentTheme.themeBackground} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />

      <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
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
                {t('verifyPhone')}
              </TextDefault>
              <TextDefault H5 bold textColor={currentTheme.color6} isRTL>
                {t('enterOtp')}
              </TextDefault>
            </View>
            <View>
              <OTPInputView
                pinCount={6}
                style={styles().otpInput}
                codeInputFieldStyle={[styles(currentTheme).otpBox, otpError && styles().errorInput]}
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
          <View style={styles().btnContainer}>
            <View>{loading || updateUserLoading ? <Spinner backColor={currentTheme.color3} spinnerColor={currentTheme.color3} size='small' /> : <ContinueWithPhoneButton title='Verify OTP' onPress={() => onCodeFilled(otp)} isDisabled={otp.length < 6} />}</View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default PhoneOtp
