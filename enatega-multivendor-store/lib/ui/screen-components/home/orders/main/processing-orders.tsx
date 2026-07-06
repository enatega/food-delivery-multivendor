import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
// UI
import CustomTab from "@/lib/ui/useable-components/custom-tab";
import Spinner from "@/lib/ui/useable-components/spinner";
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
import { WalletIcon } from "@/lib/ui/useable-components/svg";
import { ORDER_TYPE } from "@/lib/utils/types";
import { useKeepAwake } from "expo-keep-awake";
import { useTranslation } from "react-i18next";

function HomeDeliveredOrdersMain(props: IOrderTabsComponentProps) {
  // Props
  const { route } = props;

  // Hooks
  const { t } = useTranslation();
  const { appTheme } = useApptheme();
  const tabBarHeight = useBottomTabBarHeight();
  const {
    loading,
    error,
    data,
    processingOrders,
    refetch,
    currentTab,
    setCurrentTab,
  } = useOrders();
  useKeepAwake();

  // const { loading: mutateLoading } = useAcceptOrder();

  // States
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  // Handlers
  const onInitOrders = () => {
    if (loading || error) return;
    if (!data) return;

    const _orders = processingOrders?.filter((order) =>
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

  const toggleShowDetails = (itemId: string) => {
    setShowDetails((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const renderOrderItem = ({ item }: { item: IOrder }) => (
    <Order
      tab={route.key as ORDER_TYPE}
      order={item}
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
      <WalletIcon height={100} width={100} color={appTheme.fontMainColor} />
      {orders?.length === 0 ? (
        <Text
          style={{
            color: appTheme.fontSecondColor,
            fontSize: 18,
            fontWeight: "500",
            fontFamily: "Inter",
          }}
        >
          {t(NO_ORDER_PROMPT[route.key])}
        </Text>
      ) : (
        <Text style={{ color: appTheme.fontMainColor }}>
          {t("Pull down to refresh")}
        </Text>
      )}
    </View>
  );

  // Use Effect
  useEffect(() => {
    onInitOrders();
  }, [data?.restaurantOrders, route.key, currentTab]);

  return (
    <View
      className="pt-14 flex-1 items-center"
      style={[style.container, { backgroundColor: appTheme.themeBackground }]}
    >
      <CustomTab
        options={ORDER_DISPATCH_TYPE}
        selectedTab={currentTab}
        setSelectedTab={setCurrentTab}
        deliveryCount={
          processingOrders?.filter((o) => !o.isPickedUp).length ?? 0
        }
        pickupCount={
          processingOrders?.filter((o) => !!o.isPickedUp).length ?? 0
        }
      />

      <View className="flex-1 w-full">
        {loading ? (
          <View className="flex-1">
            <Spinner />
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
            renderItem={renderOrderItem}
            ListEmptyComponent={renderEmptyState}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </View>
  );
}

export default HomeDeliveredOrdersMain;

const style = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    paddingBottom: 16,
  },
});
