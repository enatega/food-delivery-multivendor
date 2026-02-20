import { useApptheme } from "@/lib/context/global/theme.context";
import { View, ScrollView, RefreshControl, SafeAreaView } from "react-native";
import WalletMain from "../../screen-components/wallet/view/main";
import React, { useCallback, useState } from "react";
import {
  RIDER_TRANSACTIONS_HISTORY,
} from "@/lib/apollo/queries";
import { useQuery } from "@apollo/client";
import { useUserContext } from "@/lib/context/global/user.context";
export default function WalletScreen() {
  // Hooks
  const { appTheme } = useApptheme();
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useUserContext()

  const {
    refetch,
  } = useQuery(
    RIDER_TRANSACTIONS_HISTORY,
    {variables:
      { userId: userId, userType: "RIDER" },
    }
  )     

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [refetch]);

  return (
    // fix background color of scrollview
    <SafeAreaView style={{ flex: 1, backgroundColor: appTheme.screenBackground }}>
    <ScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: appTheme.screenBackground }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        className="w-full items-center"
      >
        <WalletMain />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}
