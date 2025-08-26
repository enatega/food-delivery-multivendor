import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { useApptheme } from "@/lib/context/global/theme.context";
import { IconSymbol } from "@/lib/ui/useable-components/IconSymbol";
import { ThemedText } from "@/lib/ui/useable-components/ThemedText";
import { ThemedView } from "@/lib/ui/useable-components/ThemedView";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  // States
  const [isOpen, setIsOpen] = useState(false);

  // Hooks
  const { appTheme } = useApptheme();
  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={appTheme.iconColor}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
