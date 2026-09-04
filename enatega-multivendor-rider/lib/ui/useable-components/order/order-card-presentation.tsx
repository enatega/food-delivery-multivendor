import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useApptheme } from "@/lib/context/global/theme.context";
import { ORDER_TYPE } from "@/lib/utils/types";

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

export const OrderHeader = ({
  orderId,
  orderStatus,
  tab,
}: {
  orderId: string;
  orderStatus: string;
  tab: ORDER_TYPE;
}) => {
  const { appTheme, currentTheme } = useApptheme();
  const { t } = useTranslation();
  const palette = getStatusPalette(tab, currentTheme === "dark");

  return (
    <View style={styles.headerRow}>
      <View style={{ flex: 1, paddingEnd: 16 }}>
        <Text style={[styles.label, { color: appTheme.fontSecondColor }]}>
          {t("Order ID")}
        </Text>
        <Text
          selectable
          style={[styles.orderId, { color: appTheme.fontMainColor }]}
        >
          #{orderId}
        </Text>
      </View>
      <View
        accessibilityLabel={`${t("Status")}: ${t(orderStatus)}`}
        style={[
          styles.statusBadge,
          { backgroundColor: palette.backgroundColor },
        ]}
      >
        <Text style={[styles.statusText, { color: palette.color }]}>
          {t(orderStatus)}
        </Text>
      </View>
    </View>
  );
};

export const RestaurantIdentity = ({
  image,
  name,
}: {
  image?: string;
  name: string;
}) => {
  const { appTheme } = useApptheme();

  return (
    <View style={styles.restaurantRow}>
      <View
        style={[
          styles.restaurantImage,
          { backgroundColor: appTheme.lowOpacityPrimaryColor },
        ]}
      >
        <Ionicons
          color={appTheme.primary}
          name="restaurant-outline"
          size={20}
          style={styles.restaurantPlaceholder}
        />
        {!!image && (
          <Image
            accessibilityLabel={name}
            source={{ uri: image }}
            style={styles.restaurantImage}
          />
        )}
      </View>
      <Text
        numberOfLines={2}
        style={[styles.restaurantName, { color: appTheme.fontMainColor }]}
      >
        {name}
      </Text>
    </View>
  );
};

export const RouteStop = ({
  address,
  isLast = false,
  label,
  type,
}: {
  address: string;
  isLast?: boolean;
  label: string;
  type: "pickup" | "delivery";
}) => {
  const { appTheme } = useApptheme();

  return (
    <View style={styles.routeStop}>
      <View style={styles.routeMarkerColumn}>
        <View
          style={[
            styles.routeIcon,
            { backgroundColor: appTheme.lowOpacityPrimaryColor },
          ]}
        >
          <Ionicons
            color={appTheme.primary}
            name={type === "pickup" ? "storefront-outline" : "location-outline"}
            size={20}
          />
        </View>
        {!isLast && (
          <View
            style={[
              styles.routeLine,
              { backgroundColor: `${appTheme.fontMainColor}24` },
            ]}
          />
        )}
      </View>
      <View style={styles.routeCopy}>
        <Text style={[styles.label, { color: appTheme.fontSecondColor }]}>
          {label}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.address, { color: appTheme.fontMainColor }]}
        >
          {address || "—"}
        </Text>
      </View>
    </View>
  );
};

export const Metric = ({
  icon,
  value,
}: {
  icon: "time-outline" | "bicycle-outline";
  value: string;
}) => {
  const { appTheme } = useApptheme();

  return (
    <View style={styles.metric}>
      <Ionicons color={appTheme.primary} name={icon} size={18} />
      <Text
        numberOfLines={1}
        style={[styles.metricValue, { color: appTheme.fontMainColor }]}
      >
        {value}
      </Text>
    </View>
  );
};

const formatAmount = (amount: number) =>
  Number.isFinite(Number(amount)) ? Number(amount).toFixed(2) : "0.00";

export const PaymentSummary = ({
  amount,
  currencySymbol,
  paymentMethod,
  paymentStatus,
}: {
  amount: number;
  currencySymbol?: string;
  paymentMethod: string;
  paymentStatus: string;
}) => {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const isPaid = paymentStatus === "PAID";

  return (
    <View
      style={[
        styles.paymentRow,
        { borderColor: `${appTheme.fontMainColor}1F` },
      ]}
    >
      <View style={styles.paymentColumn}>
        <Text style={[styles.label, { color: appTheme.fontSecondColor }]}>
          {t("Payment Method")}
        </Text>
        <Text style={[styles.paymentValue, { color: appTheme.fontMainColor }]}>
          {paymentMethod}
        </Text>
      </View>
      <View style={[styles.paymentColumn, { alignItems: "flex-end" }]}>
        <Text style={[styles.label, { color: appTheme.fontSecondColor }]}>
          {t("Order Amount")}
        </Text>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          numberOfLines={1}
          style={[styles.amount, { color: appTheme.primary }]}
        >
          {currencySymbol}
          {formatAmount(amount)}
        </Text>
        <Text
          style={{
            color: isPaid ? appTheme.orderComplete : appTheme.fontSecondColor,
            fontSize: 11,
            fontWeight: "600",
            marginTop: 2,
          }}
        >
          {isPaid ? t("Paid") : t("(Not paid yet)")}
        </Text>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  address: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 3,
  },
  amount: {
    fontSize: 19,
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
    marginTop: 2,
    maxWidth: "100%",
  },
  assignButton: {
    alignItems: "center",
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    marginTop: 14,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 12,
    marginVertical: 8,
    overflow: "hidden",
    padding: 18,
  },
  chatButton: {
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    paddingTop: 14,
  },
  chatIcon: {
    alignItems: "center",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  detailAffordance: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "flex-end",
    minHeight: 44,
    paddingTop: 8,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  metric: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 44,
  },
  metricsRow: {
    borderRadius: 12,
    flexDirection: "row",
    marginTop: 4,
    overflow: "hidden",
  },
  metricValue: {
    fontSize: 14,
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
  },
  orderId: {
    fontSize: 20,
    fontVariant: ["tabular-nums"],
    fontWeight: "700",
    marginTop: 2,
  },
  paymentColumn: {
    flex: 1,
  },
  paymentRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 16,
  },
  paymentValue: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },
  restaurantImage: {
    borderRadius: 12,
    height: 48,
    overflow: "hidden",
    width: 48,
  },
  restaurantName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
  },
  restaurantPlaceholder: {
    left: 14,
    position: "absolute",
    top: 14,
  },
  restaurantRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  routeCopy: {
    flex: 1,
    paddingBottom: 16,
  },
  routeIcon: {
    alignItems: "center",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  routeLine: {
    flex: 1,
    marginVertical: 4,
    width: StyleSheet.hairlineWidth,
  },
  routeMarkerColumn: {
    alignItems: "center",
    alignSelf: "stretch",
    width: 40,
  },
  routeSection: {
    marginTop: 18,
  },
  routeStop: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    minHeight: 70,
  },
  statusBadge: {
    alignItems: "center",
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 28,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
