// Components
import { useApptheme } from "@/lib/context/theme.context";
import EarningDetailsMain from "@/lib/ui/screen-components/earning-details/view";

// Interfaces
import { IDateFilter } from "@/lib/utils/interfaces/rider-earnings.interface";

// Hooks
import { useState } from "react";

// Safe Area
import { SafeAreaView } from "react-native";

export default function EarningsDetailScreen() {
  // Hooks
  const { appTheme } = useApptheme();

  // States
  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    startDate: "",
    endDate: "",
  });
  return (
    <SafeAreaView
      style={{ backgroundColor: appTheme.themeBackground }}
      className="h-full w-full"
    >
      <EarningDetailsMain
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
    </SafeAreaView>
  );
}
