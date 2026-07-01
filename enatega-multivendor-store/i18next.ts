import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import language files
import { en } from "./languages/en";
import { de } from "./languages/de";
import { fr } from "./languages/fr";
import { km } from "./languages/km";
import { zh } from "./languages/zh";
import { ar } from "./languages/ar";
import { he } from "./languages/he";

// Define language resources
export const languageResources: { [key: string]: { translation: object } } = {
  en: { translation: en },
  zh: { translation: zh },
  de: { translation: de },
  fr: { translation: fr },
  km: { translation: km },
  ar: { translation: ar },
  he: { translation: he },
};

const LANGUAGE_KEY = "lang";
const LEGACY_LANGUAGE_KEY = "enatega-language";

const getInitialLanguage = async (): Promise<string> => {
  const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (storedLang) return storedLang;

  const legacyLang = await AsyncStorage.getItem(LEGACY_LANGUAGE_KEY);
  if (legacyLang) {
    await AsyncStorage.setItem(LANGUAGE_KEY, legacyLang);
    await AsyncStorage.removeItem(LEGACY_LANGUAGE_KEY);
    return legacyLang;
  }

  return Localization.getLocales()[0]?.languageCode || "en";
};

const initializeLanguage = async (): Promise<void> => {
  try {
    const initialLang = await getInitialLanguage();

    await i18next.use(initReactI18next).init({
      lng: initialLang,
      fallbackLng: "en",
      resources: languageResources,
    });
  } catch {
    await i18next.use(initReactI18next).init({
      lng: "en",
      fallbackLng: "en",
      resources: languageResources,
    });
  }
};

initializeLanguage();

export default i18next;
