// Constants
import { useApptheme } from "@/lib/context/global/theme.context";
import {
  CustomContinueButton,
  CustomRadioButton,
} from "@/lib/ui/useable-components";
import { LANGUAGES } from "@/lib/utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeLanguage } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Core
import { Image, Text, View } from "react-native";

export default function LanguageMain() {
  // States
  const [isSelected, setIsSelected] = useState("");
  const [isChangingLang, setIsChangingLang] = useState(false);

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // Handlers
  const handleLanguageSelection = async (selectedLanguage: string) => {
    setIsSelected(selectedLanguage);
    await AsyncStorage.setItem("lang", selectedLanguage);
  };
  const handleSetCurrentLanguage = async () => {
    try {
      const lng = await AsyncStorage.getItem("lang");
      console.log("🚀 ~ handleSetCurrentLanguage ~ lng:", lng);
      // if (lng) {
      //   changeLanguage(lng);
      //   changeLanguage(isSelected);
      // }
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
      await AsyncStorage.setItem("lang", isSelected);
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
      className="h-[85%] w-[90%] items-center justify-between mx-auto  p-4"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      {LANGUAGES.map((lng, index) => {
        return (
          <View
            key={`lng-${index}`}
            className="w-full mx-auto flex flex-row items-center justify-between border-b-2 border-b-gray-300 h-12"
            style={{ backgroundColor: appTheme.themeBackground }}
          >
            <View className="flex flex-row gap-3 items-center justify-center px-3">
              <View className="overflow-hidden items-center justify-start w-8 h-6">
                <Image
                  source={lng.icon}
                  width={100}
                  height={100}
                  className="max-w-8 max-h-8"
                />
              </View>
              <Text style={{ color: appTheme.fontMainColor }}>{lng.value}</Text>
            </View>
            <View>
              <CustomRadioButton
                label={lng.code}
                isSelected={lng.code === isSelected}
                showLabel={false}
                onPress={() => handleLanguageSelection(lng.code)}
              />
            </View>
          </View>
        );
      })}
      <View>
        <CustomContinueButton
          title={isChangingLang ? t("Please wait") : t("Update Language")}
          onPress={() => handleSubmission()}
        />
      </View>
    </View>
  );
}
