import React, { useContext } from 'react'
import { SafeAreaView, ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import {
  SecuritySettingsHeader,
  SettingsMenuItem
} from '../../components/SecuritySettings'

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

const SecuritySettings = () => {
  const navigation = useNavigation()
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  const getCurrentLanguageName = () => {
    const lang = LANGUAGES.find((l) => l.code === i18n.language)
    return lang?.name || 'English'
  }

  const menuItems = [
    {
      id: 'password',
      title: t('Password'),
      // subtitle: t('lastUpdated2MonthsAgo'),
      onPress: () => navigation.navigate('ChangePassword')
    },
    {
      id: 'language',
      title: t('Language'),
      subtitle: getCurrentLanguageName(),
      onPress: () => navigation.navigate('LanguageSelection')
    },
    {
      id: 'terms',
      title: t('temrConditions'),
      onPress: () => navigation.navigate('TermsOfUse')
    },
    {
      id: 'privacy',
      title: t('privacyPolicy'),
      onPress: () => navigation.navigate('PrivacyPolicy')
    }
  ]

  return (
    <SafeAreaView style={styles(currentTheme).container}>
      <SecuritySettingsHeader
        currentTheme={currentTheme}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles(currentTheme).scrollView}
        contentContainerStyle={styles(currentTheme).scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles(currentTheme).menuContainer}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <SettingsMenuItem
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                currentTheme={currentTheme}
              />
              {/* {index < menuItems.length - 1 && (
                <View style={styles(currentTheme).separator} />
              )} */}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SecuritySettings
