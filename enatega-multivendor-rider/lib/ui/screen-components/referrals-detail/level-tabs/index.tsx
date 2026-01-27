// Contexts
import { useApptheme } from "@/lib/context/global/theme.context";

// Core
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface ILevelTabsProps {
  activeLevel: 1 | 2 | 3;
  onLevelChange: (level: 1 | 2 | 3) => void;
}

export default function LevelTabs({
  activeLevel,
  onLevelChange,
}: ILevelTabsProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  const tabs: Array<{ label: string; value: 1 | 2 | 3 }> = [
    { label: t("Level 1"), value: 1 },
    { label: t("Level 2"), value: 2 },
    { label: t("Level 3"), value: 3 },
  ];

  return (
    <View
      className="flex flex-row justify-around items-center px-4 py-3"
      style={{
        backgroundColor: appTheme.themeBackground,
      }}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.value}
          onPress={() => onLevelChange(tab.value)}
          className="flex-1 items-center pb-2"
          style={{
            borderBottomWidth: activeLevel === tab.value ? 2 : 0,
            borderBottomColor: activeLevel === tab.value ? appTheme.primary : "transparent",
          }}
        >
          <Text
            className="text-base font-semibold"
            style={{
              color:
                activeLevel === tab.value
                  ? appTheme.primary
                  : appTheme.fontSecondColor,
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
