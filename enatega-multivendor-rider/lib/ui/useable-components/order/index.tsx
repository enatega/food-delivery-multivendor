import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { memo, useContext } from "react";
import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { ConfigurationContext } from "@/lib/context/global/configuration.context";
import {
  useChatNotifications,
  useUnreadChat,
} from "@/lib/context/global/chat-notification.context";
import { useLocationContext } from "@/lib/context/global/location.context";
import { useApptheme } from "@/lib/context/global/theme.context";
import useOrder from "@/lib/hooks/useOrder";
import {
  IOrder,
  IOrderComponentProps,
} from "@/lib/utils/interfaces/order.interface";
import { calculateDistance } from "@/lib/utils/methods/custom-functions";
import { formatTimestampTime } from "@/lib/utils/methods/date-time";
import SpinnerComponent from "../spinner";
import {
  Metric,
  OrderHeader,
  PaymentSummary,
  RestaurantIdentity,
  RouteStop,
  styles,
} from "./order-card-presentation";

const AVERAGE_SPEED_KMH = 25;

const OrderChatButton = memo(
  ({
    _id,
    orderId,
    phone,
  }: {
    _id: string;
    orderId: string;
    phone: string;
  }) => {
    const { t } = useTranslation();
    const { appTheme } = useApptheme();
    const router = useRouter();
    const { markChatRead } = useChatNotifications();
    const unreadChat = useUnreadChat(_id);

    const openChat = () => {
      markChatRead(_id);
      router.push({
        pathname: "/chat",
        params: { phoneNumber: phone, orderId, id: _id },
      });
    };

    return (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={openChat}
        style={[
          styles.chatButton,
          { borderColor: `${appTheme.fontMainColor}1F` },
        ]}
      >
        <View
          style={[
            styles.chatIcon,
            { backgroundColor: appTheme.lowOpacityPrimaryColor },
          ]}
        >
          <Ionicons
            color={appTheme.primary}
            name="chatbubble-ellipses-outline"
            size={20}
          />
          {!!unreadChat?.count && (
            <View
              style={{
                alignItems: "center",
                backgroundColor: appTheme.orderUncomplete,
                borderColor: appTheme.cartContainer,
                borderRadius: 10,
                borderWidth: 1.5,
                end: -5,
                height: 20,
                justifyContent: "center",
                minWidth: 20,
                paddingHorizontal: 5,
                position: "absolute",
                top: -5,
              }}
            >
              <Text
                style={{
                  color: appTheme.white,
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {unreadChat.count > 99 ? "99+" : unreadChat.count}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: appTheme.fontSecondColor,
              fontSize: 12,
              fontWeight: "500",
            }}
          >
            {unreadChat?.count ? t("New message") : t("Chat with Customer")}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: appTheme.fontMainColor,
              fontSize: 14,
              fontWeight: "600",
              marginTop: 2,
            }}
          >
            {unreadChat?.preview || t("Start Chat")}
          </Text>
        </View>
        <FontAwesome6
          color={appTheme.fontSecondColor}
          name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
          size={12}
        />
      </TouchableOpacity>
    );
  },
);

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
  eta,
  tab,
}: IOrderComponentProps) => {
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const { mutateAssignOrder, loadingAssignOrder } = useOrder({
    _id,
    acceptedAt,
  } as IOrder);
  const configuration = useContext(ConfigurationContext);
  const router = useRouter();
  const { location: riderLocation } = useLocationContext();

  const riderLat = Number(riderLocation?.latitude);
  const riderLng = Number(riderLocation?.longitude);
  const customerLng = Number(deliveryAddress?.location?.coordinates?.[0]);
  const customerLat = Number(deliveryAddress?.location?.coordinates?.[1]);
  const restaurantLng = Number(restaurant?.location?.coordinates?.[0]);
  const restaurantLat = Number(restaurant?.location?.coordinates?.[1]);

  const hasRiderLocation =
    Number.isFinite(riderLat) &&
    Number.isFinite(riderLng) &&
    (riderLat !== 0 || riderLng !== 0);
  const hasCustomerLocation =
    Number.isFinite(customerLat) && Number.isFinite(customerLng);
  const hasRestaurantLocation =
    Number.isFinite(restaurantLat) && Number.isFinite(restaurantLng);

  let distanceKm: number | null = null;
  if (hasRiderLocation && hasCustomerLocation) {
    distanceKm = calculateDistance(
      riderLat,
      riderLng,
      customerLat,
      customerLng,
    );
  } else if (hasRestaurantLocation && hasCustomerLocation) {
    distanceKm = calculateDistance(
      restaurantLat,
      restaurantLng,
      customerLat,
      customerLng,
    );
  }

  const distanceLabel =
    distanceKm !== null ? `${distanceKm.toFixed(2)} km` : "—";
  const etaMinutes =
    distanceKm !== null
      ? Math.max(1, Math.round((distanceKm / AVERAGE_SPEED_KMH) * 60))
      : null;
  const backendEtaWindowStart = formatTimestampTime(eta?.windowStartAt);
  const backendEtaWindowEnd = formatTimestampTime(eta?.windowEndAt);
  const backendEtaWindow =
    backendEtaWindowStart && backendEtaWindowEnd
      ? `${backendEtaWindowStart}–${backendEtaWindowEnd}`
      : null;
  const deliveryTimeLabel =
    backendEtaWindow ?? (etaMinutes !== null ? `${etaMinutes} mins` : "—");

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
  }

  const openOrderDetails = () => {
    router.push({
      pathname: "/order-detail",
      params: { itemId: _id, tab },
    });
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: appTheme.cartContainer,
          borderColor: `${appTheme.fontMainColor}1F`,
        },
      ]}
    >
      <TouchableOpacity
        accessibilityHint={t("Opens order details")}
        accessibilityRole="button"
        activeOpacity={0.82}
        onPress={openOrderDetails}
      >
        <OrderHeader orderId={orderId} orderStatus={orderStatus} tab={tab} />

        <RestaurantIdentity image={restaurant.image} name={restaurant.name} />

        <View style={styles.routeSection}>
          <RouteStop
            address={restaurant.address}
            label={t("Pickup Address")}
            type="pickup"
          />
          <RouteStop
            address={deliveryAddress.deliveryAddress}
            isLast
            label={t("Delivery Address")}
            type="delivery"
          />
        </View>

        <View
          style={[
            styles.metricsRow,
            { backgroundColor: appTheme.lowOpacityPrimaryColor },
          ]}
        >
          <Metric icon="time-outline" value={deliveryTimeLabel} />
          <View
            style={{
              backgroundColor: `${appTheme.fontMainColor}1F`,
              width: 1,
            }}
          />
          <Metric icon="bicycle-outline" value={distanceLabel} />
        </View>

        <PaymentSummary
          amount={orderAmount}
          currencySymbol={configuration?.currencySymbol}
          paymentMethod={paymentMethod}
          paymentStatus={paymentStatus}
        />

        <View style={styles.detailAffordance}>
          <Text
            style={{
              color: appTheme.primary,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            {t("View order details")}
          </Text>
          <FontAwesome6
            color={appTheme.primary}
            name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
            size={12}
          />
        </View>
      </TouchableOpacity>

      {orderStatus === "PICKED" && (
        <OrderChatButton _id={_id} orderId={orderId} phone={user.phone} />
      )}

      {tab === "new_orders" && (
        <TouchableOpacity
          accessibilityRole="button"
          disabled={loadingAssignOrder}
          onPress={() => mutateAssignOrder({ variables: { id: _id } })}
          style={[styles.assignButton, { backgroundColor: appTheme.primary }]}
        >
          {loadingAssignOrder ? (
            <SpinnerComponent />
          ) : (
            <Text
              style={{
                color: appTheme.black,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {t("Assign me")}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const areOrderPropsEqual = (
  prevProps: IOrderComponentProps,
  nextProps: IOrderComponentProps,
) => {
  const sameRestaurantLocation =
    prevProps.restaurant?.location?.coordinates?.[0] ===
      nextProps.restaurant?.location?.coordinates?.[0] &&
    prevProps.restaurant?.location?.coordinates?.[1] ===
      nextProps.restaurant?.location?.coordinates?.[1];

  const sameDeliveryLocation =
    prevProps.deliveryAddress?.location?.coordinates?.[0] ===
      nextProps.deliveryAddress?.location?.coordinates?.[0] &&
    prevProps.deliveryAddress?.location?.coordinates?.[1] ===
      nextProps.deliveryAddress?.location?.coordinates?.[1];

  return (
    prevProps.tab === nextProps.tab &&
    prevProps._id === nextProps._id &&
    prevProps.orderId === nextProps.orderId &&
    prevProps.orderStatus === nextProps.orderStatus &&
    prevProps.paymentMethod === nextProps.paymentMethod &&
    prevProps.orderAmount === nextProps.orderAmount &&
    prevProps.paymentStatus === nextProps.paymentStatus &&
    prevProps.acceptedAt === nextProps.acceptedAt &&
    prevProps.restaurant?.name === nextProps.restaurant?.name &&
    prevProps.restaurant?.address === nextProps.restaurant?.address &&
    prevProps.restaurant?.image === nextProps.restaurant?.image &&
    prevProps.restaurant?.deliveryTime === nextProps.restaurant?.deliveryTime &&
    sameRestaurantLocation &&
    prevProps.deliveryAddress?.deliveryAddress ===
      nextProps.deliveryAddress?.deliveryAddress &&
    sameDeliveryLocation &&
    prevProps.user?._id === nextProps.user?._id &&
    prevProps.user?.name === nextProps.user?.name &&
    prevProps.user?.phone === nextProps.user?.phone
  );
};

export default memo(Order, areOrderPropsEqual);
