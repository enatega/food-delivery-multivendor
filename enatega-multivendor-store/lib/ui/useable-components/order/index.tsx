import { useSubscription } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import {
  SUBSCRIPTION_ORDER,
  SUBSCRIPTION_ORDER_MULTI_VENDOR,
} from "@/lib/apollo/subscriptions";
import { useStoreMode } from "@/lib/context/global/store-mode.context";
import { MAX_TIME } from "@/lib/utils/constants";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { formatAmount, orderSubTotal } from "@/lib/utils/methods";
import {
  formatTimestampTime,
  parseTimestamp,
} from "@/lib/utils/methods/date-time";
import { getIsAcceptButtonVisible } from "@/lib/utils/methods/gloabl";
import { ORDER_TYPE } from "@/lib/utils/types";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CountdownTimer from "../custom-timer";
import SpinnerComponent from "../spinner";
import NewOrderOverview from "./new-order-overview";
import OrderItem from "./order-item";
import {
  AmountRow,
  getStatusPalette,
  InstructionCard,
  styles,
} from "./order-card-presentation";

// Hooks
import { useSoundContext } from "@/lib/context/global/sound.context";
import { useApptheme } from "@/lib/context/theme.context";
import useCancelOrder from "@/lib/hooks/useCancelOrder";
import useOrderPickedUp from "@/lib/hooks/useOrderPickedUp";
import { useTranslation } from "react-i18next";

interface IOrderProps {
  order: IOrder;
  tab: ORDER_TYPE;
  handlePresentModalPress?: (order: IOrder) => void;
  showDetails: Record<string, boolean>;
  onToggleDetails: (itemId: string) => void;
}

const didOrderDetailVisibilityChange = (
  prevShowDetails: Record<string, boolean>,
  nextShowDetails: Record<string, boolean>,
  order: IOrder,
) =>
  order.items?.some(
    (item) => prevShowDetails[item._id] !== nextShowDetails[item._id],
  ) ?? false;

