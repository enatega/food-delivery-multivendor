import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './translations/ar'
import en from './translations/en'
import zh from './translations/zh'
import de from './translations/de'
import km from './translations/km'
import fr from './translations/fr'
import he from './translations/he'

i18n.use(initReactI18next).init({
  resources: {
    ar: ar,
    en: en,
    de: de,
    zh: zh,
    fr: fr,
    km: km,
    he: he
  },
  lng: localStorage.getItem("enatega-language") || "en",
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
