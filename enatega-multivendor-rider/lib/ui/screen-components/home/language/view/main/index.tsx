// Constants
import { useApptheme } from "@/lib/context/global/theme.context";
import {
  CustomContinueButton,
  CustomRadioButton,
} from "@/lib/ui/useable-components";
import { LANGUAGES } from "@/lib/utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next, { changeLanguage } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Core
import { Image, ScrollView, Text, View } from "react-native";

export default function LanguageMain() {
  // States
  const [isSelected, setIsSelected] = useState(i18next.language);
  const [isChangingLang, setIsChangingLang] = useState(false);

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // Handlers
  const handleLanguageSelection = async (selectedLanguage: string) => {
    setIsSelected(selectedLanguage);
    await AsyncStorage.setItem("enatega-language", selectedLanguage);
  };
  const handleSetCurrentLanguage = async () => {
    try {
      const lng = await AsyncStorage.getItem("enatega-language");
      if (lng) {
        setIsSelected(lng);
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const handleSubmission = async () => {
    try {
      setIsChangingLang(true);
      await AsyncStorage.setItem("enatega-language", isSelected);
      changeLanguage(isSelected);
      setIsChangingLang(false);
    } catch (e) {
      console.log(e);
    }
  };

  // UseEffects
  useEffect(() => {
    handleSetCurrentLanguage();
  }, [isSelected]);

  return (
    <View
      className="flex-1 w-full items-center"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      {/* ---------- SCROLLABLE LIST ---------- */}
      <ScrollView
        className="w-[90%] flex-1 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} // space before button
      >
        {LANGUAGES.map((lng, index) => (
          <View
            key={`lng-${index}`}
            className="w-full flex flex-row items-center justify-between border-b-2 border-b-gray-300 h-12"
            style={{ backgroundColor: appTheme.themeBackground }}
          >
            <View className="flex flex-row gap-3 items-center justify-center px-3">
              <View className="overflow-hidden items-center justify-start w-8 h-6">
                <Image
                  source={lng.icon}
                  className="w-8 h-6"
                  resizeMode="contain"
                />
              </View>
              <Text style={{ color: appTheme.fontMainColor }}>{lng.value}</Text>
            </View>

            <CustomRadioButton
              label={lng.code}
              isSelected={lng.code === isSelected}
              showLabel={false}
              onPress={() => handleLanguageSelection(lng.code)}
            />
          </View>
        ))}
      </ScrollView>

      {/* ---------- FIXED BUTTON ---------- */}
      <View className="w-[90%] mb-16">
        <CustomContinueButton
          title={isChangingLang ? t("Please wait") : t("Update Language")}
          onPress={handleSubmission}
        />
      </View>
    </View>
  );
}
