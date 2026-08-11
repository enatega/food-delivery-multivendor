import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/lib/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "themeBackground",
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
