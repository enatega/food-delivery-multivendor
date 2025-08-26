// Expo
import { Link, Stack } from "expo-router";

// Core
import { StyleSheet } from "react-native";

// Components
import { ThemedText } from "@/lib/ui/useable-components/ThemedText";
import { ThemedView } from "@/lib/ui/useable-components/ThemedView";

// Hooks
import { useApptheme } from "@/lib/context/theme.context";
import { useTranslation } from "react-i18next";

export default function NotFoundScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ color: appTheme.fontMainColor }}>
          {t("This screen does not exist")}
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{t("Go to home screen")}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
