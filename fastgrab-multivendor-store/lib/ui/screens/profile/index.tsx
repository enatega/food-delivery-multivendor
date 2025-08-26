// Components
import { useApptheme } from "@/lib/context/theme.context";
import { View } from "react-native";
import ProfileHeader from "../../screen-components/profile/header";
import ProfileMain from "../../screen-components/profile/view/main";

export default function ComponentName() {
  const { appTheme } = useApptheme();
  return (
    <View
      className="w-full h-full"
      // edges={{ bottom: "off", top: "additive" }}
      style={{
        backgroundColor: appTheme.themeBackground,
      }}
    >
      <ProfileHeader />
      <ProfileMain />
    </View>
  );
}
