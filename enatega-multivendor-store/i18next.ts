import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_LOADERS = {
  en: () => import("./languages/en").then((module) => module.en),
  zh: () => import("./languages/zh").then((module) => module.zh),
  de: () => import("./languages/de").then((module) => module.de),
  fr: () => import("./languages/fr").then((module) => module.fr),
  km: () => import("./languages/km").then((module) => module.km),
  ar: () => import("./languages/ar").then((module) => module.ar),
  he: () => import("./languages/he").then((module) => module.he),
};
type SupportedLanguage = keyof typeof LANGUAGE_LOADERS;

const LANGUAGE_KEY = "lang";
const LEGACY_LANGUAGE_KEY = "enatega-language";
const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const normalizeLanguage = (language?: string | null): SupportedLanguage =>
  language && language in LANGUAGE_LOADERS
    ? (language as SupportedLanguage)
    : DEFAULT_LANGUAGE;

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

const getLanguageResources = async (language: SupportedLanguage) => {
  const translation = await LANGUAGE_LOADERS[language]();
  return { [language]: { translation } };
};

const ensureLanguageResources = async (language: SupportedLanguage) => {
  if (i18next.hasResourceBundle(language, "translation")) return;

  const resources = await getLanguageResources(language);
  i18next.addResourceBundle(
    language,
    "translation",
    resources[language].translation,
    true,
    true,
  );
};

export const setAppLanguage = async (language?: string | null) => {
  const normalizedLanguage = normalizeLanguage(language);

  await ensureLanguageResources(DEFAULT_LANGUAGE);
  if (normalizedLanguage !== DEFAULT_LANGUAGE) {
    await ensureLanguageResources(normalizedLanguage);
  }

  await i18next.changeLanguage(normalizedLanguage);
  return normalizedLanguage;
};

const initializeLanguage = async (): Promise<void> => {
  try {
    const initialLang = normalizeLanguage(await getInitialLanguage());
    const resources = {
      ...(await getLanguageResources(DEFAULT_LANGUAGE)),
      ...(initialLang === DEFAULT_LANGUAGE
        ? {}
        : await getLanguageResources(initialLang)),
    };

    await i18next.use(initReactI18next).init({
      lng: initialLang,
      fallbackLng: DEFAULT_LANGUAGE,
      resources,
    });
  } catch {
    const fallbackResources = await getLanguageResources(DEFAULT_LANGUAGE);

    await i18next.use(initReactI18next).init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      resources: fallbackResources,
    });
  }
};

initializeLanguage();

export default i18next;
