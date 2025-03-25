
import React, { useState, useEffect } from 'react'
import {
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions
} from 'react-native'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'

import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import RadioButton from '../../ui/FdRadioBtn/RadioBtn'
import Spinner from '../Spinner/Spinner'

export const languageTypes = [
  { value: 'English', code: 'en', index: 0 },
  { value: 'العربية', code: 'ar', index: 1 },
  { value: 'français', code: 'fr', index: 2 },
  { value: 'ភាសាខ្មែរ', code: 'km', index: 3 },
  { value: '中文', code: 'zh', index: 4 },
  { value: 'Deutsche', code: 'de', index: 5 },
  { value: 'עִברִית', code: 'he', index: 6 },
  { value: 'हिंदी', code: 'hi', index: 7 },
  { value: 'español', code: 'es', index: 8 },
  { value: 'বাংলা', code: 'bn', index: 9 },
  { value: 'português', code: 'pt', index: 10 },
  { value: 'русский', code: 'ru', index: 11 },
  { value: 'اردو', code: 'ur', index: 12 },
  { value: 'Bahasa Indonesia', code: 'id', index: 13 },
  { value: '日本語', code: 'jp', index: 14 },
  { value: 'Türkçe', code: 'tr', index: 15 },
  { value: 'मराठी', code: 'mr', index: 16 },
  { value: 'తెలుగు', code: 'te', index: 17 },
  { value: 'Tiếng Việt', code: 'vi', index: 18 },
  { value: '한국어', code: 'ko', index: 19 },
  { value: 'italiano', code: 'it', index: 20 },
  { value: 'ไทย', code: 'th', index: 21 },
  { value: 'ગુજરાતી', code: 'gu', index: 22 },
  { value: 'فارسی', code: 'fa', index: 23 },
  { value: 'polski', code: 'pl', index: 24 },
  { value: 'پښتو', code: 'ps', index: 25 },
  { value: 'română', code: 'ro', index: 26 },
  { value: 'کوردی', code: 'ku', index: 27 },
  { value: 'ozbek', code: 'uz', index: 28 },
  { value: 'azərbaycan', code: 'az', index: 29 },
  { value: 'Nederlands', code: 'nl', index: 30 }
]

const LanguageModal = ({
  modalVisible,
  setModalVisible,
  currentTheme,
  showCrossButton,
  dontClose
}) => {
  const { t } = useTranslation()
  const [activeRadio, activeRadioSetter] = useState(0)
  const [loadinglang, setLoadingLang] = useState(false)
  const [languageName, languageNameSetter] = useState('English')

  useEffect(() => {
    if (modalVisible) {
      determineInitialLanguage()
      console.log("🚀 ~ useEffect ~ modalVisible:", modalVisible)
    }
  }, [modalVisible])

  async function determineInitialLanguage() {
    try {
      // First, check for stored language
      const storedLanguageCode = await AsyncStorage.getItem('enatega-language')
      
      // Get system language
      const systemLanguageCode = Localization.locale.split('-')[0]
      
      // Available language codes
      const availableLanguageCodes = languageTypes.map(lang => lang.code)

      // Determine which language to use
      let languageToUse = 'en' // Default to English
      
      if (storedLanguageCode) {
        // Use stored language if it's valid
        languageToUse = storedLanguageCode
      } else if (availableLanguageCodes.includes(systemLanguageCode)) {
        // Use system language if it's available
        languageToUse = systemLanguageCode
      }

      // Find the index and name of the language
      const selectedLanguage = languageTypes.find(lang => lang.code === languageToUse)
      
      if (selectedLanguage) {
        activeRadioSetter(selectedLanguage.index)
        languageNameSetter(selectedLanguage.value)
      }
    } catch (error) {
      console.error('Error determining initial language:', error)
    }
  }

  async function onSelectedLanguage() {
    try {
      setLoadingLang(true)
      const languageInd = activeRadio
      const languageCode = languageTypes[languageInd].code
      const languageVal = languageTypes[languageInd].value

      // Save language preferences
      await AsyncStorage.setItem('enatega-language', languageCode)
      await AsyncStorage.setItem('enatega-language-name', languageVal)

      // Change app language
      i18next.changeLanguage(languageCode)
      languageNameSetter(languageVal)
    } catch (error) {
      console.error('Error during language selection:', error)
    } finally {
      setLoadingLang(false)
      setModalVisible(!modalVisible)
    }
  }

  const handleClose = () => {
    if (!dontClose) {
      setModalVisible(false)
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <View style={styles().layout}>
        <Pressable style={styles().backdrop} onPress={handleClose} />
        <View style={styles(currentTheme).modalContainer}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              bolder
              H3
              style={alignment.MBsmall}
            >
              {t('selectLanguage')}
            </TextDefault>
            {showCrossButton && (
              <Feather
                name='x-circle'
                size={24}
                color={currentTheme.newFontcolor}
                onPress={handleClose}
              />
            )}
          </View>

          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              textColor={currentTheme.fontMainColor}
              style={alignment.MBsmall}
            >
              {t('description0')}
            </TextDefault>
          </View>
          
          <ScrollView 
            style={{ 
              flex: 1, 
              maxHeight: Dimensions.get('window').height * 0.5 // Limit height to 50% of screen
            }}
            contentContainerStyle={{ 
              flexGrow: 1, 
              paddingVertical: 10 
            }}
            showsVerticalScrollIndicator={false} // hide scroll indicator
            keyboardShouldPersistTaps="handled" // Allows tapping items while keyboard is open
          >
            {languageTypes.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                key={index}
                onPress={() => activeRadioSetter(item.index)}
                style={[styles(currentTheme).radioContainer]}
              >
                <RadioButton
                  animation={'bounceIn'}
                  size={13}
                  outerColor={currentTheme.iconColorDark}
                  innerColor={currentTheme.main}
                  isSelected={activeRadio === item.index}
                  onPress={() => activeRadioSetter(item.index)}
                />
                <TextDefault
                  numberOfLines={1}
                  textColor={currentTheme.fontMainColor}
                  bold
                >
                  {item.value}
                </TextDefault>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles(currentTheme).emptyButton}
            onPress={onSelectedLanguage}
          >
            <TextDefault textColor={currentTheme.fontMainColor} center H5>
              {loadinglang ? (
                <Spinner
                  size={'small'}
                  backColor={'transparent'}
                  spinnerColor={currentTheme.iconColorDark}
                />
              ) : (
                t('continueBtn')
              )}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default LanguageModal