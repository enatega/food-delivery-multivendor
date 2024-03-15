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
import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
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
                <SimpleLineIcons name="envelope" size={30} color="black" />
              </View>
              <View>
                <TextDefault
                  H3
                  bolder
                  style={{
                    ...alignment.MTlarge,
                    ...alignment.MBmedium
                  }}>
                  {registeredEmail
                    ? 'Enter Your Email and Password'
                    : t('whatsYourEmail')}
                </TextDefault>

                <TextDefault
                  H5
                  bold
                  textColor={currentTheme.horizontalLine}
                  style={{ ...alignment.MBmedium }}>
                  {registeredEmail
                    ? 'Your email already exists.'
                    : t('checkAccount')}
                </TextDefault>
              </View>
              <View style={styles().form}>
                <View>
                  <View>
                    <TextInput
                      placeholder={t('email')}
                      style={[
                        styles(currentTheme).textField,
                        emailError !== null
                          ? styles(currentTheme).errorInput
                          : {}
                      ]}
                      placeholderTextColor={currentTheme.fontSecondColor}
                      value={email}
                      onChangeText={e => setEmail(e.toLowerCase().trim())}
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
                              ? currentTheme.black
                              : currentTheme.textErrorColor
                          }
                          style={[
                            styles().eyeBtn
                            // Platform.OS === 'android' && { marginTop: 14 }
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
                        style={alignment.MBsmall}
                        activeOpacity={0.7}
                        onPress={() =>
                          props.navigation.navigate('ForgotPassword', { email })
                        }>
                        <TextDefault
                          textColor={currentTheme.main}
                          style={alignment.MTsmall}
                          bolder>
                          {t('forgotPassword')}
                        </TextDefault>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
                <View style={{ marginBottom: 20 }}>
                  <TouchableOpacity
                    onPress={() =>
                      registeredEmail
                        ? loginAction(email, password)
                        : checkEmailExist(email)
                    }
                    activeOpacity={0.7}
                    style={styles(currentTheme).btn}>
                    <TextDefault
                      H4
                      textColor={currentTheme.fontFourthColor}
                      bold>
                      {loading || loginLoading ? (
                        <Spinner backColor="transparent" size="small" />
                      ) : registeredEmail ? (
                        'Login'
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
