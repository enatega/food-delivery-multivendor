import React, { useLayoutEffect } from 'react'
import { View, TouchableOpacity, StatusBar, Image, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import { useResetYourPassword } from './useResetYourPassword'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'
import SignUpSvg from '../../assets/SVG/imageComponents/SignUpSvg'
import VerifyOtp from '../../assets/SVG/imageComponents/VerifyOtp'
import ForgetPasswordSvg from '../../assets/SVG/imageComponents/ForgetPasswordSvg'
import ContinueWithPhoneButton from '../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'

function ForgotPassword(props) {
  const { password, setPassword, confirmPassword, confirmPasswordError, setConfirmPassword, passwordError, currentTheme, themeContext, resetYourPassword, loading } = useResetYourPassword()
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
            <ForgetPasswordSvg />
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
                {t('setYourPassword')}
              </TextDefault>
              <TextDefault H5 bold textColor={currentTheme.fontSecondColor} style={styles().enterPass} isRTL>
                {t('enterPass')}
              </TextDefault>
            </View>
            <View style={styles().passwordField}>
              <TextInput secureTextEntry placeholder={t('password')} style={[styles(currentTheme).textField, styles(currentTheme).passwordInput, passwordError && styles(currentTheme).errorInput]} placeholderTextColor={currentTheme.fontSecondColor} value={password} onChangeText={(e) => setPassword(e)} />
            </View>
            {passwordError && (
              <View>
                <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                  {passwordError}
                </TextDefault>
              </View>
            )}
            <View style={[styles().passwordField, styles().confirmField]}>
              <TextInput secureTextEntry placeholder={t('confirmPassword')} style={[styles(currentTheme).textField, styles(currentTheme).passwordInput, confirmPasswordError && styles(currentTheme).errorInput]} placeholderTextColor={currentTheme.fontSecondColor} value={confirmPassword} onChangeText={(e) => setConfirmPassword(e)} />
            </View>
            {confirmPasswordError && (
              <View>
                <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                  {confirmPasswordError}
                </TextDefault>
              </View>
            )}
          </View>
          <View style={{ width: '100%', marginBottom: 20 }}>
            <ContinueWithPhoneButton title='Set new password' onPress={() => resetYourPassword()} isLoading={loading} isDisabled={!password || password !== confirmPassword} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default ForgotPassword
