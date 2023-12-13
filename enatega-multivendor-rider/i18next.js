import i18next from "i18next";
import { initReactI18next } from "react-i18next";
//import {sv} from './translations/sv'
import { en } from './languages/en'
import { fr } from './languages/fr'
import { km } from './languages/km'
import { zh } from './languages/zh'
import { de } from './languages/de'
import {ar} from './languages/ar'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const languageResources = {
  en: {translation: en},
  zh: {translation: zh},
  de: {translation: de},
  fr: {translation: fr},
  km: {translation: km},
  ar: {translation: ar}
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