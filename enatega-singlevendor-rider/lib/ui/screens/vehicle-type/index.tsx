import { useApptheme } from "@/lib/context/global/theme.context";
import { View } from "react-native";
import VehicleTypeMainScreen from "../../screen-components/vehicle-type/main";

export default function VehicleTypeScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <View
      className="flex-1"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <VehicleTypeMainScreen />
    </View>
  );
}
