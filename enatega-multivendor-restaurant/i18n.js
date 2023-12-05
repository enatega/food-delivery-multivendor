import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import {sv} from './translations/sv'
import {en} from './translations/en'
import {de} from './translations/de'
import {fr} from './translations/fr'
import {km} from './translations/km'
import {zh} from './translations/zh'
import {ar} from './translations/ar'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const languageResources = {
  sv: {translation: sv},
  en: {translation: en},
  zh: {translation: zh},
  de: {translation: de},
  fr: {translation: fr},
  km: {translation: km},
  ar: {translation: ar},
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
i18next.changeLanguage(lng)
}

getStoredLanguage()


export default i18next;
