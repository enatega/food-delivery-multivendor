import React, { useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  KeyboardAvoidingView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import screenOptions from '../screenOptions'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import usePhoneOtp from './usePhoneOtp'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'

function PhoneOtp(props) {
  const {
    phone,
    otp,
    setOtp,
    otpError,
    seconds,
    loading,
    updateUserLoading,
    onCodeFilled,
    resendOtp,
    currentTheme,
    themeContext
  } = usePhoneOtp()

  const { t } = useTranslation()
  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        iconColor: currentTheme.newIconColors,
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        navigation: props.navigation
      })
    )
  }, [props.navigation])

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar
        backgroundColor={currentTheme.themeBackground}
        barStyle={
          themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
        }
      />

      <View style={styles(currentTheme).mainContainer}>
        <View style={styles().subContainer}>
          <View style={styles().logoContainer}>
            <Ionicons name='phone-portrait-outline' size={30}  color={currentTheme.newIconColor}/>
          </View>
          <View>
            <TextDefault
              H3
              bolder
               textColor={currentTheme.newFontcolor}
              style={{
                ...alignment.MTlarge,
                ...alignment.MBmedium
              }}
            >
              {t('verifyPhone')}
            </TextDefault>
            <TextDefault
              H5
              bold
              textColor={currentTheme.color6}
              style={{
                paddingBottom: scale(5)
              }}
            >
              {t('enterOtp')}
            </TextDefault>
            <TextDefault H5 bold textColor={currentTheme.fontfourthColor}>
              {phone}
            </TextDefault>
          </View>
          <View>
            <OTPInputView
              pinCount={6}
              style={styles().otpInput}
              codeInputFieldStyle={[
                styles(currentTheme).otpBox,
                otpError && styles().errorInput
              ]}
              codeInputHighlightStyle={{
                borderColor: currentTheme.iconColorPink
              }}
              autoFocusOnLoad
              code={otp}
              onCodeChanged={(code) => setOtp(code)}
              onCodeFilled={(code) => {
                onCodeFilled(code)
              }}
              editable
            />
            {otpError && (
              <TextDefault
                style={styles().error}
                bold
                textColor={currentTheme.textErrorColor}
              >
                {t('wrongOtp')}
              </TextDefault>
            )}
          </View>
        </View>
        <View>
          {loading || updateUserLoading && (
            <Spinner
              backColor={currentTheme.themeBackground}
              spinnerColor={currentTheme.main}
              size='large'
            />
          )}
        </View>
        <View style={styles().btnContainer}>
          <View style={alignment.MBxSmall}>
            <TextDefault center H4 bold textColor={currentTheme.fontNewColor} style={alignment.MTsmall}>
              {seconds !== 0 ? `${t('retry')} ${seconds}s` : ''}
            </TextDefault>
          </View>
          <View>
            {loading || updateUserLoading ? (
              <Spinner
              backColor={currentTheme.color3}
              spinnerColor={currentTheme.color3}
                size='small'
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles(currentTheme).btn,
                  seconds !== 0 && styles(currentTheme).disabledBtn
                ]}
                disabled={seconds !== 0}
                onPress={() => resendOtp()}
              >
                <TextDefault
                  H4
                  textColor={currentTheme.black}
                  style={alignment.MLsmall}
                  bold
                >
                  {t('resendBtn')}
                </TextDefault>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default PhoneOtp
