import { useApptheme } from "@/lib/context/theme.context";
import { IconSymbol } from "@/lib/ui/useable-components/IconSymbol";
import { ThemedText } from "@/lib/ui/useable-components/ThemedText";
import { ThemedView } from "@/lib/ui/useable-components/ThemedView";
import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { appTheme } = useApptheme();

  return (
    <ThemedView style={{ backgroundColor: appTheme.themeBackground }}>
      <TouchableOpacity
        style={[styles.heading, { borderColor: appTheme.borderLineColor }]}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={appTheme.fontMainColor}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <ThemedText
          type="defaultSemiBold"
          style={{ color: appTheme.fontMainColor }}
        >
          {title}
        </ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView
          style={[
            styles.content,
            { backgroundColor: appTheme.themeBackground },
          ]}
        >
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
  },
});
