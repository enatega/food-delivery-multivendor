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
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'

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
  const { t } = useTranslation()
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
        iconColor:currentTheme.newIconColor,
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
              {t('forgotPassword')}
            </TextDefault>
            <TextDefault
              H5
              bold
              textColor={currentTheme.fontSecondColor}
              style={styles().emailHeading}>
              {t('enterYourEmail')}
            </TextDefault>
          </View>
          <View>
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
        </View>
        <View style={{ width: '100%', marginBottom: 20 }}>
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles(currentTheme).btn}
              onPress={() => forgotPassword()}>
              <TextDefault H4 textColor={currentTheme.black} bold>
                {loading ? (
                  <Spinner
                  backColor='transparent'
                  spinnerColor={currentTheme.white}
                    size="small"
                  />
                ) : (
                  t('continueBtn')
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
