import { memo, useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Components
import { IconSymbol } from "@/lib/ui/useable-components/IconSymbol";
// Interface
import { IOrderComponentProps } from "@/lib/utils/interfaces/interface";

// Contexrtg
// Hook
import useOrder from "@/lib/hooks/useOrder";

// Cion
import { BikeRidingIcon, ChatIcon, ClockIcon } from "../svg";

// Hooks
import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { calculateDistance } from "@/lib/utils/methods/custom-functions";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import SpinnerComponent from "../spinner";

const Order = ({
  orderId,
  _id,
  orderStatus,
  restaurant,
  deliveryAddress,
  paymentMethod,
  orderAmount,
  paymentStatus,
  acceptedAt,
  user,
  tab,
}: IOrderComponentProps) => {
  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const { time, mutateAssignOrder, loadingAssignOrder } = useOrder({
    _id,
    acceptedAt,
  } as IOrder);
  const configuration = useContext(ConfigurationContext);
  const router = useRouter();



  if (
    !orderId ||
    !_id ||
    !orderStatus ||
    !restaurant ||
    !deliveryAddress ||
    !paymentMethod ||
    !orderAmount ||
    !paymentStatus ||
    !acceptedAt
  ) {
    return null;
  } else
    return (
      <View
        className="m-auto"
        style={{
          minWidth: "50%",
          minHeight: ["PICKED"].includes(orderStatus) ? "6.8%" : "6%",
          height: "auto",
        }}
        key={orderId}
      >
        {orderStatus === "ACCEPTED" || orderStatus === "PICKED" ? (
          <View />
        ) : null}
        {!!orderId &&
          !!_id &&
          !!orderStatus &&
          !!restaurant &&
          !!deliveryAddress &&
          !!paymentMethod &&
          !!orderAmount &&
          !!paymentStatus &&
          !!acceptedAt && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/order-detail",
                  params: {
                    itemId: _id,
                    order: JSON.stringify({
                      _id,
                      orderStatus,
                      restaurant,
                      deliveryAddress,
                      paymentMethod,
                      orderAmount,
                      paymentStatus,
                      acceptedAt,
                      user,
                    }),
                    tab,
                  },
                });
              }}
            >
              <View
                className="flex-1 gap-y-4  border border-1 rounded-[8px] m-4 p-2"
                style={{
                  backgroundColor: appTheme.themeBackground,
                  borderColor: appTheme.borderLineColor,
                }}
              >
                <View className="flex flex-col gap-y-2">
                  {/* Status */}
                  {orderStatus && (
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text
                        className="font-[Inter] text-base font-bold  text-left decoration-skip-ink-0 "
                        style={{ color: appTheme.fontSecondColor }}
                      >
                        {t("Status")}
                      </Text>
                      <View
                        className={`px-3 py-1 border border-1 rounded-[12px]`}
                        style={{
                          backgroundColor:
                            tab === "delivered"
                              ? "cyan"
                              : tab === "processing"
                                ? "lightyellow"
                                : "lightgreen",
                          borderColor:
                            tab === "delivered"
                              ? "blue"
                              : tab === "processing"
                                ? "orange"
                                : "green0",
                        }}
                      >
                        <Text
                          className={`font-[Inter] text-[12px] font-semibold text-center decoration-skip-ink-0`}
                          style={{
                            color:
                              tab === "delivered"
                                ? "blue"
                                : tab === "processing"
                                  ? "orange"
                                  : "green",
                          }}
                        >
                          {orderStatus}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Order ID */}
                  {orderId && (
                    <View className="flex-1 flex-row justify-between items-center">
                      <Text
                        className="font-[Inter] text-base font-bold  text-left decoration-skip-ink-0 "
                        style={{ color: appTheme.fontSecondColor }}
                      >
                        {t("Order ID")}
                      </Text>
                      <Text
                        className="font-[Inter] text-[16px] text-base font-semibold  text-right underline-offset-auto decoration-skip-ink "
                        style={{ color: appTheme.fontMainColor }}
                      >
                        #{orderId}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Store Image and Name */}
                <View className="w-[90%] flex-row justify-start items-center gap-x-4">
                  {/* <View className="h-8 w-8 bg-gray-400 justify-center items-center"> */}
                  {/* <View className="w-[60px] h-[70px] bg-gray-200 rounded-[8px]"> */}
                  <Image
                    src={restaurant?.image}
                    style={{ width: 32, height: 30, borderRadius: 8 }}
                  />
                  {/* </View> */}
                  {/* </View> */}
                  <Text
                    className="font-[Inter] text-lg font-bold leading-7 text-left underline-offset-auto decoration-skip-ink "
                    style={{ color: appTheme.fontMainColor }}
                  >
                    {restaurant?.name}
                  </Text>
                </View>

                {/* Pick Up Order */}
                <View className="w-[90%] flex-row items-center gap-x-2">
                  <View>
                    <IconSymbol
                      name="apartment"
                      size={30}
                      weight="medium"
                      color={appTheme.fontMainColor}
                    />
                  </View>
                  <View>
                    <Text
                      className="font-[Inter] text-base font-semibold leading-6 text-left underline-offset-auto decoration-skip-ink "
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {t("Pickup Order")}
                    </Text>
                    <Text
                      className="font-[Inter] text-base font-bold leading-6 text-left underline-offset-auto decoration-skip-ink "
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {(String(restaurant.address).length > 40
                        ? String(restaurant.address)
                            .substring(0, 40)
                            .concat("...")
                        : String(restaurant.address)) ?? "-"}
                    </Text>
                  </View>
                </View>

                {/* Delivery Order */}
                <View className="w-[90%] flex-row items-center gap-x-2">
                  <View>
                    <IconSymbol
                      name="home"
                      size={30}
                      weight="medium"
                      color={appTheme.fontMainColor}
                    />
                  </View>
                  <View>
                    <Text
                      className="font-[Inter] text-base font-semibold leading-6 text-left underline-offset-auto decoration-skip-ink "
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {t("Delivery Order")}
                    </Text>
                    <Text
                      className="font-[Inter] text-base font-bold leading-6 text-left underline-offset-auto decoration-skip-ink "
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {(String(deliveryAddress?.deliveryAddress).length > 40
                        ? String(deliveryAddress?.deliveryAddress)
                            .substring(0, 40)
                            .concat("...")
                        : String(deliveryAddress?.deliveryAddress)) ?? "-"}
                    </Text>
                  </View>
                </View>

                {/* Price/Time/Distance */}
                <View className="w-[99%] flex-row justify-between items-center">
                  {time && (
                    <View className="flex-1 flex-row justify-start  items-center gap-x-1">
                      <ClockIcon color="#6b7280" />
                      <Text
                        className="font-[Inter] text-base font-medium  text-left underline-offset-auto decoration-skip-ink "
                        style={{ color: appTheme.fontMainColor }}
                      >
                        {time}
                      </Text>
                    </View>
                  )}

                  <View className="flex-1 flex-row justify-end items-center gap-x-1">
                    <BikeRidingIcon color="#6b7280" />
                    <Text
                      className="font-[Inter] text-base font-medium "
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {calculateDistance(
                        Number(restaurant?.location?.coordinates[0]),
                        Number(restaurant?.location?.coordinates[1]),
                        deliveryAddress?.location?.coordinates[0],
                        deliveryAddress?.location?.coordinates[1]
                      )
                        .toFixed(2)
                        .toLocaleString()}
                      km
                    </Text>
                  </View>
                </View>

                {/* Payment Method */}
                <View className="w-[99%] flex-row justify-between items-center">
                  <Text
                    className="flex-1 font-[Inter] text-[16px] text-base font-[500] "
                    style={{ color: appTheme.fontSecondColor }}
                  >
                    {t("Payment Method")}
                  </Text>
                  <Text
                    className="flex-1 font-[Inter] text-base font-semibold text-right underline-offset-auto decoration-skip-ink "
                    style={{ color: appTheme.fontMainColor }}
                  >
                    {paymentMethod}
                  </Text>
                </View>

                {/* Order Amount */}
                <View className="w-[99%] flex-row justify-between">
                  <Text
                    className="flex-1 font-[Inter] text-[16px] text-base font-[500] "
                    style={{ color: appTheme.fontSecondColor }}
                  >
                    {t("Order Amount")}
                  </Text>

                  <Text
                    className="flex-1 font-[Inter] font-semibold text-right "
                    style={{ color: appTheme.fontMainColor }}
                  >
                    {configuration?.currencySymbol}
                    {orderAmount}
                    {paymentStatus === "PAID" ? t("Paid") : t("(Not paid yet)")}
                  </Text>
                </View>

                {["PICKED"].includes(orderStatus) && (
                  <View className="flex-row items-center gap-x-2">
                    <TouchableOpacity
                      onPress={() => {
                        router.push({
                          pathname: "/chat",
                          params: {
                            phoneNumber: user.phone,
                            orderId: orderId,
                            id: _id,
                          },
                        });
                      }}
                    >
                      <View className="border border-[#E2E8F0] rounded-full p-3">
                        <ChatIcon
                          width={30}
                          height={30}
                          color={appTheme.fontMainColor}
                        />
                      </View>
                    </TouchableOpacity>
                    {/* Order Comment */}
                    <View className="flex-1">
                      <Text
                        className="font-[Inter] text-[16px] text-base font-[500] "
                        style={{ color: appTheme.fontSecondColor }}
                      >
                        {t("Order Comment")}
                      </Text>
                      <Text
                        className="font-[Inter] text-[16px] italic font-medium "
                        style={{ color: appTheme.fontMainColor }}
                      >
                        {t("No Comment")}
                      </Text>
                    </View>
                  </View>
                )}
                {tab === "new_orders" && (
                  // <CustomContinueButton
                  //   title={t("Assign me")}
                  //   className="w-[95%] mx-auto"
                  //   onPress={() =>
                  //     mutateAssignOrder({
                  //       variables: { id: _id },
                  //     })
                  //   }
                  // />
                  <TouchableOpacity
                    className="h-14 rounded-3xl py-3 mt-10 w-full"
                    disabled={loadingAssignOrder}
                    style={{ backgroundColor: appTheme.primary }}
                    onPress={() =>
                      mutateAssignOrder({
                        variables: { id: _id },
                      })
                    }
                  >
                    {loadingAssignOrder ? (
                      <SpinnerComponent />
                    ) : (
                      <Text
                        className="text-center text-lg font-medium"
                        style={{ color: appTheme.black }}
                      >
                        {t("Assign me")}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
      </View>
    );
};

export default memo(Order);