const Order = ({
  order,
  tab,
  handlePresentModalPress,
  showDetails = {},
  onToggleDetails,
}: IOrderProps) => {
  const { appTheme, currentTheme } = useApptheme();
  const { silenceRing } = useSoundContext();
  const configuration = useContext(ConfigurationContext);
  const { t } = useTranslation();
  const { cancelOrder, loading: loadingCancelOrder } = useCancelOrder();
  const { pickedUp, loading: loadingPicked } = useOrderPickedUp();
  const { isSingleVendor } = useStoreMode();
  const statusPalette = getStatusPalette(tab, currentTheme === "dark");

  // Keep this order's status live in real time. The subscription result is
  // written into the normalized cache (keyed by _id), so orderStatus/isPickedUp
  // update here without waiting for a refetch or the 60s poll.
  useSubscription(
    isSingleVendor ? SUBSCRIPTION_ORDER : SUBSCRIPTION_ORDER_MULTI_VENDOR,
    {
      variables: { id: order?._id },
      skip: !order?._id,
    },
  );

  // Ref
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // States
  const [isAcceptButtonVisible, setIsAcceptButtonVisible] = useState(
    getIsAcceptButtonVisible(order?.orderDate ?? ""),
  );

  // Timer
  const timeNow = new Date();
  const acceptanceTime = Math.floor(
    ((order ? new Date(order.orderDate).getTime() : 0) - timeNow.getTime()) /
      1000,
  );
  let remainingTime = Math.floor(
    ((order ? new Date(order.createdAt).getTime() : 0) +
      MAX_TIME * 1000 -
      timeNow.getTime()) /
      1000,
  );

  // Preparation Time
  const prep = parseTimestamp(order.preparationTime);
  const diffTime = prep ? prep.getTime() - timeNow.getTime() : 0;
  const totalPrep = diffTime > 0 ? diffTime / 1000 : 0;
  const etaWindowStart = formatTimestampTime(order.eta?.windowStartAt);
  const etaWindowEnd = formatTimestampTime(order.eta?.windowEndAt);
  const etaWindow =
    etaWindowStart && etaWindowEnd ? `${etaWindowStart}–${etaWindowEnd}` : null;

  const decision = !isAcceptButtonVisible
    ? acceptanceTime
    : remainingTime > 0
      ? remainingTime
      : 0;

  if (decision === acceptanceTime) {
    remainingTime = 0;
  }

  // Handlers
  const onCancelOrderHandler = async () => {
    await silenceRing();
    await cancelOrder(order._id, "not available");
  };

  const onPickupOrder = () => {
    pickedUp(order._id);
  };

  // Use Effects
  useEffect(() => {
    if (!order) return;

    let isSubscribed = true;
    (() => {
      timer.current = setInterval(() => {
        const isAcceptButtonVisible = getIsAcceptButtonVisible(order.orderDate);
        if (isSubscribed) {
          setIsAcceptButtonVisible(isAcceptButtonVisible);
        }
        if (isAcceptButtonVisible) {
          if (timer.current) clearInterval(timer.current);
        }
      }, 10000);
    })();
    return () => {
      if (timer.current) clearInterval(timer.current);
      isSubscribed = false;
    };
  }, [order.orderDate]);

  if (!order || !configuration) {
    return null;
  }

  return (
    <View className="w-full">
      <View
        style={[
          styles.card,
          {
            backgroundColor: appTheme.cartContainer,
            borderColor: `${appTheme.fontMainColor}1F`,
          },
        ]}
      >
        {/* Order identity */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1, paddingEnd: 16 }}>
            <Text
              style={{
                color: appTheme.fontSecondColor,
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              {t("Order ID")}
            </Text>
            <Text
              selectable
              style={{
                color: appTheme.fontMainColor,
                fontSize: 20,
                fontVariant: ["tabular-nums"],
                fontWeight: "700",
                marginTop: 2,
              }}
            >
              #{order?.orderId}
            </Text>
          </View>
          <View
            accessibilityLabel={`${t("Status")}: ${t(order?.orderStatus ?? "")}`}
            style={[
              styles.statusBadge,
              { backgroundColor: statusPalette.backgroundColor },
            ]}
          >
            <Text
              style={{
                color: statusPalette.color,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {t(order?.orderStatus ?? "")}
            </Text>
          </View>
        </View>

        {order.orderStatus === "PENDING" && <NewOrderOverview order={order} />}

        <InstructionCard instructions={order.instructions} />

        {/* Order Items */}
        <View style={styles.sectionHeader}>
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 0.7,
            }}
          >
            {t("ORDER")}
          </Text>
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 12,
              fontWeight: "700",
              letterSpacing: 0.7,
            }}
          >
            {t("PRICE")}
          </Text>
        </View>

        <View>
          {order?.items
            ?.filter(Boolean)
            .map((item, index, items) => (
              <OrderItem
                key={item._id}
                currencySymbol={configuration?.currencySymbol}
                hasDivider={index < items.length - 1}
                item={item}
                onToggleDetails={onToggleDetails}
                showDetails={Boolean(showDetails[item._id])}
              />
            ))}
        </View>

        {order.orderStatus === "ACCEPTED" &&
          !order.isPickedUp &&
          !order.rider?._id && (
            <View
              style={{
                backgroundColor: appTheme.lowOpacityPrimaryColor,
                borderRadius: 12,
                marginTop: 8,
                padding: 12,
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Ionicons
                  color={appTheme.primary}
                  name="bicycle-outline"
                  size={20}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: appTheme.primary,
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {t("Waiting for Rider")}
                  </Text>
                  <Text
                    style={{
                      color: appTheme.fontMainColor,
                      fontSize: 13,
                      lineHeight: 19,
                      marginTop: 3,
                    }}
                  >
                    {t(
                      "Your order is confirmed. We're waiting for a rider to accept and deliver your order.",
                    )}
                  </Text>
                </View>
              </View>
            </View>
          )}

        {/* Price summary */}
        <View style={styles.amountSection}>
          <AmountRow
            label={t("Sub Total")}
            value={`${configuration?.currencySymbol}${formatAmount(orderSubTotal(order))}`}
          />
          <AmountRow
            label={t("Tip")}
            value={`${configuration?.currencySymbol}${formatAmount(order?.tipping)}`}
          />
          <AmountRow
            label={t("Tax")}
            value={`${configuration?.currencySymbol}${formatAmount(order?.taxationAmount)}`}
          />
          {order?.discountAmount > 0 && (
            <AmountRow
              label={t("discountAmount")}
              value={`${configuration?.currencySymbol}${formatAmount(order?.discountAmount)}`}
            />
          )}
          {!order?.isPickedUp && (
            <AmountRow
              label={t("Delivery Charges")}
              value={`${configuration?.currencySymbol}${formatAmount(order?.deliveryCharges)}`}
            />
          )}
          <AmountRow
            emphasized
            label={t("Total")}
            value={`${configuration?.currencySymbol}${formatAmount(order?.orderAmount)}`}
          />
        </View>

        {/* New Order */}
        {order?.orderStatus === "PENDING" && (
          <View>
            <View style={styles.actionRow}>
              {/* Decline */}
              <TouchableOpacity
                accessibilityRole="button"
                disabled={loadingCancelOrder}
                onPress={() => onCancelOrderHandler()}
                style={[
                  styles.secondaryButton,
                  { borderColor: appTheme.error },
                ]}
              >
                {loadingCancelOrder ? (
                  <SpinnerComponent color={appTheme.error} />
                ) : (
                  <Text
                    style={{
                      color: appTheme.error,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {t("Decline")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Accept */}
              {handlePresentModalPress && (
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => handlePresentModalPress(order)}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: appTheme.primary },
                  ]}
                >
                  <Text
                    style={{
                      color: appTheme.black,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {t("Accept")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {remainingTime > 0 && (
              <View style={styles.autoDeclineRow}>
                <Text
                  style={{
                    color: appTheme.fontSecondColor,
                    fontSize: 13,
                    fontWeight: "500",
                    marginBottom: 2,
                  }}
                >
                  {t("Auto decline in")}
                </Text>
                <CountdownTimer duration={remainingTime} />
              </View>
            )}
          </View>
        )}

        {/* Processing */}
        {["ACCEPTED", "ASSIGNED", "PICKED"].includes(
          order?.orderStatus ?? "",
        ) && (
          <>
            <View
              style={[
                styles.fulfillmentSection,
                { borderColor: `${appTheme.fontMainColor}1F` },
              ]}
            >
              <View
                style={[
                  styles.fulfillmentIcon,
                  { backgroundColor: appTheme.lowOpacityPrimaryColor },
                ]}
              >
                <Ionicons
                  color={appTheme.primary}
                  name="time-outline"
                  size={22}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: appTheme.fontSecondColor,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {t("Time Left")}
                </Text>
                <View style={styles.timerRow}>
                  <CountdownTimer duration={totalPrep} />
                </View>
                {etaWindow && (
                  <Text
                    style={{
                      color: appTheme.fontSecondColor,
                      fontSize: 12,
                      fontWeight: "500",
                      marginTop: 2,
                    }}
                  >
                    {t("Estimated delivery")} {etaWindow}
                  </Text>
                )}
              </View>
            </View>

            {order.orderStatus === "ACCEPTED" && order.isPickedUp && (
              <View style={styles.actionRow}>
                {/* Hand Order to Rider */}
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={loadingPicked}
                  onPress={() => onPickupOrder()}
                  style={[
                    styles.primaryButton,
                    { backgroundColor: appTheme.primary },
                  ]}
                >
                  {loadingPicked ? (
                    <SpinnerComponent color={appTheme.white} />
                  ) : (
                    <Text
                      style={{
                        color: appTheme.black,
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {t("Deliver Order to Customer")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default memo(Order, (prevProps, nextProps) => {
  if (prevProps.tab !== nextProps.tab) return false;
  if (prevProps.order._id !== nextProps.order._id) return false;
  if (prevProps.order.updatedAt !== nextProps.order.updatedAt) return false;
  if (prevProps.order.orderStatus !== nextProps.order.orderStatus) return false;
  if (prevProps.order.isPickedUp !== nextProps.order.isPickedUp) return false;
  if (prevProps.order.rider?._id !== nextProps.order.rider?._id) return false;
  if (prevProps.order.preparationTime !== nextProps.order.preparationTime) {
    return false;
  }
  if (prevProps.handlePresentModalPress !== nextProps.handlePresentModalPress) {
    return false;
  }
  if (prevProps.onToggleDetails !== nextProps.onToggleDetails) return false;
  if (
    didOrderDetailVisibilityChange(
      prevProps.showDetails,
      nextProps.showDetails,
      nextProps.order,
    )
  ) {
    return false;
  }

  return true;
});
