/* eslint-disable @typescript-eslint/no-require-imports */

import { useApptheme } from "@/lib/context/global/theme.context";
import UserContext from "@/lib/context/global/user.context";
import Order from "@/lib/ui/useable-components/order";
import { WalletIcon } from "@/lib/ui/useable-components/svg";
import { NO_ORDER_PROMPT } from "@/lib/utils/constants";
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { ORDER_TYPE } from "@/lib/utils/types";
import { NetworkStatus } from "@apollo/client";
import { FlashList } from "@shopify/flash-list";
import { ListRenderItem } from "@shopify/flash-list";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";

const { height } = Dimensions.get("window");
// Approximate rendered height (px) of an Order card, used by FlashList for layout estimation
const ORDER_CARD_ESTIMATED_HEIGHT = 430;

function HomeDeliveredOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const {
    dataProfile,
    loadingAssigned,
    errorAssigned,
    assignedOrders,
    refetchAssigned,
    networkStatusAssigned,
  } = useContext(UserContext);

  // States
  const [orders, setOrders] = useState<IOrder[]>([]);

  // Handlers
  const onInitOrders = () => {
    if (loadingAssigned || errorAssigned) return;
    if (!assignedOrders) return;

    const _orders = assignedOrders?.filter((o: IOrder) => {
      const isDelivered = ["DELIVERED", "CANCELLED"].includes(o.orderStatus);
      const isCurrentRider = o.rider?._id === dataProfile?._id;
      return isDelivered && isCurrentRider;
    });

    setOrders(_orders ?? []);
  };

  // Use Effect
  useEffect(() => {
    onInitOrders();
  }, [assignedOrders, route.key]);

  const keyExtractor = useCallback((item: IOrder) => item._id, []);

  const renderItem = useCallback<ListRenderItem<IOrder>>(
    ({ item }) => (
      <Order
        tab={route.key as ORDER_TYPE}
        _id={item._id}
        orderId={item.orderId}
        orderStatus={item.orderStatus}
        restaurant={item.restaurant}
        deliveryAddress={item.deliveryAddress}
        paymentMethod={item.paymentMethod}
        orderAmount={item.orderAmount}
        paymentStatus={item.paymentStatus}
        acceptedAt={item.acceptedAt}
        user={item.user}
      />
    ),
    [route.key],
  );

  const renderListEmptyComponent = useCallback(
    () => (
      <View
        style={{
          minHeight:
            height > 670 ? height - height * 0.5 : height - height * 0.6,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WalletIcon
          height={100}
          width={100}
          color={appTheme.fontMainColor}
        />
        {orders?.length === 0 ? (
          <Text
            className="font-[Inter] text-[18px] text-base font-[500]"
            style={{ color: appTheme.fontSecondColor }}
          >
            {t(NO_ORDER_PROMPT[route.key])}
          </Text>
        ) : (
          <Text style={{ color: appTheme.fontSecondColor }}>
            {t("Pull down to refresh")}
          </Text>
        )}
      </View>
    ),
    [appTheme.fontMainColor, appTheme.fontSecondColor, orders?.length, route.key, t],
  );

  // Calculate the marginBottom dynamically
  // const marginBottom = Platform.OS === "ios" ? height * 0.0 : height * 0.01;
  // Render
  return (
    <View
      className="pt-14 flex-1 pb-16"
      style={[style.container, { backgroundColor: appTheme.screenBackground }]}
    >
      {orders?.length > 0 ? (
        <FlashList
          data={orders}
          estimatedItemSize={ORDER_CARD_ESTIMATED_HEIGHT}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          refreshing={networkStatusAssigned === NetworkStatus.loading}
          onRefresh={refetchAssigned}
          renderItem={renderItem}
          ListFooterComponent={<View style={{ height: 200 }} />}
          ListEmptyComponent={renderListEmptyComponent}
        />
      ) : (
        <View
          style={{
            minHeight:
              height > 670 ? height - height * 0.5 : height - height * 0.6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <WalletIcon height={100} width={100} color={appTheme.fontMainColor} />

          {orders?.length === 0 ? (
            <Text
              className="font-[Inter] text-[18px] text-base font-[500]"
              style={{ color: appTheme.fontSecondColor }}
            >
              {t(NO_ORDER_PROMPT[route.key])}
            </Text>
          ) : (
            <Text>{t("Pull down to refresh")}</Text>
          )}
        </View>
      )}
    </View>
  );
}

export default HomeDeliveredOrdersMain;

const style = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === "android" ? 50 : 80,
  },
});
