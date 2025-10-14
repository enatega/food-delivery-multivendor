import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
// UI
import CustomTab from "@/lib/ui/useable-components/custom-tab";
// Constants
import { NO_ORDER_PROMPT, ORDER_DISPATCH_TYPE } from "@/lib/utils/constants";

// Interface
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

// Hook
import { useApptheme } from "@/lib/context/theme.context";
import useOrders from "@/lib/hooks/useOrders";
import Order from "@/lib/ui/useable-components/order";
import SetTimeScreenAndAcceptOrder from "@/lib/ui/useable-components/set-order-accept-time";
import { WalletIcon } from "@/lib/ui/useable-components/svg";
import { ORDER_TYPE } from "@/lib/utils/types";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";

const { height } = Dimensions.get("window");

function HomeNewOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const {
    loading,
    error,
    data,
    activeOrders,
    refetch,
    currentTab,
    setCurrentTab,
  } = useOrders();

  // Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  // Handlers
  const onInitOrders = () => {
    if (loading || error) return;
    if (!data) return;

    const _orders = activeOrders?.filter((order) =>
      currentTab === ORDER_DISPATCH_TYPE[0]
        ? !order?.isPickedUp
        : order?.isPickedUp
    );
    setOrders(_orders ?? []);
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const handlePresentModalPress = (order: IOrder) => {
    setSelectedOrder(order);
    bottomSheetModalRef.current?.present();
  };

  const handleDismissModal = () => {
    setSelectedOrder(null);
    bottomSheetModalRef.current?.dismiss();
  };

  const toggleShowDetails = (itemId: string) => {
    setShowDetails((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };
  // Use Effect
  useEffect(() => {
    onInitOrders();
  }, [data?.restaurantOrders, route.key, currentTab]);

  useEffect(() => {
    // Trigger refetch when orders length changes
    if (orders?.length === 0) {
      refetch();
    }
  }, [orders?.length]);

  // Calculate the marginBottom dynamically
  const marginBottom = Platform.OS === "ios" ? height * 0.4 : height * 0.35;

  return (
    <GestureHandlerRootView style={style.gestureContainer}>
      <BottomSheetModalProvider>
        <View
          className="pt-14 flex-1 items-center pb-20"
          style={[
            style.container,
            { backgroundColor: appTheme.themeBackground },
          ]}
        >
          <CustomTab
            options={ORDER_DISPATCH_TYPE}
            deliveryCount={
              activeOrders?.filter((o) => !o.isPickedUp).length ?? 0
            }
            pickupCount={
              activeOrders?.filter((o) => !!o.isPickedUp).length ?? 0
            }
            selectedTab={currentTab}
            setSelectedTab={setCurrentTab}
          />

          {loading && (!orders || orders?.length < 1) ? (
            <View className="flex-1">
              <SpinnerComponent />
            </View>
          ) : orders?.length > 0 ? (
            <FlatList
              className={`w-full h-[${height}px] mb-[${marginBottom}px]`}
              keyExtractor={(item) => item._id}
              data={orders}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={onRefresh}
              initialNumToRender={20} // render more items up front
              maxToRenderPerBatch={20} // reduce batching delays
              windowSize={5} // keep more items around viewport
              removeClippedSubviews={false}
              renderItem={({ item }: { item: IOrder }) => (
                <Order
                  tab={route.key as ORDER_TYPE}
                  order={item}
                  key={item._id}
                  handlePresentModalPress={handlePresentModalPress}
                  showDetails={showDetails}
                  onToggleDetails={toggleShowDetails}
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
                      <Text className="font-[Inter] text-[18px] text-base font-[500] text-gray-600">
                        {t(NO_ORDER_PROMPT[route.key])}
                      </Text>
                    ) : (
                      <Text>{t("Pull down to refresh")}</Text>
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
              <WalletIcon
                height={100}
                width={100}
                color={appTheme.fontMainColor}
              />

              {orders?.length === 0 ? (
                <Text className="font-[Inter] text-[18px] text-base font-[500] text-gray-600">
                  {t(NO_ORDER_PROMPT[route.key])}
                </Text>
              ) : (
                <Text>{t("Pull down to refresh")}</Text>
              )}
            </View>
          )}
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          style={{ backgroundColor: appTheme.themeBackground }}
          handleComponent={() => (
            <View
              style={{
                backgroundColor: appTheme.themeBackground,
                alignItems: "center",
                justifyContent: "center",
                borderTopWidth: 1,
                borderTopColor: appTheme.fontMainColor,
              }}
            >
              <Ionicons
                color={appTheme.fontMainColor}
                name="remove"
                size={30}
              />
            </View>
          )}
        >
          <BottomSheetView
            style={[
              style.contentContainer,
              { backgroundColor: appTheme.themeBackground },
            ]}
          >
            {selectedOrder?._id && (
              <SetTimeScreenAndAcceptOrder
                id={selectedOrder?._id ?? ""}
                orderId={selectedOrder?.orderId ?? ""}
                handleDismissModal={handleDismissModal}
              />
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default HomeNewOrdersMain;

const style = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === "android" ? 50 : 80,
  },
  gestureContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 30,
  },
});
