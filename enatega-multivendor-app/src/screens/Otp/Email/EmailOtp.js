import React, { useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import screenOptions from '../screenOptions'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import useEmailOtp from './useEmailOtp'
import { useTranslation } from 'react-i18next'
import { SimpleLineIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { scale } from '../../../utils/scaling'
import SignUpSvg from '../../../assets/SVG/imageComponents/SignUpSvg'

function EmailOtp(props) {
  const route = useRoute()
  const userData = route?.params?.user
   const isPhoneExists = route?.params?.isPhoneExists || false
  const {
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
  } = useEmailOtp(isPhoneExists)

  
 

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

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar
        backgroundColor={currentTheme.themeBackground}
        barStyle={
          themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
        }
      />
      <ScrollView
        style={styles().flex}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        <View style={styles(currentTheme).mainContainer}>
          <View style={styles().subContainer}>
            <View>
              <SignUpSvg fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />
            </View>
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
              <TextDefault
                H5
                bold
                textColor={currentTheme.fontSecondColor}
                isRTL
                // style={{
                //   paddingBottom: scale(5)
                // }}
              >
                {t('otpSentToEmail')}
              </TextDefault>
              {/* <TextDefault H5 bold  textColor={currentTheme.newFontcolor}>
              {userData.email}
            </TextDefault> */}
            </View>
            <View>
              <OTPInputView
                pinCount={6}
                style={styles().otpInput}
                codeInputFieldStyle={[
                  styles(currentTheme).otpBox,
                  otpError && styles(currentTheme).errorInput
                ]}
                codeInputHighlightStyle={{
                  borderColor: currentTheme.main
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
                  style={styles(currentTheme).error}
                  bold
                  textColor={currentTheme.textErrorColor}
                >
                  {t('wrongOtp')}
                </TextDefault>
              )}
            </View>
          </View>
          <View>
            {loading ||
              (updateUserLoading && (
                <Spinner
                  backColor={currentTheme.themeBackground}
                  spinnerColor={currentTheme.main}
                  size='large'
                />
              ))}
          </View>
          <View
            style={{
              ...alignment.MTlarge,
              ...alignment.MTlarge,
              width: '100%',
              marginBottom: 20
            }}
          >
            <View style={alignment.MBxSmall}>
              <TextDefault
                center
                H4
                bold
                style={alignment.MTsmall}
                textColor={currentTheme.fontNewColor}
              >
                {seconds === 0 ? '' : `${t('retry')} ${seconds}s`}
              </TextDefault>
            </View>
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
                <TextDefault H4 textColor={currentTheme.black} bold>
                  {t('resendOtpBtn')}
                </TextDefault>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default EmailOtp
