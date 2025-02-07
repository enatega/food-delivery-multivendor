import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import { en } from './translations/en'
import { de } from './translations/de'
import { fr } from './translations/fr'
import { km } from './translations/km'
import { zh } from './translations/zh'
import { ar } from './translations/ar'
import { he } from './translations/he'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const languageResources = {
  en: { translation: en },
  zh: { translation: zh },
  de: { translation: de },
  fr: { translation: fr },
  km: { translation: km },
  ar: { translation: ar },
  he: { translation: he }
}

const getStoredLanguage = async () => {
  const storedLanguage = await AsyncStorage.getItem('enatega-language') || 'en';

  const systemLanguage = Localization.locale.split('-')[0]; // Extract the language code
  const availableLanguages = Object.keys(languageResources);

  // Check if system language is available in translations
  const languageToUse = availableLanguages.includes(systemLanguage) ? systemLanguage : storedLanguage;

  // Initialize i18next
  i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: languageToUse, // Use system language if available, otherwise use stored language
    fallbackLng: 'en',
    resources: languageResources
  });

  // Remove AsyncStorage details so that languageModal show the system selected language
  AsyncStorage.removeItem('enatega-language');
  AsyncStorage.removeItem('enatega-language-name');
};

getStoredLanguage()


export default i18next
