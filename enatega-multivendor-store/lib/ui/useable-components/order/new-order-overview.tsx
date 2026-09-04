import { useApptheme } from "@/lib/context/theme.context";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { linkToMapsApp } from "@/lib/utils/methods";
import { parseTimestamp } from "@/lib/utils/methods/date-time";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";

interface IOrderFactProps {
  label: string;
  value: string;
  isRTL: boolean;
}

const OrderFact = ({ label, value, isRTL }: IOrderFactProps) => {
  const { appTheme } = useApptheme();

  return (
    <View style={{ flex: 1, minWidth: "45%" }}>
      <Text
        style={{
          color: appTheme.fontSecondColor,
          fontSize: 12,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: appTheme.fontMainColor,
          fontSize: 14,
          fontWeight: "600",
          marginTop: 2,
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {value}
      </Text>
    </View>
  );
};

const formatDateTime = (value: unknown) =>
  parseTimestamp(value)?.toLocaleString(undefined, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  }) ?? "—";

const NewOrderOverview = ({ order }: { order: IOrder }) => {
  const { appTheme } = useApptheme();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const createdAt = parseTimestamp(order.createdAt);
  const orderDate = parseTimestamp(order.orderDate);
  const isScheduled = Boolean(
    createdAt &&
      orderDate &&
      orderDate.getTime() > createdAt.getTime() + 5 * 60 * 1000,
  );
  const timing = isScheduled
    ? `${t("Scheduled")} · ${formatDateTime(order.orderDate)}`
    : t("ASAP");
  const totalItems = order.items.reduce(
    (total, item) => total + (item?.quantity ?? 0),
    0,
  );
  const address =
    order.deliveryAddress?.deliveryAddress ||
    order.deliveryAddress?.label ||
    "—";
  const deliveryInstructions = order.deliveryAddress?.details?.trim();
  const [longitude, latitude] =
    order.deliveryAddress?.location?.coordinates ?? [];
  const canOpenMap =
    !order.isPickedUp &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const openMap = () => {
    if (!canOpenMap) return;
    linkToMapsApp({ latitude, longitude }, address);
  };

  return (
    <View
      style={{
        backgroundColor: appTheme.cartContainer,
        borderColor: appTheme.borderLineColor,
        borderRadius: 8,
        borderWidth: 1,
        gap: 12,
        marginTop: 8,
        padding: 12,
      }}
    >
      <View
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <OrderFact
          label={t("Order received")}
          value={formatDateTime(order.createdAt)}
          isRTL={isRTL}
        />
        <OrderFact label={t("Order timing")} value={timing} isRTL={isRTL} />
        <OrderFact
          label={t("Order type")}
          value={t(order.isPickedUp ? "Pickup Order" : "Delivery Order")}
          isRTL={isRTL}
        />
        <OrderFact
          label={t("Total Items")}
          value={String(totalItems)}
          isRTL={isRTL}
        />
        <OrderFact
          label={t("Customer")}
          value={order.user?.name || "—"}
          isRTL={isRTL}
        />
        <OrderFact
          label={t("Payment Method")}
          value={order.paymentMethod ? t(order.paymentMethod) : "—"}
          isRTL={isRTL}
        />
        <OrderFact
          label={t("Payment status")}
          value={
            order.paymentStatus ? t(order.paymentStatus) : t("(Not paid yet)")
          }
          isRTL={isRTL}
        />
      </View>

      {!order.isPickedUp && (
        <View
          style={{
            borderColor: appTheme.borderLineColor,
            borderTopWidth: 1,
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 12,
              textAlign: isRTL ? "right" : "left",
            }}
          >
            {t("Address")}
          </Text>
          <View
            style={{
              alignItems: "center",
              flexDirection: isRTL ? "row-reverse" : "row",
              gap: 12,
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Text
              style={{
                color: appTheme.fontMainColor,
                flex: 1,
                fontSize: 14,
                lineHeight: 20,
                textAlign: isRTL ? "right" : "left",
              }}
            >
              {address}
            </Text>
            {canOpenMap && (
              <TouchableOpacity
                accessibilityRole="link"
                onPress={openMap}
                style={{ paddingHorizontal: 6, paddingVertical: 8 }}
              >
                <Text
                  style={{
                    color: appTheme.primary,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {t("View Map")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {deliveryInstructions && deliveryInstructions !== address && (
            <View style={{ marginTop: 8 }}>
              <Text
                style={{
                  color: appTheme.fontSecondColor,
                  fontSize: 12,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {t("Delivery instructions")}
              </Text>
              <Text
                style={{
                  color: appTheme.fontMainColor,
                  fontSize: 14,
                  lineHeight: 20,
                  marginTop: 2,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {deliveryInstructions}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default NewOrderOverview;
