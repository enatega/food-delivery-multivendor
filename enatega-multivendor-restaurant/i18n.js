/*import * as Localization from 'expo-localization';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from "i18n-js";
import { en } from './translations/en';
import { fr } from './translations/fr';
import { km } from './translations/km';
import { zh } from './translations/zh';
import { de } from './translations/de';
import { ar } from './translations/ar';

const translations = {
  en,
  fr,
  km,
  zh,
  de,
  ar,
};

const i18n = new I18n({
  translations
});

export default i18n;
*/
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import sv from './translations/sv.json'
import en from './translations/en.json'
import de from './translations/de.json'
import ar from './translations/ar.json'
import fr from './translations/fr.json'
import km from './translations/km.json'
import zh from './translations/zh.json'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const languageResources = {
  sv: {translation: sv},
  en: {translation: en},
  zh: {translation: zh},
  de: {translation: de},
  fr: {translation: fr},
  km: {translation: km},
  ar: {translation: ar},
}

const getStoredLanguage = async () => {
  const lng = await AsyncStorage.getItem('enatega-language');
  console.log(lng)
  
i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: lng,
  fallbackLng: 'en',
  resources: languageResources,
});
}

getStoredLanguage()


i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

//i18next.changeLanguage('en')

export default i18next;
