// Hooks
import { useApptheme } from "@/lib/context/theme.context";

// Core
import { Text, TouchableOpacity } from "react-native";

function UpdateTimeBtn({
  updateTime,
  dropdown,
  time,
}: {
  updateTime: (
    dayIndex: number,
    slotIndex: number,
    type: "startTime" | "endTime",
    value: string,
  ) => void;
  dropdown: {
    dayIndex: number;
    slotIndex: number;
    type: "start" | "end";
  };
  time: string;
}) {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <TouchableOpacity
      key={time}
      onPress={() =>
        updateTime(
          dropdown.dayIndex,
          dropdown.slotIndex,
          dropdown.type === "start" ? "startTime" : "endTime",
          time,
        )
      }
      className="p-2 border-b "
      style={{ borderColor: appTheme.borderLineColor }}
    >
      <Text
        className="font-[Inter] text-center text-lg"
        style={{ color: appTheme.fontMainColor }}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
}

export default UpdateTimeBtn;
