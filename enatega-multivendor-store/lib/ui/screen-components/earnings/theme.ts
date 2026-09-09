import { useApptheme } from "@/lib/context/theme.context";
import { useMemo } from "react";

export const useEarningsTheme = () => {
  const { appTheme, currentTheme } = useApptheme();

  return useMemo(() => {
    const isDark = currentTheme === "dark";

    return {
      accent: appTheme.primary,
      accentSoft: isDark
        ? "rgba(165, 198, 22, 0.14)"
        : "rgba(144, 227, 109, 0.18)",
      canvas: isDark ? "#070C13" : "#F5F7F3",
      divider: isDark ? "rgba(214, 224, 235, 0.09)" : "#E2E8DE",
      iconSurface: isDark ? "#1B2736" : "#EEF4EA",
      mutedText: isDark ? "#9CA8B6" : "#667085",
      overlay: isDark ? "rgba(2, 6, 12, 0.78)" : "rgba(19, 30, 20, 0.38)",
      primaryText: isDark ? "#F4F7FA" : "#17201A",
      rule: isDark ? "rgba(156, 168, 182, 0.18)" : "rgba(102, 112, 133, 0.18)",
      skeletonBase: isDark ? "#172231" : "#E5EBE2",
      skeletonHighlight: isDark ? "#223146" : "#F4F7F2",
      surface: isDark ? "#111A27" : "#FFFFFF",
      surfaceEnd: isDark ? "#0D1622" : "#F8FAF7",
      surfaceRaised: isDark ? "#172231" : "#F0F4EE",
    };
  }, [appTheme.primary, currentTheme]);
};
