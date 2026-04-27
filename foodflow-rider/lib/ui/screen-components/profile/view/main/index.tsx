import { useApptheme } from "@/lib/context/global/theme.context";
import { IRiderProfileMainProps } from "@/lib/utils/interfaces/rider-profile.interface";
import { View } from "react-native";
import DocumentsSection from "../docs/documents";
import OtherDetailsSection from "../docs/other";

export default function ProfileMain({
  setIsFormOpened,
}: IRiderProfileMainProps) {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <View
      className="flex flex-col h-full items-center"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <DocumentsSection setIsFormOpened={setIsFormOpened} />
      <OtherDetailsSection />
    </View>
  );
}
