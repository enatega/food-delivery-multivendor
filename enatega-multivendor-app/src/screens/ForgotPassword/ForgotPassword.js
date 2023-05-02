import React, { useLayoutEffect, useEffect } from 'react'
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
import Analytics from '../../utils/analytics'
import { useForgotPassword } from './useForgotPassword'
import i18n from '../../../i18n'

function ForgotPassword(props) {
  const {
    email,
    setEmail,
    emailError,
    forgotPassword,
    currentTheme,
    themeContext,
    loading
  } = useForgotPassword()

  useEffect(async() => {
    await Analytics.track(Analytics.events.NAVIGATE_TO_FORGOTPASSWORD)
  }, [])

  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
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
              {i18n.t('forgotPassword')}
            </TextDefault>
            <TextDefault
              H5
              bold
              textColor={currentTheme.fontSecondColor}
              style={{
                textAlign: 'center'
              }}>
              {i18n.t('enterYourEmail')}
            </TextDefault>
          </View>
          <View style={{ ...alignment.MTmedium }}>
            <TextInput
              placeholder="Email"
              style={[
                styles(currentTheme).textField,
                emailError !== null && styles(currentTheme).errorInput
              ]}
              placeholderTextColor={currentTheme.fontSecondColor}
              value={email}
              onChangeText={e => setEmail(e)}
            />
            {emailError && (
              <TextDefault
                style={styles().error}
                bold
                textColor={currentTheme.textErrorColor}>
                {emailError}
              </TextDefault>
            )}
          </View>
          <View style={styles().marginTop10}>
            {loading ? (
              <Spinner backColor="transparent" size="small" />
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles(currentTheme).btn}
                onPress={() => forgotPassword()}>
                <TextDefault
                  H4
                  textColor={currentTheme.buttonTextPink}
                  style={alignment.MLsmall}
                  bold>
                  {i18n.t('continueBtn')}
                </TextDefault>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={alignment.MBxSmall}
            activeOpacity={0.7}
            onPress={() => props.navigation.goBack()}>
            <TextDefault
              center
              H5
              bold
              textColor={currentTheme.buttonBackgroundPink}
              style={alignment.MTsmall}>
              {i18n.t('backToLogin')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default ForgotPassword
