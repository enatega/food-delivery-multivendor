import { View } from "react-native";

import { useApptheme } from "@/lib/context/global/theme.context";
import WorkScheduleMainScreen from "@/lib/ui/screen-components/work-schedule/main";

export default function WorkScheduleScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  return (
 
      <WorkScheduleMainScreen />
  );
}
