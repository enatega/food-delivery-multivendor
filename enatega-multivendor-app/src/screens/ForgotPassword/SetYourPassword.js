import React, { useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import { useResetYourPassword } from './useResetYourPassword'
import i18n from '../../../i18n'

function ForgotPassword(props) {
  const {
    password,
    setPassword,
    confirmPassword,
    confirmPasswordError,
    setConfirmPassword,
    passwordError,
    currentTheme,
    themeContext,
    resetYourPassword,
    loading
  } = useResetYourPassword()

  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        iconColor: currentTheme.iconColorPink,
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.fontMainColor,
        navigation: props.navigation
      })
    )
  }, [props.navigation])

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar
        backgroundColor={currentTheme.buttonText}
        barStyle={
          themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
        }
      />
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
              {i18n.t('setYourPassword')}
            </TextDefault>
            <TextDefault
              H5
              bold
              textColor={currentTheme.fontSecondColor}
              style={{
                textAlign: 'center'
              }}>
              {i18n.t('enterPass')}
            </TextDefault>
          </View>
          <View style={styles().passwordField}>
            <TextInput
              secureTextEntry
              placeholder="Password"
              style={[
                styles(currentTheme).textField,
                styles().passwordInput,
                passwordError && styles().errorInput
              ]}
              placeholderTextColor={currentTheme.fontSecondColor}
              value={password}
              onChangeText={e => setPassword(e)}
            />
          </View>
          {passwordError && (
            <View>
              <TextDefault
                style={styles().error}
                bold
                textColor={currentTheme.textErrorColor}>
                {passwordError}
              </TextDefault>
            </View>
          )}
          <View style={styles().passwordField}>
            <TextInput
              secureTextEntry
              placeholder="Confirm Password"
              style={[
                styles(currentTheme).textField,
                styles().passwordInput,
                confirmPasswordError && styles(currentTheme).errorInput
              ]}
              placeholderTextColor={currentTheme.fontSecondColor}
              value={confirmPassword}
              onChangeText={e => setConfirmPassword(e)}
            />
          </View>
          {confirmPasswordError && (
            <View>
              <TextDefault
                style={styles().error}
                bold
                textColor={currentTheme.textErrorColor}>
                {confirmPasswordError}
              </TextDefault>
            </View>
          )}
          <View style={styles().marginTop10}>
            <TouchableOpacity
              onPress={() => resetYourPassword()}
              activeOpacity={0.7}
              style={styles().btn}>
              <TextDefault
                H4
                textColor={currentTheme.buttonTextPink}
                style={alignment.MLsmall}
                bold>
                {loading ? (
                  <Spinner size="small" backColor="transparent" />
                ) : (
                  i18n.t('saveBtn')
                )}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default ForgotPassword
