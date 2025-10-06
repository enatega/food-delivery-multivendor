import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import { MAX_TIME } from "@/lib/utils/constants";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { orderSubTotal } from "@/lib/utils/methods";
import { getIsAcceptButtonVisible } from "@/lib/utils/methods/gloabl";
import { ORDER_TYPE } from "@/lib/utils/types";
import moment from "moment";
import { useContext, useEffect, useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CountdownTimer from "../custom-timer";
import SpinnerComponent from "../spinner";
import { TimeLeftIcon } from "../svg";

// Hooks
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

const Order = ({
  order,
  tab,
  handlePresentModalPress,
  showDetails = {},
  onToggleDetails,
}: IOrderProps) => {
  if (!order) {
    return null; // Return early if order is not available
  }

  // Hooks can be called safely now
  const { appTheme } = useApptheme();
  const configuration = useContext(ConfigurationContext);
  const { t } = useTranslation();

  if (!configuration) {
    return null; // Configuration context is not available yet
  }
  const { cancelOrder, loading: loadingCancelOrder } = useCancelOrder();
  const { pickedUp, loading: loadingPicked } = useOrderPickedUp();

  // Ref
  const timer = useRef<NodeJS.Timeout>();

  // States
  const [isAcceptButtonVisible, setIsAcceptButtonVisible] = useState(
    getIsAcceptButtonVisible(order?.orderDate),
  );


  // Timer
  const timeNow = new Date();
  const date = new Date(order.orderDate);
  const acceptanceTime = moment(date).diff(timeNow, "seconds");
  const createdTime = new Date(order?.createdAt);
  let remainingTime = moment(createdTime)
    .add(MAX_TIME, "seconds")
    .diff(timeNow, "seconds");

  // Preparation Time
  const prep = new Date(order.preparationTime ?? "2023-08-16T08:00:00.000Z");
  const diffTime = prep.getTime() - timeNow.getTime();
  const totalPrep = diffTime > 0 ? diffTime / 1000 : 0;

  const decision = !isAcceptButtonVisible
    ? acceptanceTime
    : remainingTime > 0
      ? remainingTime
      : 0;

  if (decision === acceptanceTime) {
    remainingTime = 0;
  }

  // Handlers
  const onCancelOrderHandler = () => {
    cancelOrder(order._id, "not available");
  };

  const onPickupOrder = () => {
    pickedUp(order._id);
  };

  // Use Effects
  useEffect(() => {
    let isSubscribed = true;
    (() => {
      timer.current = setInterval(() => {
        const isAcceptButtonVisible = !moment().isBefore(order?.orderDate);
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
  }, []);

  return (
    <View className="w-full">
      <View
        className="flex-1 gap-y-2 rounded-[8px] m-4 p-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderWidth: 1,
          borderColor: appTheme.borderLineColor,
        }}
      >
        {/* Status */}
        <View className="flex-1 flex-row justify-between items-center">
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
        <View className="flex-1 flex-row justify-between items-center">
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

        {/* Order Items */}
        <View className="flex-1 flex-row justify-between items-center">
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
                className="flex-1 flex-row justify-between items-start mb-6"
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
                      <Text
                        style={{
                          color: appTheme.fontSecondColor,
                          fontSize: 12,
                        }}
                      >
                        {item?.specialInstructions}
                      </Text>
                    </View>

                    {/* Toggle and Collapsible Details */}
                    <View className="mt-2">
                      {(variation.title || (item?.addons && item?.addons.length > 0)) && (
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
                            {showDetails[item._id] ? "Hide Details" : "Show Details"}
                          </Text>
                          <View className="ml-1">
                            <Text style={{ color: appTheme.primary, fontSize: 10 }}>
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
                                  {`${configuration?.currencySymbol}${variation.price}`}
                                </Text>
                              </View>
                            </View>
                          )}

                          {item?.addons?.map((addon) => (
                            <View key={addon._id} className="mb-1">
                              {addon?.options?.map((option) => (
                                <View key={option._id} className="flex-row items-center">
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
                                    {`(+${configuration?.currencySymbol}${option?.price})`}
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
                  <Text style={{ color: appTheme.fontMainColor, fontWeight: "600" }}>
                    {`${configuration?.currencySymbol}${itemTotal.toFixed(2)}`}
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
            {orderSubTotal(order)}
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
            {order?.tipping}
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
            {order?.taxationAmount}
          </Text>
        </View>

        {/* Delivery */}
        {!order?.isPickedUp && <View className="flex-row justify-between">
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
            {order?.deliveryCharges}
          </Text>
        </View>}

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
            {order?.orderAmount}
          </Text>
        </View>

        {/* Order Instructions */}
        {order?.instructions && (
          <View
            className="rounded-[4px] p-2"
            style={{ backgroundColor: appTheme.lowOpacityPrimaryColor }}
          >
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {t("Comment")}
            </Text>
            <Text
              style={{
                color: appTheme.fontMainColor,
                fontSize: 18,
                fontWeight: "600",
                fontStyle: "italic",
              }}
            >
              {order?.instructions}
            </Text>
          </View>
        )}

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

export default Order;
