import { useApptheme } from "@/lib/context/global/theme.context";
import { Text, TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";

export default function CustomContinueButton({
  title,
  style,
  ...props
}: { title: string } & TouchableOpacityProps) {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <TouchableOpacity
      {...props}
      className={`py-5 min-w-72 lg:px-52 rounded-[80] items-center justify-center my-auto mt-8 ${props.className}`}
      style={[{ backgroundColor: appTheme.primary }, style]}
    >
      <Text className="text-[16px]">{title}</Text>
    </TouchableOpacity>
  );
}
