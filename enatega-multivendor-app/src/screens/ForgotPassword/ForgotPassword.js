import { useLayoutEffect, useEffect } from 'react'
import { View, StatusBar, Image, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import analytics from '../../utils/analytics'
import { useForgotPassword } from './useForgotPassword'
import { useTranslation } from 'react-i18next'
import ForgetPasswordSvg from '../../assets/SVG/imageComponents/ForgetPasswordSvg'

import useNetworkStatus from '../../utils/useNetworkStatus'
import ErrorView from '../../components/ErrorView/ErrorView'
import ContinueWithPhoneButton from '../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'

function ForgotPassword(props) {
  const Analytics = analytics()

  const { email, setEmail, emailError, forgotPassword, currentTheme, themeContext, loading } = useForgotPassword()
  const { t } = useTranslation()
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_FORGOTPASSWORD)
    }
    Track()
  }, [])

  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        iconColor: currentTheme.newIconColor,
        navigation: props?.navigation
      })
    )
  }, [props?.navigation])

  const { isConnected: connect, setIsConnected: setConnect } = useNetworkStatus()
  if (!connect) return <ErrorView refetchFunctions={[]} />

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar backgroundColor={currentTheme.themeBackground} barStyle={themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'} />
      <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
        <View style={styles(currentTheme).mainContainer}>
          <View style={styles().subContainer}>
            <View>
              <ForgetPasswordSvg />
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
              <TextDefault H5 bold textColor={currentTheme.fontSecondColor} style={styles().emailHeading} isRTL>
                {t('enterYourEmail')}
              </TextDefault>
            </View>
            <View>
              <TextInput placeholder={t('email')} style={[styles(currentTheme).textField, emailError !== null && styles(currentTheme).errorInput]} placeholderTextColor={currentTheme.fontSecondColor} value={email} onChangeText={(e) => setEmail(e)} />
              {emailError && (
                <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor}>
                  {emailError}
                </TextDefault>
              )}
            </View>
          </View>
          <View style={{ width: '100%', marginBottom: 20 }}>
            <ContinueWithPhoneButton title='continueBtn' onPress={() => forgotPassword()} isDisabled={email.length < 6} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
export default ForgotPassword
