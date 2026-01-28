import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function InviteFriendsScreen() {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { dataProfile } = useUserContext();

  // Generate referral code or link
  const referralCode =  dataProfile?.referralCode || "000000";
  const referralLink = `https://yourapp.com/signup?ref=${referralCode}`;

  const handleCopyCode = async () => {
    try {
      await Share.share({
        message: referralCode,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `${t("Join me on this amazing delivery platform!")} ${t("Use my referral code")}: ${referralCode}\n\n${referralLink}`,
        title: t("Invite Friends"),
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome
            name="arrow-left"
            size={22}
            color={appTheme.fontMainColor}
          />
        </TouchableOpacity>
        <Text
          className="text-lg font-semibold"
          style={{ color: appTheme.fontMainColor }}
        >
          {t("QR & Referral")}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="items-center px-5 pt-12">
          {/* QR Code */}
          <View
            className="p-8 rounded-3xl mb-8"
            style={{
              backgroundColor: appTheme.themeBackground,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <QRCode
              value={referralLink}
              size={220}
              color="#000000"
              backgroundColor="#ffffff"
            />
          </View>

          {/* Title */}
          <Text
            className="text-xl font-bold mb-2"
            style={{ color: appTheme.fontMainColor }}
          >
            {t("Invite & Earn")}
          </Text>

          {/* Description */}
          <Text
            className="text-sm text-center mb-8 px-4"
            style={{ color: appTheme.fontSecondColor, lineHeight: 20 }}
          >
            {t("You and your friend each get $2.5 when they join using your code or QR and place their first order.")}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-3 px-4">
            {/* Copy Code Button */}
            <TouchableOpacity
              onPress={handleCopyCode}
              className="flex-row items-center justify-center px-6 py-3 rounded-full"
              style={{
                backgroundColor: appTheme.themeBackground,
                borderWidth: 1.5,
                borderColor: appTheme.borderLineColor,
              }}
            >
              <FontAwesome
                name="copy"
                size={16}
                color={appTheme.fontMainColor}
                style={{ marginRight: 8 }}
              />
              <Text
                className="text-sm font-semibold"
                style={{ color: appTheme.fontMainColor }}
              >
                {referralCode}
              </Text>
            </TouchableOpacity>

            {/* Share Link Button */}
            <TouchableOpacity
              onPress={handleShareLink}
              className="flex-row items-center justify-center px-6 py-3 rounded-full"
              style={{
                backgroundColor: appTheme.themeBackground,
                borderWidth: 1.5,
                borderColor: appTheme.borderLineColor,
              }}
            >
              <FontAwesome
                name="share-alt"
                size={16}
                color={appTheme.fontMainColor}
                style={{ marginRight: 8 }}
              />
              <Text className="text-sm font-semibold" style={{ color: appTheme.fontMainColor }}>
                {t("Share link")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
