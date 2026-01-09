import React, { useContext, useState } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import {
  LanguageHeader,
  LanguageItem
} from '../../components/LanguageSelection'

import styles from './styles'

const LANGUAGES = [
  { code: 'en', name: 'English', subtitle: 'English' },
  { code: 'ar', name: 'العربية', subtitle: 'Arabic' },
  { code: 'az', name: 'Azərbaycan', subtitle: 'Azerbaijani' },
  { code: 'bn', name: 'বাংলা', subtitle: 'Bengali' },
  { code: 'de', name: 'Deutsch', subtitle: 'German' },
  { code: 'es', name: 'Español', subtitle: 'Spanish' },
  { code: 'fa', name: 'فارسی', subtitle: 'Persian' },
  { code: 'fr', name: 'Français', subtitle: 'French' },
  { code: 'gu', name: 'ગુજરાતી', subtitle: 'Gujarati' },
  { code: 'he', name: 'עברית', subtitle: 'Hebrew' },
  { code: 'hi', name: 'हिन्दी', subtitle: 'Hindi' },
  { code: 'id', name: 'Bahasa Indonesia', subtitle: 'Indonesian' },
  { code: 'it', name: 'Italiano', subtitle: 'Italian' },
  { code: 'jp', name: '日本語', subtitle: 'Japanese' },
  { code: 'km', name: 'ខ្មែរ', subtitle: 'Khmer' },
  { code: 'ko', name: '한국어', subtitle: 'Korean' },
  { code: 'ku', name: 'کوردی', subtitle: 'Kurdish' },
  { code: 'mr', name: 'मराठी', subtitle: 'Marathi' },
  { code: 'nl', name: 'Nederlands', subtitle: 'Dutch' },
  { code: 'pl', name: 'Polski', subtitle: 'Polish' },
  { code: 'ps', name: 'پښتو', subtitle: 'Pashto' },
  { code: 'pt', name: 'Português', subtitle: 'Portuguese' },
  { code: 'ro', name: 'Română', subtitle: 'Romanian' },
  { code: 'ru', name: 'Русский', subtitle: 'Russian' },
  { code: 'te', name: 'తెలుగు', subtitle: 'Telugu' },
  { code: 'th', name: 'ไทย', subtitle: 'Thai' },
  { code: 'tr', name: 'Türkçe', subtitle: 'Turkish' },
  { code: 'ur', name: 'اردو', subtitle: 'Urdu' },
  { code: 'uz', name: 'Oʻzbekcha', subtitle: 'Uzbek' },
  { code: 'vi', name: 'Tiếng Việt', subtitle: 'Vietnamese' },
  { code: 'zh', name: '中文', subtitle: 'Chinese' }
]

const LanguageSelection = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language)

  const handleLanguageSelect = async (languageCode) => {
    setSelectedLanguage(languageCode)
    await AsyncStorage.setItem('enatega-language', languageCode)
    i18n.changeLanguage(languageCode)
  }

  const getCurrentLanguageName = () => {
    const lang = LANGUAGES.find((l) => l.code === selectedLanguage)
    return lang?.name || 'English'
  }

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <LanguageHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
        currentLanguage={getCurrentLanguageName()}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles(currentTheme).listContainer}>
          {LANGUAGES.map((language) => (
            <LanguageItem
              key={language.code}
              name={language.name}
              subtitle={language.subtitle}
              isSelected={selectedLanguage === language.code}
              onPress={() => handleLanguageSelect(language.code)}
              currentTheme={currentTheme}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LanguageSelection
