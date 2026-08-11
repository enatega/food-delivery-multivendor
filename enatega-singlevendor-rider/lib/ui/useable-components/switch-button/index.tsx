import { useApptheme } from "@/lib/context/global/theme.context";
import { CustomSwitchProps } from "@/lib/utils/interfaces/custom-input-switch";
import { MaterialIcons } from "@expo/vector-icons";
import { Switch, TouchableOpacity, View } from "react-native";

const CustomSwitch = ({ value, onToggle, isDisabled }: CustomSwitchProps) => {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`flex-row items-center ${isDisabled && "opacity-35"}`}
      onPress={() => onToggle(!value)}
      activeOpacity={0.8}
    >
      <View
        className="w-16 h-8 rounded-full flex-row items-center px-1"
        style={{
          backgroundColor: value
            ? appTheme.switchButtonColor
            : appTheme.secondaryTextColor,
        }}
      >
        {value ? (
          <View className="ml-auto mr-[1px] bg-white rounded-full h-[20px] w-[20px]">
            <MaterialIcons
              name="check"
              size={20}
              color={appTheme.switchButtonColor}
            />
          </View>
        ) : (
          <View className="ml-[1px] bg-white rounded-full h-[20px] w-[20px]">
            <MaterialIcons
              name="close"
              size={20}
              color={appTheme.secondaryTextColor}
            />
          </View>
        )}

        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "transparent", true: "transparent" }}
          thumbColor={"white"}
          className="absolute inset-0 w-full h-full opacity-0"
        />
      </View>
    </TouchableOpacity>
  );
};

export default CustomSwitch;
