import React, { useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TextInput
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FontAwesome } from '@expo/vector-icons'
import { useLogin } from './useLogin'
import screenOptions from './screenOptions'
import { useTranslation } from 'react-i18next'

function Login(props) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    registeredEmail,
    loading,
    loginLoading,
    loginAction,
    currentTheme,
    showPassword,
    setShowPassword,
    checkEmailExist
  } = useLogin()
  const { t } = useTranslation()
  const handleEmailChange = e => {
    setEmail(e)
  }
  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.fontMainColor,
        navigation: props.navigation
      })
    )
  }, [props.navigation])

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={styles(currentTheme).safeAreaViewStyles}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles().flex}>
        <ScrollView
          style={styles().flex}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}>
          <View style={styles(currentTheme).mainContainer}>
            <View style={styles().subContainer}>
              <View style={styles().logoContainer}>
                <Image
                  source={require('../../../assets/login-icon.png')}
                  style={styles().logoContainer}
                />
              </View>
              <View>
                <TextDefault
                  H3
                  bolder
                  style={{
                    textAlign: 'center',
                    ...alignment.MTlarge,
                    ...alignment.MBmedium
                  }}>
                  {t('whatsYourEmail')}
                </TextDefault>
                {registeredEmail === false && (
                  <TextDefault
                    H5
                    bold
                    textColor={currentTheme.horizontalLine}
                    style={{
                      textAlign: 'center'
                    }}>
                    {registeredEmail ? t('signInWithEmail') : t('checkAccount')}
                  </TextDefault>
                )}
              </View>
              <View style={styles().form}>
                <View>
                  <TextInput
                    placeholder={t('email')}
                    style={[
                      styles(currentTheme).textField,
                      emailError !== null ? styles(currentTheme).errorInput : {}
                    ]}
                    placeholderTextColor={currentTheme.fontSecondColor}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    defaultValue='demo-customer@enatega.com'
                  />
                  {emailError !== null && (
                    <TextDefault
                      style={styles().error}
                      bold
                      textColor={currentTheme.textErrorColor}>
                      {emailError}
                    </TextDefault>
                  )}
                </View>
                {registeredEmail && (
                  <>
                    <View style={styles().passwordField}>
                      <TextInput
                        defaultValue='DemoCustomer55!'
                        secureTextEntry={showPassword}
                        placeholder={t('password')}
                        style={[
                          styles(currentTheme).textField,
                          styles().passwordInput,
                          passwordError !== null
                            ? styles(currentTheme).errorInput
                            : {}
                        ]}
                        placeholderTextColor={currentTheme.fontSecondColor}
                        value={password}
                        onChangeText={e => setPassword(e)}
                      />
                      <FontAwesome
                        onPress={() => setShowPassword(!showPassword)}
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={24}
                        color={
                          passwordError === null
                            ? currentTheme.startColor
                            : currentTheme.textErrorColor
                        }
                        style={[
                          styles().eyeBtn,
                          Platform.OS === 'android' && { marginTop: 40 }
                        ]}
                      />
                    </View>
                    {passwordError !== null && (
                      <View>
                        <TextDefault
                          style={styles().error}
                          bold
                          textColor={currentTheme.textErrorColor}>
                          {passwordError}
                        </TextDefault>
                      </View>
                    )}
                    <TouchableOpacity
                      style={alignment.MBxSmall}
                      activeOpacity={0.7}
                      onPress={() =>
                        props.navigation.navigate('ForgotPassword', { email })
                      }>
                      <TextDefault
                        textColor={currentTheme.buttonBackgroundPink}
                        style={alignment.MTsmall}
                        bold>
                        {t('forgotPassword')}
                      </TextDefault>
                    </TouchableOpacity>
                  </>
                )}
                <View style={styles().marginTop10}>
                  <TouchableOpacity
                    onPress={() =>
                      registeredEmail
                        ? loginAction(email, password)
                        : checkEmailExist(email)
                    }
                    activeOpacity={0.7}
                    style={styles().btn}>
                    <TextDefault
                      H4
                      textColor={currentTheme.buttonTextPink}
                      style={alignment.MLsmall}
                      bold>
                      {loading || loginLoading ? (
                        <Spinner backColor="transparent" size="small" />
                      ) : (
                        t('continueBtn')
                      )}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login
