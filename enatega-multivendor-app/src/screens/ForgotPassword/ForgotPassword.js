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
import analytics from '../../utils/analytics'
import { useForgotPassword } from './useForgotPassword'
import {useTranslation} from 'react-i18next'

function ForgotPassword(props) {
  const Analytics = analytics()

  const {
    email,
    setEmail,
    emailError,
    forgotPassword,
    currentTheme,
    themeContext,
    loading
  } = useForgotPassword()
  const {t} = useTranslation()
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_FORGOTPASSWORD)
    }
    Track()
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
              {t('forgotPassword')}
            </TextDefault>
            <TextDefault
              H5
              bold
              textColor={currentTheme.fontSecondColor}
              style={{
                textAlign: 'center'
              }}>
              {t('enterYourEmail')}
            </TextDefault>
          </View>
          <View style={{ ...alignment.MTmedium }}>
            <TextInput
              placeholder={t('email')}
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
                  {t('continueBtn')}
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
              {t('backToLogin')}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
export default ForgotPassword
