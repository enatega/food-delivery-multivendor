import { useApptheme } from "@/lib/context/global/theme.context";
import { ICustomRadioButtonProps } from "@/lib/utils/interfaces/custom-radio-button.interface";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

export default function CustomRadioButton({
  isSelected,
  label,
  showLabel,
  ...props
}: ICustomRadioButtonProps & TouchableOpacityProps) {
  const { appTheme } = useApptheme();

  return (
    <TouchableOpacity {...props} className="flex flex-row gap-3">
      {showLabel && label && (
        <Text style={{ color: appTheme.fontMainColor }}>{label}</Text>
      )}
      <View
        className={`border rounded-full p-1 w-6 h-6 items-center justify-center`}
        style={{ borderColor: isSelected ? appTheme.primary : appTheme.gray }}
      >
        <View
          className={`rounded-full w-4 h-4`}
          style={{
            backgroundColor: isSelected ? appTheme.primary : "transparent",
          }}
        />
      </View>
      <TouchableOpacity />
    </TouchableOpacity>
  );
}
