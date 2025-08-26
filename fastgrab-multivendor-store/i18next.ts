import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { Platform } from "react-native";
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

// Function to get stored language from AsyncStorage or fallback to device locale
const getStoredLanguage = async (): Promise<void> => {
  try {
    const storedLang = await AsyncStorage.getItem("enatega-language");
    const deviceLang = Localization.getLocales()[0]?.languageCode || "en";
    const initialLang = storedLang || deviceLang;

    await i18next.use(initReactI18next).init({
      lng: initialLang,
      fallbackLng: "en",
      resources: languageResources,
    });

    // Apply the initial language
    await i18next.changeLanguage(initialLang);
  } catch (error) {
    console.error("Error initializing language:", error);
  }
};

// Initialize language
getStoredLanguage();

// Additional iOS-specific configuration (if necessary)
if (Platform.OS === "ios") {
  const iosLang = Localization.getLocales()[0]?.languageCode || "en";

  i18next.use(initReactI18next).init({
    lng: iosLang,
    fallbackLng: "en",
    resources: languageResources,
  });

  i18next.changeLanguage(iosLang);
}

export default i18next;
