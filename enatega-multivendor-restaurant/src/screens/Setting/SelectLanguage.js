import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Platform
} from 'react-native'
import { TextDefault, Spinner } from '../../components'
import { useLogin } from '../../ui/hooks'
import { colors } from '../../utilities'
import styles from './styles'
import { Image, Button, Input, Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import i18next from '../../../i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'

const { height } = Dimensions.get('window')
export default function SelectLanguage() {
  const {
    onLogin,
    isValid,
    loading,
    errors,
    setPassword,
    setUserName,
    username,
    password
  } = useLogin()
  const { t } = useTranslation()
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [loader, setLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigation = useNavigation()
  const languageTypes = [
    { value: 'English', code: 'en', index: 0 },
    { value: 'français', code: 'fr', index: 1 },
    { value: 'ភាសាខ្មែរ', code: 'km', index: 2 },
    { value: '中文', code: 'zh', index: 3 },
    { value: 'Deutsche', code: 'de', index: 4 },
    { value: 'arabic', code: 'ar', index: 5 },
    { value: 'swedish', code: 'sv', index: 6 }
  ]

  const changeLanguage = async language => {
    setLoader(true)
    console.log(language)
    setSelectedLanguage(language)
    await i18next.reloadResources(language, null)
    i18next.changeLanguage(language)

    await AsyncStorage.setItem('enatega-language', language)

    var lang = await AsyncStorage.getItem('enatega-language')
    console.log(lang)
    setLoader(false)
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: Platform.OS === 'ios' ? height * 1.0 : height * 1.05
        }}>
        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <View style={styles.topContainer}>
            <View>
              <Image
                source={require('../../assets/Header.png')}
                PlaceholderContent={<ActivityIndicator />}
                style={{ width: 150, height: 140 }}
              />
            </View>
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.innerContainer}>
              {loader ? <Spinner style={{ marginTop: 60 }} /> : null}
              <Text
                style={{ ...styles.headingText, marginTop: loader ? 15 : 0 }}>
                {t('selectLanguage')}
              </Text>
              {languageTypes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => changeLanguage(item.code)}
                  style={styles.languageButton}>
                  <Text style={styles.languageText}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                flex: 0.2
              }}>
              <View style={styles.goBackContainer}></View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
