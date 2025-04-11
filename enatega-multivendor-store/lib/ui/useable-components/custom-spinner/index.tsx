// Core
import { Animated } from "react-native";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
export default function CustomSpinner() {
  // Hooks
  const { appTheme } = useApptheme();

  // Spin Value
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
  ).start();

  return (
    <Animated.View
      className=" w-8 h-8 rounded-full m-auto self-center"
      style={{
        borderLeftColor: appTheme.fontMainColor,
        borderLeftWidth: 2,
        transform: [
          {
            rotate: spinValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }}
    />
  );
}
