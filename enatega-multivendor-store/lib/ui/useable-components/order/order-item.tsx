import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useApptheme } from "@/lib/context/theme.context";
import { Item } from "@/lib/utils/interfaces/order.interface";
import { formatAmount } from "@/lib/utils/methods";
import { InstructionCard, styles } from "./order-card-presentation";

interface OrderItemProps {
  currencySymbol?: string;
  hasDivider: boolean;
  item: Item;
  onToggleDetails: (itemId: string) => void;
  showDetails: boolean;
}

const OrderItem = ({
  currencySymbol,
  hasDivider,
  item,
  onToggleDetails,
  showDetails,
}: OrderItemProps) => {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const variation = item.variation || {};
  const itemTotal = (variation.price ?? 0) * (item.quantity ?? 1);
  const hasDetails = Boolean(variation.title || item.addons?.length);

  return (
    <View
      style={[
        styles.itemRow,
        hasDivider && {
          borderBottomColor: `${appTheme.fontMainColor}14`,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View
        style={[
          styles.itemImage,
          { backgroundColor: appTheme.lowOpacityPrimaryColor },
        ]}
      >
        <Ionicons
          color={appTheme.primary}
          name="restaurant-outline"
          size={24}
          style={styles.itemImagePlaceholder}
        />
        <Image
          accessibilityLabel={item.title}
          src={item.image}
          style={styles.itemImage}
        />
      </View>

      <View style={styles.itemContent}>
        <View style={styles.itemHeadingRow}>
          <Text
            style={{
              color: appTheme.fontMainColor,
              flex: 1,
              fontSize: 15,
              fontWeight: "600",
              lineHeight: 20,
            }}
          >
            <Text style={{ color: appTheme.primary, fontWeight: "700" }}>
              {`${item.quantity}× `}
            </Text>
            {item.title}
          </Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            numberOfLines={1}
            style={{
              color: appTheme.fontMainColor,
              fontSize: 15,
              fontVariant: ["tabular-nums"],
              fontWeight: "700",
              marginStart: 12,
            }}
          >
            {`${currencySymbol}${formatAmount(itemTotal)}`}
          </Text>
        </View>

        {!!item.description && (
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 13,
              lineHeight: 18,
              marginTop: 3,
            }}
          >
            {item.description}
          </Text>
        )}
        <InstructionCard instructions={item.specialInstructions} compact />

        {hasDetails && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ expanded: showDetails }}
            onPress={() => onToggleDetails(item._id)}
            style={styles.detailsButton}
          >
            <Text
              style={{
                color: appTheme.primary,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {showDetails ? t("Hide Details") : t("Show Details")}
            </Text>
            <Ionicons
              color={appTheme.primary}
              name={showDetails ? "chevron-up" : "chevron-down"}
              size={16}
            />
          </TouchableOpacity>
        )}

        {showDetails && (
          <View style={styles.detailsContent}>
            {variation.title && (
              <View style={styles.detailLine}>
                <Text
                  style={{
                    color: appTheme.fontSecondColor,
                    flex: 1,
                    fontSize: 12,
                  }}
                >
                  {variation.title}
                </Text>
                <Text
                  style={{
                    color: appTheme.fontMainColor,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {`${currencySymbol}${formatAmount(variation.price)}`}
                </Text>
              </View>
            )}

            {item.addons?.flatMap((addon) =>
              addon.options?.map((option) => (
                <View key={option._id} style={styles.detailLine}>
                  <Text
                    style={{
                      color: appTheme.fontSecondColor,
                      flex: 1,
                      fontSize: 12,
                    }}
                  >
                    {option.title}
                  </Text>
                  <Text style={{ color: appTheme.fontMainColor, fontSize: 12 }}>
                    {`+${currencySymbol}${formatAmount(option.price)}`}
                  </Text>
                </View>
              )),
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderItem;
