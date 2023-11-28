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
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import screenOptions from './screenOptions'
import { FontAwesome } from '@expo/vector-icons'
import CountryPicker from 'react-native-country-picker-modal'
import useRegister from './useRegister'
import {useTranslation} from 'react-i18next'

function Register(props) {
  const {
    email,
    setEmail,
    emailError,
    firstname,
    setFirstname,
    firstnameError,
    lastname,
    setLastname,
    lastnameError,
    password,
    setPassword,
    passwordError,
    phone,
    setPhone,
    phoneError,
    showPassword,
    setShowPassword,
    country,
    countryCode,
    registerAction,
    onCountrySelect,
    currentTheme
  } = useRegister()

    const {t} = useTranslation()
  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        fontColor: currentTheme.fontMainColor,
        backColor: currentTheme.themeBackground,
        iconColor: currentTheme.iconColorPink,
        navigation: props.navigation
      })
    )
  }, [props.navigation])

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={[
        styles().flex,
        { backgroundColor: currentTheme.themeBackground }
      ]}>
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
                  {t('letsGetStarted')}
                </TextDefault>
                <TextDefault
                  H5
                  bold
                  textColor={currentTheme.fontSecondColor}
                  style={{
                    textAlign: 'center'
                  }}>
                  {t('createAccount')}
                </TextDefault>
              </View>
              <View style={styles().form}>
                <View>
                  <TextInput
                    placeholder={t('email')}
                    style={[
                      styles(currentTheme).textField,
                      emailError && styles(currentTheme).errorInput
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
                <View>
                  <TextInput
                    placeholder={t('firstNamePH')}
                    style={[
                      styles(currentTheme).textField,
                      firstnameError && styles(currentTheme).errorInput
                    ]}
                    placeholderTextColor={currentTheme.fontSecondColor}
                    value={firstname}
                    onChangeText={e => setFirstname(e)}
                  />
                  {firstnameError && (
                    <TextDefault
                      style={styles().error}
                      bold
                      textColor={currentTheme.textErrorColor}>
                      {firstnameError}
                    </TextDefault>
                  )}
                </View>
                <View>
                  <TextInput
                    placeholder={t('lastNamePH')}

                    style={[
                      styles(currentTheme).textField,
                      lastnameError && styles(currentTheme).errorInput
                    ]}
                    placeholderTextColor={currentTheme.fontSecondColor}
                    value={lastname}
                    onChangeText={e => setLastname(e)}
                  />
                  {lastnameError && (
                    <TextDefault
                      style={styles().error}
                      bold
                      textColor={currentTheme.textErrorColor}>
                      {lastnameError}
                    </TextDefault>
                  )}
                </View>
                <View style={styles().passwordField}>
                  <TextInput
                    secureTextEntry={showPassword}
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
                  <FontAwesome
                    onPress={() => setShowPassword(!showPassword)}
                    name={showPassword ? 'eye' : 'eye-slash'}
                    size={24}
                    color={currentTheme.startColor}
                    style={styles().eyeBtn}
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
                <View style={styles().number}>
                  <View
                    style={[
                      styles(currentTheme).textField,
                      styles().countryCode
                    ]}>
                    <CountryPicker
                      countryCode={countryCode}
                      onSelect={country => onCountrySelect(country)}
                      withAlphaFilter
                      withFilter
                    />
                    <TextDefault
                      style={{ marginTop: Platform.OS === 'android' ? 7 : 10 }}>
                      {country?.cca2}
                    </TextDefault>
                  </View>
                  <TextInput
                    placeholder={t('mobileNumber')}
                    style={[
                      styles(currentTheme).textField,
                      styles().phoneNumber,
                      phoneError && styles(currentTheme).errorInput
                    ]}
                    placeholderTextColor={currentTheme.fontSecondColor}
                    value={phone}
                    onChangeText={e => setPhone(e)}
                  />
                </View>
                {phoneError && (
                  <View style={{ marginLeft: '30%' }}>
                    <TextDefault
                      style={styles().error}
                      bold
                      textColor={currentTheme.textErrorColor}>
                      {phoneError}
                    </TextDefault>
                  </View>
                )}

                <View style={styles().marginTop10}>
                  <TouchableOpacity
                    onPress={() => registerAction()}
                    activeOpacity={0.7}
                    style={styles(currentTheme).btn}>
                    <TextDefault
                      H4
                      textColor={currentTheme.buttonTextPink}
                      style={alignment.MLsmall}
                      bold>
                      {t('continueBtn')}
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

export default Register
