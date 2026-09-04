import { useSubscription } from "@apollo/client";
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
import { Image, Text, TouchableOpacity, View } from "react-native";
import CountdownTimer from "../custom-timer";
import SpinnerComponent from "../spinner";
import { TimeLeftIcon } from "../svg";
import NewOrderOverview from "./new-order-overview";

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

const InstructionCard = ({
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
        backgroundColor: appTheme.lowOpacityPrimaryColor,
        borderColor: appTheme.primary,
        borderStartWidth: 3,
        borderRadius: 8,
        marginTop: compact ? 6 : 8,
        padding: compact ? 8 : 12,
      }}
    >
      <Text
        style={{
          color: appTheme.primary,
          fontSize: compact ? 12 : 14,
          fontWeight: "600",
        }}
      >
        {t("Special Instructions")}
      </Text>
      <Text
        style={{
          color: appTheme.fontMainColor,
          fontSize: compact ? 12 : 14,
          lineHeight: compact ? 17 : 20,
          marginTop: 3,
        }}
      >
        {content}
      </Text>
    </View>
  );
};

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
  const { appTheme } = useApptheme();
  const { silenceRing } = useSoundContext();
  const configuration = useContext(ConfigurationContext);
  const { t } = useTranslation();
  const { cancelOrder, loading: loadingCancelOrder } = useCancelOrder();
  const { pickedUp, loading: loadingPicked } = useOrderPickedUp();
  const { isSingleVendor } = useStoreMode();

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
    etaWindowStart && etaWindowEnd
      ? `${etaWindowStart}–${etaWindowEnd}`
      : null;

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
        className="gap-y-2 rounded-[8px] m-4 p-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        {/* Status */}
        <View className="flex-row justify-between items-center">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {t("Status")}
          </Text>
          <View
            className={`ps-3 pe-3 bg-green-100 border border-1 rounded-[12px] ${
              tab === "delivered"
                ? "border-blue-500 bg-blue-100"
                : tab === "processing"
                  ? "border-yellow-500 bg-yellow-100"
                  : "border-green-500 bg-green-100"
            }`}
          >
            <Text
              style={{
                color:
                  tab === "delivered"
                    ? "navy"
                    : tab === "processing"
                      ? "#92400E"
                      : "#166534",
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {t(order?.orderStatus ?? "")}
            </Text>
          </View>
        </View>

        {/* Order ID */}
        <View className="flex-row justify-between items-center">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {t("Order ID")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 16,
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            #{order?.orderId}
          </Text>
        </View>

        {order.orderStatus === "PENDING" && (
          <NewOrderOverview order={order} />
        )}

        <InstructionCard instructions={order.instructions} />

        {/* Order Items */}
        <View className="flex-row justify-between items-center">
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {t("ORDER")}
          </Text>
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {t("PRICE")}
          </Text>
        </View>

        <View>
          {order?.items?.filter(Boolean).map((item) => {
            // Ensure variation is an object, default to empty if undefined.
            const variation = item.variation || {};
            const itemPrice = variation.price ?? 0;
            const itemTotal = itemPrice * (item.quantity ?? 1);

            return (
              <View
                key={item._id}
                className="flex-row justify-between items-start mb-6"
              >
                {/* Left Side: Image and Details */}
                <View className="flex-row gap-x-2 flex-1">
                  {/* Image */}
                  <View
                    className="w-[60px] h-[70px] rounded-[8px] overflow-hidden"
                    style={{
                      backgroundColor: appTheme.lowOpacityPrimaryColor,
                    }}
                  >
                    <Image
                      src={item.image}
                      style={{ width: 60, height: 70, borderRadius: 8 }}
                    />
                  </View>

                  {/* Item Details */}
                  <View className="flex-1 justify-between">
                    <View>
                      <Text
                        style={{
                          color: appTheme.fontMainColor,
                          fontSize: 14,
                          fontWeight: "600",
                        }}
                      >
                        {`${item?.quantity}x ${item?.title}`}
                      </Text>
                      <Text
                        style={{
                          color: appTheme.fontSecondColor,
                          fontSize: 12,
                        }}
                      >
                        {item?.description}
                      </Text>
                      <InstructionCard
                        instructions={item?.specialInstructions}
                        compact
                      />
                    </View>

                    {/* Toggle and Collapsible Details */}
                    <View className="mt-2">
                      {(variation.title ||
                        (item?.addons && item?.addons.length > 0)) && (
                        <TouchableOpacity
                          onPress={() => onToggleDetails(item._id)}
                          className="flex-row items-center mb-2"
                        >
                          <Text
                            style={{
                              color: appTheme.primary,
                              fontSize: 12,
                              fontWeight: "500",
                            }}
                          >
                            {showDetails[item._id]
                              ? t("Hide Details")
                              : t("Show Details")}
                          </Text>
                          <View className="ml-1">
                            <Text
                              style={{ color: appTheme.primary, fontSize: 10 }}
                            >
                              {showDetails[item._id] ? "▲" : "▼"}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}

                      {showDetails[item._id] && (
                        <View>
                          {variation.title && (
                            <View className="mb-2">
                              <View className="flex-row items-center">
                                <Text
                                  style={{
                                    color: appTheme.fontSecondColor,
                                    fontSize: 12,
                                    fontWeight: "500",
                                  }}
                                >
                                  {variation.title}
                                </Text>
                                <Text
                                  className="ml-2"
                                  style={{
                                    color: appTheme.fontMainColor,
                                    fontSize: 12,
                                    fontWeight: "600",
                                  }}
                                >
                                  {`${configuration?.currencySymbol}${formatAmount(variation.price)}`}
                                </Text>
                              </View>
                            </View>
                          )}

                          {item?.addons?.map((addon) => (
                            <View key={addon._id} className="mb-1">
                              {addon?.options?.map((option) => (
                                <View
                                  key={option._id}
                                  className="flex-row items-center"
                                >
                                  <Text
                                    style={{
                                      color: appTheme.fontSecondColor,
                                      fontSize: 12,
                                    }}
                                  >
                                    {option.title}
                                  </Text>
                                  <Text
                                    className="ml-2"
                                    style={{
                                      color: appTheme.fontMainColor,
                                      fontSize: 12,
                                    }}
                                  >
                                    {`(+${configuration?.currencySymbol}${formatAmount(option?.price)})`}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Right Side: Price */}
                <View className="w-auto items-end">
                  <Text
                    style={{ color: appTheme.fontMainColor, fontWeight: "600" }}
                  >
                    {`${configuration?.currencySymbol}${formatAmount(itemTotal)}`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Divider */}
        <View
          className="h-0.5 mb-4 mt-4"
          style={{ backgroundColor: appTheme.borderLineColor }}
        />

        {/* Sub Total */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {t("Sub Total")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {formatAmount(orderSubTotal(order))}
          </Text>
        </View>

        {/* Tip */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {t("Tip")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {formatAmount(order?.tipping)}
          </Text>
        </View>

        {/* Tax */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {t("Tax")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {formatAmount(order?.taxationAmount)}
          </Text>
        </View>

        {/* Discount Amount */}
        {order?.discountAmount > 0 && (
          <View className="flex-row justify-between">
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {t("discountAmount")}
            </Text>
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {configuration?.currencySymbol}
              {formatAmount(order?.discountAmount)}
            </Text>
          </View>
        )}

        {/* Delivery */}
        {!order?.isPickedUp && (
          <View className="flex-row justify-between">
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {t("Delivery Charges")}
            </Text>
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {configuration?.currencySymbol}
              {formatAmount(order?.deliveryCharges)}
            </Text>
          </View>
        )}

        {/* Total Amount */}
        <View className="flex-row justify-between">
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {t("Total")}
          </Text>
          <Text
            style={{
              color: appTheme.fontMainColor,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {configuration?.currencySymbol}
            {formatAmount(order?.orderAmount)}
          </Text>
        </View>

        {/* New Order */}
        {order?.orderStatus === "PENDING" && (
          <View>
            <View className="flex-row gap-x-4 w-full mt-10">
              {/* Decline */}
              <TouchableOpacity
                className="flex-1 h-16 items-center justify-center rounded-[30px]"
                style={{ borderWidth: 1, borderColor: "#ef4444" }}
                onPress={() => onCancelOrderHandler()}
              >
                {loadingCancelOrder ? (
                  <SpinnerComponent color="#ef4444" />
                ) : (
                  <Text
                    style={{
                      color: "#ef4444",
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    {t("Decline")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Accept */}
              {handlePresentModalPress && (
                <TouchableOpacity
                  className="flex-1 h-16 items-center justify-center rounded-[30px]"
                  style={{
                    backgroundColor: appTheme.primary,
                    borderWidth: 1,
                    borderColor: appTheme.primary,
                  }}
                  onPress={() => handlePresentModalPress(order)}
                >
                  <Text
                    style={{
                      color: appTheme.white,
                      fontSize: 18,
                      fontWeight: "500",
                    }}
                  >
                    {t("Accept")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {remainingTime > 0 && (
              <View className="items-center mt-4">
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
            <View className="w-full items-center">
              <View className="flex-row items-center justify-center gap-x-2">
                <TimeLeftIcon />
                <View>
                  <Text
                    style={{
                      color: appTheme.fontMainColor,
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    {t("Time Left")}
                  </Text>

                  <CountdownTimer duration={totalPrep} />
                  {etaWindow && (
                    <Text
                      style={{
                        color: appTheme.fontSecondColor,
                        fontSize: 12,
                        marginTop: 2,
                      }}
                    >
                      Estimated delivery {etaWindow}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {order.orderStatus === "ASSIGNED" && (
              <View className="flex-row gap-x-4 w-full mt-10">
                {/* Hand Order to Rider */}
                {/* <TouchableOpacity
                  className="flex-1 h-16 items-center justify-center rounded-[30px]"
                  style={{
                    backgroundColor: appTheme.primary,
                    borderWidth: 1,
                    borderColor: appTheme.primary,
                  }}
                  onPress={() => onPickupOrder()}
                >
                  {loadingPicked ? (
                    <SpinnerComponent color={appTheme.white} />
                  ) : (
                    <Text
                      style={{
                        color: appTheme.white,
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      {t("Hand Order to Rider")}
                    </Text>
                  )}
                </TouchableOpacity> */}
              </View>
            )}
            {order.orderStatus === "ACCEPTED" && order.isPickedUp && (
              <View className="flex-row gap-x-4 w-full mt-10">
                {/* Hand Order to Rider */}
                <TouchableOpacity
                  className="flex-1 h-16 items-center justify-center rounded-[30px]"
                  style={{
                    backgroundColor: appTheme.primary,
                    borderWidth: 1,
                    borderColor: appTheme.primary,
                  }}
                  onPress={() => onPickupOrder()}
                >
                  {loadingPicked ? (
                    <SpinnerComponent color={appTheme.white} />
                  ) : (
                    <Text
                      style={{
                        color: appTheme.white,
                        fontSize: 18,
                        fontWeight: "500",
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
