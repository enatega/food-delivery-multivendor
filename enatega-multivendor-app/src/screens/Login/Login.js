import { useLayoutEffect } from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FontAwesome } from '@expo/vector-icons'
import { useLogin } from './useLogin'
import screenOptions from './screenOptions'
import { useTranslation } from 'react-i18next'
import { useHeaderHeight } from '@react-navigation/elements'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import Auth from '../../assets/SVG/imageComponents/Auth'
import ContinueWithPhoneButton from '../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'

function Login(props) {
  const { setEmail, password, setPassword, emailError, passwordError, registeredEmail, loading, loginLoading, loginAction, currentTheme, showPassword, setShowPassword, checkEmailExist, emailRef, themeContext, handleSetEmail } = useLogin()
  const { t } = useTranslation()
  const headerHeight = useHeaderHeight()
  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        iconColor: currentTheme.newIconColor,
        navigation: props?.navigation
      })
    )
  }, [props?.navigation])

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView />

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles(currentTheme).safeAreaViewStyles}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles().flex} keyboardVerticalOffset={headerHeight}>
        <StatusBar backgroundColor={currentTheme.themeBackground} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />
        <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
          <View style={styles(currentTheme).mainContainer}>
            <View style={styles().subContainer}>
              <View>
                <Auth fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />
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
                  {registeredEmail ? t('yourEmailPassword') : t('yourEmail')}
                </TextDefault>

                <TextDefault H5 bold textColor={currentTheme.horizontalLine} style={{ ...alignment.MBmedium }} isRTL>
                  {registeredEmail ? t('emailExists') : t('checkAccount')}
                </TextDefault>
              </View>
              <View style={styles().form}>
                <View>
                  {!registeredEmail && (
                    <View>
                      <TextInput
                        placeholder={t('email')}
                        style={[styles(currentTheme).textField, emailError !== null ? styles(currentTheme).errorInput : {}]}
                        placeholderTextColor={currentTheme.fontSecondColor}
                        // value={setEmail}
                        // defaultValue='demo-customer@enatega.com'
                        defaultValue=''
                        onChangeText={(e) => handleSetEmail(e.toLowerCase().trim())}
                      />
                      {emailError !== null && (
                        <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                          {emailError}
                        </TextDefault>
                      )}
                    </View>
                  )}
                  {registeredEmail && (
                    <>
                      <View style={styles(currentTheme).passwordField}>
                        <TextInput secureTextEntry={showPassword} placeholder={t('password')} style={[styles(currentTheme).textField, styles().passwordInput, passwordError !== null ? styles(currentTheme).errorInput : {}]} placeholderTextColor={currentTheme.fontSecondColor} value={password} onChangeText={(e) => setPassword(e)} />
                        <FontAwesome onPress={() => setShowPassword(!showPassword)} name={showPassword ? 'eye-slash' : 'eye'} size={24} color={passwordError === null ? currentTheme.newFontcolor : currentTheme.textErrorColor} style={[styles(currentTheme).eyeBtn]} />
                      </View>
                      {passwordError !== null && (
                        <View>
                          <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                            {passwordError}
                          </TextDefault>
                        </View>
                      )}
                      <TouchableOpacity
                        style={alignment.MBsmall}
                        activeOpacity={0.7}
                        onPress={() =>
                          props?.navigation.navigate('ForgotPassword', {
                            email: emailRef.current
                          })
                        }
                      >
                        <TextDefault textColor={currentTheme.linkColor} style={alignment.MTsmall} bolder isRTL>
                          {t('forgotPassword')}
                        </TextDefault>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              <View style={styles().btnContainer}>
                <ContinueWithPhoneButton title='continueBtn' onPress={() => (registeredEmail ? loginAction(emailRef.current, password) : checkEmailExist())} isLoading={loading} isDisabled={loading || loginLoading} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login
