import React, { useLayoutEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image, TextInput, Text, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Spinner from '../../components/Spinner/Spinner'
import styles from './styles'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import CountryPicker from 'react-native-country-picker-modal'
import usePhoneNumber from './usePhoneNumber'
import PhoneInput from 'react-native-phone-number-input'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import SignUpSvg from '../../assets/SVG/imageComponents/SignUpSvg'
import PhoneNumberInput from '../../components/PhoneNumberInput'

function PhoneNumber(props) {
  const { phone, setPhone, phoneError, country, countryCode, registerAction, onCountrySelect, currentTheme, loading, setPhoneError ,isCountryLoading} = usePhoneNumber()

  const { t } = useTranslation()

  useLayoutEffect(() => {
    props?.navigation.setOptions(
      screenOptions({
        iconColor: currentTheme.newIconColor,
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        navigation: props?.navigation
      })
    )
  }, [props?.navigation])
  const phoneInput = useRef < PhoneInput > null

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles().flex, { backgroundColor: currentTheme.themeBackground }]}>
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles().flex}
      >
        <ScrollView style={styles().flex} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
          <View style={styles(currentTheme).mainContainer}>
            <View style={styles().subContainer}>
              <View>
                <SignUpSvg fillColor={currentTheme.svgFill} strokeColor={currentTheme.newIconColor} />
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
                  {t('yourPhoneNumber')}
                </TextDefault>
                <TextDefault
                  H5
                  bold
                  textColor={currentTheme.fontSecondColor}
                  style={{
                    paddingBottom: scale(5)
                  }}
                  isRTL
                >
                  {t('secureAccountWithPhone')}
                </TextDefault>
              </View>
              <View style={styles().form}>
                <View style={styles(currentTheme).number}>
                  <View style={[styles(currentTheme).textField, styles().countryCode, { padding: Platform.OS === 'ios' ? scale(5) : scale(12) }]}>
                    {
                      isCountryLoading ?

                        <ActivityIndicator size='small' color={currentTheme.white} />
                        :
                        <>
                          <CountryPicker countryCode={countryCode} onSelect={(country) => onCountrySelect(country)} withAlphaFilter withFilter />
                          <TextDefault textColor={currentTheme.newFontcolor} style={{ marginTop: Platform.OS === 'android' ? 8 : 10 }}>
                            {/* {country?.cca2} */}+{country?.callingCode[0]}
                          </TextDefault>
                        </>
                    }
                  </View>
                  <View style={[styles(currentTheme).textField, styles().phoneNumber, phoneError && styles(currentTheme).errorInput]}>
                    <View style={styles(currentTheme).phoneField}>
                      <PhoneNumberInput
                        setError={setPhoneError}
                        placeholder={t('phoneNumber')}
                        placeholderTextColor={currentTheme.color6}
                        style={styles(currentTheme).phoneNo}
                        countryCode={country?.callingCode[0]}
                        value={phone}
                        onChange={(e) => setPhone(e)} />
                    </View>
                  </View>
                </View>
                {phoneError && (
                  <View style={{ marginLeft: '30%' }}>
                    <TextDefault style={styles().error} bold textColor={currentTheme.textErrorColor} isRTL>
                      {phoneError}
                    </TextDefault>
                  </View>
                )}
              </View>
            </View>
            <View style={{ width: '100%', marginBottom: 20 }}>
              <TouchableOpacity onPress={() => registerAction()} activeOpacity={0.7} style={styles(currentTheme).btn}>
                <TextDefault H4 textColor={currentTheme.color4} bold>
                  {loading ? <Spinner size='small' backColor='transparent' spinnerColor={currentTheme.white} /> : t('textWithCodeBtn')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default PhoneNumber
