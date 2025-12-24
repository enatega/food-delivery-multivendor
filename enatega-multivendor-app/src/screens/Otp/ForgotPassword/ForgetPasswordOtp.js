import React, { useLayoutEffect } from 'react'
import { View, TouchableOpacity, StatusBar, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import screenOptions from '../screenOptions'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { useForgotPasswordOtp } from './useForgotPasswordOtp'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import { useRoute } from '@react-navigation/native'
import SignUpSvg from '../../../assets/SVG/imageComponents/SignUpSvg'
import VerifyOtp from '../../../assets/SVG/imageComponents/VerifyOtp'
import OtpErrorDialogue from '../../../components/Auth/OtpErrorDialogue/OtpErrorDialogue'
import ResendTimer from '../../../components/ResendTimer/ResendTimer'
import ContinueWithPhoneButton from '../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'
import { isLoaded, isLoading } from 'expo-font'

function ForgotPasswordOtp(props) {
  const { otp, setOtp, otpError, seconds, currentTheme, loading, onCodeFilled, themeContext, resendOtp } = useForgotPasswordOtp()

  const route = useRoute()
  const { email } = route.params

  const { t } = useTranslation()
  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        iconColor: currentTheme.newIconColor,
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
                {t('forgotPassword')}
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
          <View style={{ ...alignment.MTlarge, width: '100%', marginBottom: 20 }}>
            <ContinueWithPhoneButton title='Verify OTP' onPress={() => onCodeFilled(otp)} isLoading={loading} isDisabled={otp.length < 6} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default ForgotPasswordOtp
