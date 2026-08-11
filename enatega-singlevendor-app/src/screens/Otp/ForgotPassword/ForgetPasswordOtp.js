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

function ForgotPasswordOtp(props) {
  const {
    otp,
    setOtp,
    otpError,
    seconds,
    currentTheme,
    loading,
    onCodeFilled,
    themeContext,
    resendOtp
  } = useForgotPasswordOtp()

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
      alwaysBounceVertical={false}>
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
              {t('forgotPassword')}
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
            {/* <TextDefault H5 bold textColor={currentTheme.newFontcolor}>
              {email}
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
                style={styles().error}
                bold
                  textColor={currentTheme.textErrorColor}
                  isRTL
              >
                {t('wrongOtp')}
              </TextDefault>
            )}
          </View>
        </View>
        <View style={{ ...alignment.MTlarge, width: '100%', marginBottom: 20 }}>
          <View style={alignment.MBxSmall}>
            <TextDefault
              center
              H4
              bold
              style={alignment.MTsmall}
                textColor={currentTheme.fontNewColor}
                isRTL
            >
              {seconds !== 0 ? `${t('retry')} ${seconds}s` : ''}
            </TextDefault>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles(currentTheme).btn,
              seconds !== 0 && styles(currentTheme).disabledBtn
            ]}
            disabled={seconds !== 0}
            onPress={() => resendOtp()}
          >
            {loading ? (
              <Spinner backColor='transparent' size='small' spinnerColor={currentTheme.main} />
            ) : (
              <TextDefault H4 textColor={currentTheme.black} bold>
                {t('resendOtpBtn')}
              </TextDefault>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default ForgotPasswordOtp
