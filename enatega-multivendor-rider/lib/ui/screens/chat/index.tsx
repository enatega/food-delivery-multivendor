// Core
import { SafeAreaView } from "react-native-safe-area-context";

// Components
import ChatHeader from "@/lib/ui/screen-components/chat/header";
import ChatMain from "@/lib/ui/screen-components/chat/main";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";

export default function Chat() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <SafeAreaView
      className="flex-1  gap-y-3"
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <ChatHeader />
      <ChatMain />
    </SafeAreaView>
  );
}
