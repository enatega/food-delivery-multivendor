import { useUserContext } from "@/lib/context/global/user.context";
import { usePathname } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UnavailableStatus() {
  // Hooks
  const pathName = usePathname();
  const { dataProfile } = useUserContext();
  const insets = useSafeAreaInsets(); // Get Safe Area Insets

  if (pathName && pathName === "/login") return null;
  if (dataProfile?.available) return null;

  return (
    <View
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingTop: insets.top - 9, // Ensures it stays below the notch
        paddingHorizontal: 16,
        paddingBottom: 2,
        position: "absolute",
        width: "100%",
        zIndex: 50,
      }}
    >
      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
        You are currently unavailable.
      </Text>
    </View>
  );
}
