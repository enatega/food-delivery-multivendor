import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { en } from './translations/en'
import { de } from './translations/de'
import { fr } from './translations/fr'
import { km } from './translations/km'
import { zh } from './translations/zh'
import { ar } from './translations/ar'
import { he } from './translations/he'
import { hi } from './translations/hi'
import { es } from './translations/es'
import { bn } from './translations/bn'
import { pt } from './translations/pt'
import { ru } from './translations/ru'
import { ur } from './translations/ur'
import { id } from './translations/id'
import { jp } from './translations/jp'
import { tr } from './translations/tr'
import { mr } from './translations/mr'
import { te } from './translations/te'
import { vi } from './translations/vi'
import { ko } from './translations/ko'
import { it } from './translations/it'
import { th } from './translations/th'
import { gu } from './translations/gu'
import { fa } from './translations/fa'
import { pl } from './translations/pl'
import { ps } from './translations/ps'
import { ro } from './translations/ro'
import { ku } from './translations/ku'
import { uz } from './translations/uz'
import { az } from './translations/az'
import { nl } from './translations/nl'
import { kk } from './translations/kk'
import { supportTranslations } from './translations/support'

const withSupportTranslations = (language, translations) => ({
  ...translations,
  ...supportTranslations[language]
})

export const languageResources = {
  en: { translation: withSupportTranslations('en', en) },
  zh: { translation: withSupportTranslations('zh', zh) },
  de: { translation: withSupportTranslations('de', de) },
  fr: { translation: withSupportTranslations('fr', fr) },
  km: { translation: withSupportTranslations('km', km) },
  ar: { translation: withSupportTranslations('ar', ar) },
  he: { translation: withSupportTranslations('he', he) },
  hi: { translation: withSupportTranslations('hi', hi) },
  es: { translation: withSupportTranslations('es', es) },
  bn: { translation: withSupportTranslations('bn', bn) },
  pt: { translation: withSupportTranslations('pt', pt) },
  ru: { translation: withSupportTranslations('ru', ru) },
  ur: { translation: withSupportTranslations('ur', ur) },
  id: { translation: withSupportTranslations('id', id) },
  jp: { translation: withSupportTranslations('jp', jp) },
  tr: { translation: withSupportTranslations('tr', tr) },
  mr: { translation: withSupportTranslations('mr', mr) },
  te: { translation: withSupportTranslations('te', te) },
  vi: { translation: withSupportTranslations('vi', vi) },
  ko: { translation: withSupportTranslations('ko', ko) },
  it: { translation: withSupportTranslations('it', it) },
  th: { translation: withSupportTranslations('th', th) },
  gu: { translation: withSupportTranslations('gu', gu) },
  fa: { translation: withSupportTranslations('fa', fa) },
  pl: { translation: withSupportTranslations('pl', pl) },
  ps: { translation: withSupportTranslations('ps', ps) },
  ro: { translation: withSupportTranslations('ro', ro) },
  ku: { translation: withSupportTranslations('ku', ku) },
  uz: { translation: withSupportTranslations('uz', uz) },
  az: { translation: withSupportTranslations('az', az) },
  nl: { translation: withSupportTranslations('nl', nl) },
  kk: { translation: withSupportTranslations('kk', kk) }
}

// Initialize i18next synchronously with fallback language
i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en', // default language
  fallbackLng: 'en',
  resources: languageResources,
  interpolation: {
    escapeValue: false // React already escapes by default
  }
})

// Async function to detect and set language
const detectAndSetLanguage = async() => {
  try {
    const storedLanguage = await AsyncStorage.getItem('enatega-language')
    const systemLanguage = Localization?.locale?.split('-')[0]
    const availableLanguages = Object.keys(languageResources)

    // Prefer stored language if available, else system language if supported, else fallback to 'en'
    let languageToUse = 'en'
    if (storedLanguage && availableLanguages.includes(storedLanguage)) {
      languageToUse = storedLanguage
    } else if (availableLanguages.includes(systemLanguage)) {
      languageToUse = systemLanguage
    }

    await i18next.changeLanguage(languageToUse)

    // Optionally clear stored language keys if you want fresh detection next time
    await AsyncStorage.removeItem('enatega-language')
    await AsyncStorage.removeItem('enatega-language-name')
  } catch (error) {
    console.error('Error detecting or setting language:', error)
  }
}

detectAndSetLanguage()

export default i18next
