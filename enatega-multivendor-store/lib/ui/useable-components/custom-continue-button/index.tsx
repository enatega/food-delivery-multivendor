import { useApptheme } from "@/lib/context/theme.context";
import { Text, TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";
import CustomSpinner from "../custom-spinner";

export default function CustomContinueButton({
  title,
  isLoading,
  ...props
}: { title: string; isLoading?: boolean } & TouchableOpacityProps) {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <TouchableOpacity
      {...props}
      className="py-5 min-w-96 lg:px-52 rounded-[80] items-center justify-center my-auto mt-8"
      style={{ backgroundColor: appTheme.primary }}
    >
      {isLoading ? (
        <CustomSpinner />
      ) : (
        <Text className="text-[16px]" style={{ color: appTheme.black }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
