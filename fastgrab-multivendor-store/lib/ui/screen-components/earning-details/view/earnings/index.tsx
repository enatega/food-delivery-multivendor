// Core
import { FlatList, View } from "react-native";

// Interfaces
import { IStoreEarningsDetailProps } from "@/lib/utils/interfaces/earning.interface";
import { IStoreEarnings } from "@/lib/utils/interfaces/rider-earnings.interface";

// Components
import NoRecordFound from "@/lib/ui/useable-components/no-record-found";
import EarningStack from "../../../earnings/view/earnings-stack";

// Apollo

// React Native Flash Message

// Hooks
import { useApptheme } from "@/lib/context/theme.context";

export default function EarningsDetailStacks({
  setModalVisible,
  storeEarnings,
  isLoading,
}: IStoreEarningsDetailProps) {
  // Hooks
  const { appTheme } = useApptheme();

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
      isLast={storeEarnings ? storeEarnings?.length - 1 === index : false}
    />
  );

  // Empty Component
  const ListEmptyComponent = () => {
    if (isLoading) return null;
    return <NoRecordFound />;
  };

  return (
    <View
      className="h-full border-t-2"
      style={{
        borderTopColor: appTheme.borderLineColor,
        backgroundColor: appTheme.themeBackground,
      }}
    >
      <FlatList
        data={storeEarnings ?? []}
        renderItem={({ item, index }) => renderItem({ item, index })}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        className="scroll-smooth"
        keyExtractor={(item) => item._id}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 200,
        }}
      />
    </View>
  );
}
