// Safe Area
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import { useApptheme } from "@/lib/context/theme.context";
import ChatHeader from "@/lib/ui/screen-components/chat/header";
import ChatMain from "@/lib/ui/screen-components/chat/main";

export default function Chat() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <ChatHeader />
      <ChatMain />
    </SafeAreaView>
  );
}
