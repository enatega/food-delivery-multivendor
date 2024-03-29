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
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'

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
  const { t } = useTranslation()
  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        iconColor: currentTheme.newIconColor,
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
            <Feather
              name="lock"
              size={30}
              color={currentTheme.newIconColor}
            />
          </View>
          <View>
            <TextDefault
              H3
              bolder
              textColor={currentTheme.newFontcolor}
              style={{
                ...alignment.MTlarge,
                ...alignment.MBmedium
              }}>
              {t('setYourPassword')}
            </TextDefault>
            <TextDefault
              H5
              bold
              textColor={currentTheme.fontSecondColor}
              style={styles().enterPass}>
              {t('enterPass')}
            </TextDefault>
          </View>
          <View style={styles().passwordField}>
            <TextInput
              secureTextEntry
              placeholder={t('password')}
              style={[
                styles(currentTheme).textField,
                styles().passwordInput,
                passwordError && styles(currentTheme).errorInput
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
          <View style={[styles().passwordField, styles().confirmField]}>
            <TextInput
              secureTextEntry
              placeholder={t('confirmPassword')}
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
        </View>
        <View style={{ width: '100%', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => resetYourPassword()}
            activeOpacity={0.7}
            style={styles(currentTheme).btn}>
            {loading ? (
              <Spinner size="small" backColor="transparent" spinnerColor={currentTheme.white}/>
            ) : (
              <TextDefault H4 textColor={currentTheme.black} bold>
                {t('saveBtn')}
              </TextDefault>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default ForgotPassword
