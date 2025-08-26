//
import { useApptheme } from "@/lib/context/theme.context";
import { View } from "react-native";
import DocumentsSection from "../docs/documents";

export default function ProfileMain() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <View
      className="flex flex-col h-full items-center"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <DocumentsSection />
    </View>
  );
}
