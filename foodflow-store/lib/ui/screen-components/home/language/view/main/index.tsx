// Components
import {
  CustomContinueButton,
  CustomRadioButton,
} from "@/lib/ui/useable-components";

// Constants
import { LANGUAGES } from "@/lib/utils/constants";

// React Native Async Storage
import AsyncStorage from "@react-native-async-storage/async-storage";

// I18n
import { changeLanguage } from "i18next";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

// Core
import { AuthContext } from "@/lib/context/global/auth.context";
import { Image, ScrollView, Text, View } from "react-native";

export default function LanguageMain() {
  const [isChangingLang, setIsChangingLang] = useState(false);

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { isSelected, setIsSelected } = useContext(AuthContext);

  // Handlers
  const handleLanguageSelection = async (selectedLanguage: string) => {
    setIsSelected(selectedLanguage);
    await AsyncStorage.setItem("lang", selectedLanguage);
  };

  const handleSubmission = async () => {
    try {

      console.log({isSelected})

      setIsChangingLang(true);
      await AsyncStorage.setItem("lang", isSelected);
      changeLanguage(isSelected);
      setIsChangingLang(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
  <View
      className="flex-1 w-full items-center"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      {/* ---------- SCROLLABLE LIST ---------- */}
      <ScrollView
        className="w-[90%] flex-1 mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}   // space before button
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
              <Text style={{ color: appTheme.fontMainColor }}>
                {lng.value}
              </Text>
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
          title={isChangingLang ? t('Please wait') : t('Update Language')}
          onPress={handleSubmission}
        />
      </View>
    </View>
  );
}
