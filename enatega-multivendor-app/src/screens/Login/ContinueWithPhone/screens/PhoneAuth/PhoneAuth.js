import { useLayoutEffect, useState } from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image, TextInput, StatusBar, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import TextDefault from '../../../../../components/Text/TextDefault/TextDefault'
import { Entypo } from '@expo/vector-icons'
import screenOptions from './screenOptions'
import { useTranslation } from 'react-i18next'
import { useHeaderHeight } from '@react-navigation/elements'
import CountryPicker from 'react-native-country-picker-modal'

import useNetworkStatus from '../../../../../utils/useNetworkStatus'
import ErrorView from '../../../../../components/ErrorView/ErrorView'
import { usePhoneAuth } from './usePhoneAuth'
import Auth from '../../../../../assets/SVG/imageComponents/Auth'
import AuthImageWithDescription from '../../components/AuthImageWithDescription/AuthImageWithDescription'
import PhoneNumberInput from '../../../../../components/PhoneNumberInput'
import { scale } from '../../../../../utils/scaling'
import ContinueWithPhoneButton from '../../../../../components/Auth/ContinueWithPhoneButton/ContinueWithPhoneButton'

function PhoneAuth(props) {
  const { currentTheme, themeContext, phone, setPhone, country, countryCode, onCountrySelect, isCountryLoading, phoneError, setPhoneError, loginWithPhoneFirstStepHandler, loginWithPhoneFirstStepData, loginWithPhoneFirstStepError, loginWithPhoneFirstStepLoading } = usePhoneAuth()

  const [showCountryPicker, setShowCountryPicker] = useState(false)

  const { t } = useTranslation()
  const headerHeight = useHeaderHeight()
  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        iconColor: currentTheme.newIconColor,
        navigation: props?.navigation,
        headerRight: null
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
            <AuthImageWithDescription title='Log in easily by entering your phone!' description='We’ll check if you have an account' image={<Auth fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />} currentTheme={currentTheme} />

            <View style={styles().form}>
              <View style={[styles(currentTheme).numberContainer, phoneError && styles(currentTheme).errorInput, { padding: scale(0), borderRadius: scale(8), borderWidth: scale(1), borderColor: currentTheme.borderColor }]}>
                <TouchableOpacity style={styles(currentTheme).countryCodeContainer} onPress={() => setShowCountryPicker(true)} activeOpacity={0.7}>
                  {isCountryLoading ? (
                    <ActivityIndicator size='small' color={currentTheme.newFontcolor} />
                  ) : (
                    <View style={styles(currentTheme).countryCodeInner}>
                      <TextDefault H5 textColor={currentTheme.newFontcolor} style={styles(currentTheme).countryCodeText}>
                        +{country?.callingCode[0]}
                      </TextDefault>
                      <Entypo name='chevron-small-down' size={22} color={currentTheme.newIconColor} />
                    </View>
                  )}
                </TouchableOpacity>
                <PhoneNumberInput setError={setPhoneError} placeholder={t('phoneNumber')} placeholderTextColor={currentTheme.fontSecondColor} style={styles(currentTheme).phoneField} countryCode={country?.callingCode[0]} value={phone} onChange={(e) => setPhone(e)} />
              </View>
              {phoneError !== null && (
                <View style={{ paddingTop: scale(5) }}>
                  <TextDefault bold textColor={currentTheme.textErrorColor} isRTL H5>
                    {phoneError}
                  </TextDefault>
                </View>
              )}
            </View>

            <CountryPicker
              visible={showCountryPicker}
              withFilter
              withFlag
              withAlphaFilter
              withCallingCode
              withEmoji
              onClose={() => setShowCountryPicker(false)}
              onSelect={(country) => {
                onCountrySelect(country)
                setShowCountryPicker(false)
              }}
              countryCode={countryCode}
              containerButtonStyle={{ display: 'none' }}
              theme={{
                backgroundColor: currentTheme.themeBackground,
                primaryColor: currentTheme.newFontcolor,
                primaryColorVariant: currentTheme.newIconColor,
                onBackgroundTextColor: currentTheme.newFontcolor
              }}
            />
            <View style={styles().btnContainer}>
              <ContinueWithPhoneButton title='continueBtn' onPress={() => loginWithPhoneFirstStepHandler()} isLoading={loginWithPhoneFirstStepLoading} isDisabled={!phone} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default PhoneAuth
