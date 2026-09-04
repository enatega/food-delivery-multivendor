// Core
import { FlatList, Text, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// Interfaces
import { IStoreEarningsDetailProps } from "@/lib/utils/interfaces/earning.interface";
import { IStoreEarnings } from "@/lib/utils/interfaces/rider-earnings.interface";

// Components
import NoRecordFound from "@/lib/ui/useable-components/no-record-found";
import EarningStack from "../../../earnings/view/earnings-stack";

// Apollo

// React Native Flash Message

// Hooks
import { useEarningsTheme } from "../../../earnings/theme";
import { useTranslation } from "react-i18next";

export default function EarningsDetailStacks({
  setModalVisible,
  storeEarnings,
  isLoading,
}: IStoreEarningsDetailProps) {
  // Hooks
  const earningsTheme = useEarningsTheme();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = ({
    item: earning,
    index,
  }: {
    item: IStoreEarnings;
    index: number;
  }) => (
    <EarningStack
      totalDeliveries={earning.earningsArray.length}
      date={earning._id}
      earning={earning.totalEarningsSum}
      _id={earning._id}
      earningsArray={earning.earningsArray}
      totalOrderAmount={earning.totalOrderAmount}
      setModalVisible={setModalVisible}
      isFirst={index === 0}
      isLast={storeEarnings ? storeEarnings?.length - 1 === index : false}
    />
  );

  // Empty Component
  const ListEmptyComponent = () => {
    if (isLoading) return null;
    return <NoRecordFound />;
  };

  return (
    <View style={{ backgroundColor: earningsTheme.canvas, flex: 1 }}>
      <FlatList
        data={storeEarnings ?? []}
        renderItem={({ item, index }) => renderItem({ item, index })}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        className="scroll-smooth"
        keyExtractor={(item) => item._id}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 12,
            }}
          >
            <Text
              style={{
                color: earningsTheme.primaryText,
                fontSize: 20,
                fontWeight: "800",
              }}
            >
              {t("Recent Activity")}
            </Text>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: tabBarHeight + 24,
          paddingTop: 2,
        }}
      />
    </View>
  );
}
