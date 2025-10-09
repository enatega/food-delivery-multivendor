/* eslint-disable @typescript-eslint/no-require-imports */
// Core
import { useContext, useEffect, useState } from "react";

import { NetworkStatus } from "@apollo/client";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";

// Components
import Order from "@/lib/ui/useable-components/order";
import { WalletIcon } from "@/lib/ui/useable-components/svg";
// Context
import UserContext from "@/lib/context/global/user.context";
// Constants
import { NO_ORDER_PROMPT } from "@/lib/utils/constants";
// Interface
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
// Types
import { useApptheme } from "@/lib/context/global/theme.context";
import { ORDER_TYPE } from "@/lib/utils/types";
import { FlashList } from "@shopify/flash-list";
import { useTranslation } from "react-i18next";

const { height } = Dimensions.get("window");

function HomeProcessingOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const {
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


    const _orders = assignedOrders?.filter(
      (o: IOrder) =>
        ["PICKED", "ASSIGNED"].includes(o.orderStatus) && !o.isPickedUp,
    );

    setOrders(_orders ?? []);
  };

  // Use Effect
  useEffect(() => {
    onInitOrders();
  }, [assignedOrders, route.key]);

  useEffect(() => {
    // Trigger refetch when orders length changes
    if (orders?.length === 0) {
      refetchAssigned();
    }
  }, [orders?.length]);
  // Calculate the marginBottom dynamically
  // const marginBottom = Platform.OS === "ios" ? height * 0.5 : height * 0.01;
  // Render

    // console.log({assignedOrders: JSON.stringify(orders, null, 2)});


  return (
    <View
      className="pt-14 flex-1 pb-16"
      style={[style.contaienr, { backgroundColor: appTheme.screenBackground }]}
    >
      {orders?.length > 0 ? (
        <FlashList
          data={orders}
          estimatedItemSize={orders?.length}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshing={networkStatusAssigned === NetworkStatus.loading}
          onRefresh={refetchAssigned}
          renderItem={({ item, index }: { item: IOrder; index: number }) => (
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
        
              isLast={index === orders.length - 1}
            />
          )}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  minHeight:
                    height > 670
                      ? height - height * 0.5
                      : height - height * 0.6,
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
            );
          }}
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
              className="font-[Inter] text-[18px] text-base font-[500] "
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
      )}
    </View>
  );
}

export default HomeProcessingOrdersMain;

const style = StyleSheet.create({
  contaienr: {
    paddingBottom: Platform.OS === "android" ? 50 : 80,
  },
});
