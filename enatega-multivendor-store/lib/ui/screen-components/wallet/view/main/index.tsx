// Interfaces
import { ILazyQueryResult } from "@/lib/utils/interfaces";
import {
  IStoreByIdResponse,
  IStoreCurrentWithdrawRequestResponse,
  IStoreEarningsResponse,
  IStoreTransaction,
  IStoreTransactionHistoryResponse,
} from "@/lib/utils/interfaces/rider.interface";

// Components
import {
  CustomContinueButton,
  NoRecordFound,
} from "@/lib/ui/useable-components";
import WithdrawModal from "../form";
import RecentTransaction from "../recent-transactions";

// Hooks
import { useUserContext } from "@/lib/context/global/user.context";
import { useLazyQueryQL } from "@/lib/hooks/useLazyQueryQL";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

// GraphQL
import { CREATE_WITHDRAW_REQUEST } from "@/lib/apollo/mutations/withdraw-request.mutation";
import {
  STORE_BY_ID,
  STORE_CURRENT_WITHDRAW_REQUEST,
  STORE_EARNINGS,
  STORE_PROFILE,
  STORE_TRANSACTIONS_HISTORY,
} from "@/lib/apollo/queries/store.query";

// Expo
import { router } from "expo-router";

// Core
import { Alert, FlatList, Text, View } from "react-native";

// Skeletons
import { useApptheme } from "@/lib/context/theme.context";
import { WalletScreenMainLoading } from "@/lib/ui/skeletons";
import { useTranslation } from "react-i18next";
import { showMessage } from "react-native-flash-message";

