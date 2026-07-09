import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
// UI
import CustomTab from "@/lib/ui/useable-components/custom-tab";
// Constants
import { NO_ORDER_PROMPT, ORDER_DISPATCH_TYPE } from "@/lib/utils/constants";

// Interface
import { IOrderTabsComponentProps } from "@/lib/utils/interfaces";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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
import { useKeepAwake } from "expo-keep-awake";

function HomeNewOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    loading,
    activeOrders,
    refetch,
    currentTab,
    setCurrentTab,
  } = useOrders();
  useKeepAwake();

  // Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  // Printer States

  //////////

  const orders =
    activeOrders?.filter((order) =>
      currentTab === ORDER_DISPATCH_TYPE[0]
        ? !order?.isPickedUp
        : order?.isPickedUp,
    ) ?? [];

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

  const renderOrderItem = ({ item }: { item: IOrder }) => (
    <Order
      tab={route.key as ORDER_TYPE}
      order={item}
      handlePresentModalPress={handlePresentModalPress}
      showDetails={showDetails}
      onToggleDetails={toggleShowDetails}
    />
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        width: "100%",
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
  return (
    <GestureHandlerRootView style={style.gestureContainer}>
      <BottomSheetModalProvider>
        <View
          className="pt-14 flex-1 items-center"
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

          <View className="flex-1 w-full">
            {loading && (!orders || orders?.length < 1) ? (
              <View className="flex-1">
                <SpinnerComponent />
              </View>
            ) : orders?.length > 0 ? (
              <FlatList
                className="w-full"
                contentContainerStyle={[
                  style.listContent,
                  { paddingBottom: tabBarHeight + 24 },
                ]}
                keyExtractor={(item) => item._id}
                data={orders}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={onRefresh}
                initialNumToRender={20} // render more items up front
                maxToRenderPerBatch={20} // reduce batching delays
                windowSize={5} // keep more items around viewport
                removeClippedSubviews={false}
                renderItem={renderOrderItem}
                ListEmptyComponent={renderEmptyState}
              />
            ) : (
              renderEmptyState()
            )}
          </View>
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
  container: { flex: 1 },
  gestureContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 30,
  },
  listContent: {
    paddingBottom: 16,
  },
});
