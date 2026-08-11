//
import { useApptheme } from "@/lib/context/theme.context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ScrollView, View } from "react-native";
import DocumentsSection from "../docs/documents";

export default function ProfileMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <View className="flex flex-col items-center">
        <DocumentsSection />
      </View>
    </ScrollView>
  );
}
