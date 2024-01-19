import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import { Platform } from 'react-native'
import { en } from './languages/en'
import { de } from './languages/de'
import { fr } from './languages/fr'
import { km } from './languages/km'
import { zh } from './languages/zh'
import { ar } from './languages/ar'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const languageResources = {
  en: { translation: en },
  zh: { translation: zh },
  de: { translation: de },
  fr: { translation: fr },
  km: { translation: km },
  ar: { translation: ar }
}

const getStoredLanguage = async () => {
  const lng = await AsyncStorage.getItem('enatega-language')
  console.log(lng)
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: lng,
    fallbackLng: 'en',
    resources: languageResources
  })
}
if (Platform.OS === 'android') {
  getStoredLanguage()
}
if (Platform.OS === 'ios') {
  i18next.locale = Localization.locale
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: i18next.locale,
    fallbackLng: 'en',
    resources: languageResources
  })
  console.log('language:', Localization.locale)
  i18next.changeLanguage(i18next.locale)
}

export default i18next
