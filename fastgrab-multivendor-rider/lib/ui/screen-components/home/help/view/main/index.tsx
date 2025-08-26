import { useApptheme } from "@/lib/context/global/theme.context";
import { FAQs } from "@/lib/utils/constants";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HelpAccordian from "../../accordian";

export default function HelpMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  const openWhatsAppStore = () => {
    const appStoreUrl =
      "https://apps.apple.com/app/whatsapp-messenger/id310633997";
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.whatsapp";

    const storeUrl = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;

    Linking.canOpenURL(storeUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(storeUrl);
        } else {
          console.log("Cannot open URL:", storeUrl);
        }
      })
      .catch((err) => console.log("Error opening URL:", err));
  };

  const openWhatsAppChat = async () => {
    try {
      const phoneNumber = "+1(307)776%E2%80%918999";

      if (Platform.OS === "android") {
        const androidUrl = `whatsapp://send?phone=${phoneNumber}`;
        const status = await Linking.openURL(androidUrl);

        if (!status) {
          openWhatsAppStore();
        }
      } else if (Platform.OS === "ios") {
        const iosUrl = `https://wa.me/${phoneNumber.replace("+", "")}`;

        const supported = await Linking.canOpenURL(iosUrl);
        if (supported) {
          await Linking.openURL(iosUrl);
        } else {
          openWhatsAppStore();
        }
      }
    } catch (error) {
      console.log("Error opening URL", error);
      openWhatsAppStore();
    }
  };

  useFocusEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("white");
    }
  });

  return (
    <View
      className="flex-1 w-full dark:bg-gray-900 pb-16"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <StatusBar barStyle="light-content" />

      <View className="h-[90%] p-4">
        <FlatList
          className="flex flex-col w-[99%] ml-1 overflow-x-hidden"
          data={FAQs}
          keyExtractor={(item) => "Faq-" + item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <HelpAccordian heading={t(item.heading)}>
              <Text style={{ color: appTheme.fontSecondColor }}>
                {t(item.description)}
              </Text>
            </HelpAccordian>
          )}
        />
      </View>

      <View className="w-full flex items-center mt-4">
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-[90%] h-12 rounded-full bg-green-500 flex flex-row items-center justify-center gap-2 shadow-lg"
          onPress={openWhatsAppChat}
        >
          <FontAwesome name="whatsapp" size={24} color="white" />
          <Text className="text-white font-semibold text-lg">
            {t("whatsAppText")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