export default function WalletMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { userId } = useUserContext();
  const tabBarHeight = useBottomTabBarHeight();

  // States
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [amountErrMsg, setAmountErrMsg] = useState("");

  // Queries
  const { fetch: fetchStoreEarnings, loading: isStoreEarningsLoading } =
    useLazyQueryQL(STORE_EARNINGS) as ILazyQueryResult<
      IStoreEarningsResponse | undefined,
      { userType: "STORE"; userId: string }
    >;

  const {
    data: storeTransactionData,
    fetch: fetchStoreTransactions,
    loading: isStoreTransactionLoading,
  } = useLazyQueryQL(
    STORE_TRANSACTIONS_HISTORY,
    {
      fetchPolicy: "cache-and-network",
    },
    {}
  ) as ILazyQueryResult<
    IStoreTransactionHistoryResponse | undefined,
    Record<string, never>
  >;
  const {
    data: storeProfileData,
    fetch: fetchStoreProfile,
    loading: isStoreProfileLoading,
  } = useLazyQueryQL(
    STORE_BY_ID,
    { fetchPolicy: "cache-and-network" },
    {
      id: userId,
    }
  ) as ILazyQueryResult<IStoreByIdResponse | undefined, { id: string }>;

  const {
    data: storeCurrentWithdrawRequestData,
    fetch: fetchStoreCurrentWithdrawRequest,
    loading: isStoreCurrentWithdrawRequestLoading,
  } = useLazyQueryQL(
    STORE_CURRENT_WITHDRAW_REQUEST,
    { fetchPolicy: "cache-and-network" },
    { storeId: userId }
  ) as ILazyQueryResult<
    IStoreCurrentWithdrawRequestResponse | undefined,
    {
      storeId: string;
    }
  >;

  // Mutaions
  const [createWithDrawRequest, { loading: createWithDrawRequestLoading }] =
    useMutation(CREATE_WITHDRAW_REQUEST, {
      onCompleted: () => {
        setIsBottomModalOpen(false);
        showMessage({
          message: t("Successfully created the withdraw request"),
        });
        router.push({
          pathname: "/(protected)/(tabs)/wallet/(routes)/success",
        });
      },
      onError: (error) => {
        setIsBottomModalOpen(false);
        Alert.alert(t("Warning"), error.message, [
          {
            onPress: () => setIsBottomModalOpen(false),
            text: t("Okay"),
          },
        ]);
        return showMessage({
          message:
            error.message ||
            error.graphQLErrors[0].message ||
            JSON.stringify(error) ||
            t("Something went wrong"),
        });
      },
      refetchQueries: [
        {
          query: STORE_BY_ID,
          variables: { id: userId },
          fetchPolicy: "network-only",
        },
        {
          query: STORE_CURRENT_WITHDRAW_REQUEST,
          variables: { storeId: userId },
          fetchPolicy: "network-only",
        },
        {
          query: STORE_PROFILE,
          variables: { userId: userId },
          fetchPolicy: "network-only",
        },
        {
          query: STORE_EARNINGS,
          variables: { id: userId },
          fetchPolicy: "network-only",
        },
      ],
    });

  // Handlers
  async function handleFormSubmission(withdrawAmount: number) {
    if (createWithDrawRequestLoading || !userId) return;

    const currentAmount =
      storeProfileData?.restaurant?.currentWalletAmount || 0;
    if (withdrawAmount > (currentAmount || 0)) {
      return setAmountErrMsg(
        `${t("Please enter a valid amount")}. ${t("You have")} $${currentAmount} ${"available"}.`
      );
    } else if (withdrawAmount < 10) {
      return setAmountErrMsg(
        t("The withdraw amount must be atleast 10 or greater")
      );
    } else if (typeof withdrawAmount !== "number") {
      return setAmountErrMsg(t("Please enter a valid number"));
    }
    try {
      await createWithDrawRequest({
        variables: {
          requestAmount: withdrawAmount,
          userId: userId,
        },
      });
    } catch {
      return;
    }
  }
  // Loading state
  const isLoading =
    createWithDrawRequestLoading ||
    isStoreEarningsLoading ||
    isStoreProfileLoading ||
    isStoreTransactionLoading ||
    isStoreCurrentWithdrawRequestLoading;

  // UseEffects
  useEffect(() => {
    if (userId) {
      fetchStoreProfile({
        id: userId,
      });
      fetchStoreEarnings({
        userType: "STORE",
        userId: userId,
      });
      fetchStoreTransactions({});
      fetchStoreCurrentWithdrawRequest({
        storeId: userId,
      });
    }
  }, [userId]);

  const renderTransactionsHeader = () => (
    <Text
      className="font-bold text-lg p-5"
      style={{
        color: appTheme.fontMainColor,
        backgroundColor: appTheme.themeBackground,
      }}
    >
      {t("Recent Transactions")}
    </Text>
  );

  const renderTransactionItem = ({
    item,
    index,
  }: {
    item: IStoreTransaction;
    index: number;
  }) => {
    const transactions = storeTransactionData?.transactionHistory?.data;
    if (!transactions) return <NoRecordFound />;

    return (
      <RecentTransaction transaction={item} isLast={transactions.length - 1 === index} />
    );
  };

  if (isLoading) return <WalletScreenMainLoading />;
  else
    return (
      <View
        className="flex flex-col justify-between items-center -top-8  w-full h-[110%] "
        // style={{ backgroundColor: appTheme.themeBackground }}
      >
        {storeProfileData?.restaurant ? (
          <View
            className="flex-1 w-full flex flex-column gap-2 items-center top-0"
            // style={{ backgroundColor: appTheme.themeBackground }}
          >
            <Text
              className="text-[18px] font-[600] mt-12"
              style={{
                color: appTheme.fontSecondColor,
              }}
            >
              {t("Current Balance")}
            </Text>
            <Text
              className="font-semibold text-[32px]"
              style={{ color: appTheme.fontMainColor }}
            >
              $
              {String(
                storeProfileData?.restaurant?.currentWalletAmount?.toFixed(2) ??
                  "0.00"
              )}
            </Text>

            <CustomContinueButton
              title={t("Withdraw Now")}
              onPress={() => setIsBottomModalOpen((prev) => !prev)}
            />
          </View>
        ) : (
          <NoRecordFound msg={t("Your wallet is currently empty")} />
        )}
        {storeCurrentWithdrawRequestData?.storeCurrentWithdrawRequest && (
          <View className="w-full h-40 -top-8">
            <Text
              className="font-bold text-lg p-5 mt-2"
              style={{
                backgroundColor: appTheme.themeBackground,
                color: appTheme.fontMainColor,
              }}
            >
              {t("Pending Request")}
            </Text>
            <RecentTransaction
              transaction={{
                amountTransferred:
                  storeCurrentWithdrawRequestData?.storeCurrentWithdrawRequest
                    ?.requestAmount || 0,
                status:
                  storeCurrentWithdrawRequestData?.storeCurrentWithdrawRequest
                    ?.status,
                createdAt:
                  storeCurrentWithdrawRequestData?.storeCurrentWithdrawRequest
                    ?.createdAt,
              }}
              key={
                storeCurrentWithdrawRequestData?.storeCurrentWithdrawRequest
                  ?.createdAt
              }
              isLast={false}
            />
          </View>
        )}

        {storeTransactionData && (
          <FlatList
            className="w-full h-full flex-1 basis-32 -mt-12"
            ListHeaderComponent={renderTransactionsHeader}
            data={storeTransactionData?.transactionHistory?.data}
            contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
            ListEmptyComponent={<NoRecordFound />}
            keyExtractor={(item, index) =>
              `${item.createdAt}-${item.status}-${index}`
            }
            renderItem={({ item, index }) => renderTransactionItem({ item, index })}
          />
        )}

        <WithdrawModal
          isBottomModalOpen={isBottomModalOpen}
          setIsBottomModalOpen={setIsBottomModalOpen}
          amountErrMsg={amountErrMsg}
          setAmountErrMsg={setAmountErrMsg}
          currentTotal={storeProfileData?.restaurant?.currentWalletAmount ?? 0}
          handleFormSubmission={handleFormSubmission}
          withdrawRequestLoading={createWithDrawRequestLoading}
        />
      </View>
    );
}
