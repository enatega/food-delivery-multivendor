import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useApptheme } from "@/lib/context/theme.context";
import { ORDER_TYPE } from "@/lib/utils/types";

export const InstructionCard = ({
  instructions,
  compact = false,
}: {
  instructions?: string;
  compact?: boolean;
}) => {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const content = instructions?.trim();

  if (!content) return null;

  return (
    <View
      style={{
        alignItems: "flex-start",
        backgroundColor: appTheme.lowOpacityPrimaryColor,
        borderRadius: 12,
        flexDirection: "row",
        gap: compact ? 8 : 10,
        marginTop: compact ? 8 : 12,
        padding: compact ? 10 : 12,
      }}
    >
      <Ionicons
        color={appTheme.primary}
        name="document-text-outline"
        size={compact ? 16 : 18}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: appTheme.primary,
            fontSize: compact ? 11 : 12,
            fontWeight: "700",
          }}
        >
          {t("Special Instructions")}
        </Text>
        <Text
          style={{
            color: appTheme.fontMainColor,
            fontSize: compact ? 13 : 14,
            lineHeight: compact ? 18 : 20,
            marginTop: 2,
          }}
        >
          {content}
        </Text>
      </View>
    </View>
  );
};

export const AmountRow = ({
  emphasized = false,
  label,
  value,
}: {
  emphasized?: boolean;
  label: string;
  value: string;
}) => {
  const { appTheme } = useApptheme();

  return (
    <View
      style={[
        styles.amountRow,
        emphasized && {
          borderColor: appTheme.borderLineColor,
          borderTopWidth: StyleSheet.hairlineWidth,
          marginTop: 6,
          paddingTop: 14,
        },
      ]}
    >
      <Text
        style={{
          color: emphasized ? appTheme.fontMainColor : appTheme.fontSecondColor,
          flex: 1,
          fontSize: emphasized ? 17 : 14,
          fontWeight: emphasized ? "700" : "500",
        }}
      >
        {label}
      </Text>
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.75}
        numberOfLines={1}
        style={{
          color: emphasized ? appTheme.primary : appTheme.fontMainColor,
          flexShrink: 1,
          fontSize: emphasized ? 20 : 14,
          fontVariant: ["tabular-nums"],
          fontWeight: emphasized ? "700" : "600",
          marginStart: 16,
          textAlign: "right",
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export const getStatusPalette = (tab: ORDER_TYPE, isDark: boolean) => {
  if (tab === "delivered") {
    return {
      backgroundColor: isDark ? "rgba(96, 165, 250, 0.16)" : "#DBEAFE",
      color: isDark ? "#93C5FD" : "#1D4ED8",
    };
  }

  if (tab === "processing") {
    return {
      backgroundColor: isDark ? "rgba(251, 191, 36, 0.14)" : "#FEF3C7",
      color: isDark ? "#FCD34D" : "#92400E",
    };
  }

  return {
    backgroundColor: isDark ? "rgba(134, 239, 172, 0.14)" : "#DCFCE7",
    color: isDark ? "#86EFAC" : "#166534",
  };
};

export const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  amountRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 30,
  },
  amountSection: {
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
  },
  autoDeclineRow: {
    alignItems: "center",
    marginTop: 14,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 18,
  },
  detailLine: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    minHeight: 24,
  },
  detailsButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    minHeight: 44,
  },
  detailsContent: {
    gap: 4,
    paddingBottom: 6,
  },
  fulfillmentIcon: {
    alignItems: "center",
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  fulfillmentSection: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    paddingTop: 18,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemHeadingRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemImage: {
    borderRadius: 12,
    height: 68,
    overflow: "hidden",
    width: 68,
  },
  itemImagePlaceholder: {
    left: 22,
    position: "absolute",
    top: 22,
  },
  itemRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 14,
    flex: 1,
    height: 52,
    justifyContent: "center",
  },
  secondaryButton: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 52,
    justifyContent: "center",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
  },
  statusBadge: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 28,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  timerRow: {
    alignItems: "flex-start",
    marginStart: -5,
  },
});
