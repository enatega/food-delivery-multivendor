// Interfaces
import { ILazyQueryResult } from "@/lib/utils/interfaces";
import {
  IStoreByIdResponse,
  IStoreCurrentWithdrawRequestResponse,
  IStoreEarningsResponse,
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
import { GraphQLError } from "graphql";

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
      fetchPolicy: "network-only",
    },
    {
      userType: "STORE",
      userId: userId,
    },
  ) as ILazyQueryResult<
    IStoreTransactionHistoryResponse | undefined,
    {
      userType: string;
      userId: string;
    }
  >;
  const {
    data: storeProfileData,
    fetch: fetchStoreProfile,
    loading: isStoreProfileLoading,
  } = useLazyQueryQL(
    STORE_BY_ID,
    { fetchPolicy: "network-only" },
    {
      id: userId,
    },
  ) as ILazyQueryResult<IStoreByIdResponse | undefined, { id: string }>;

  const {
    data: storeCurrentWithdrawRequestData,
    fetch: fetchStoreCurrentWithdrawRequest,
    loading: isStoreCurrentWithdrawRequestLoading,
  } = useLazyQueryQL(
    STORE_CURRENT_WITHDRAW_REQUEST,
    { fetchPolicy: "network-only" },
    { storeId: userId },
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
    const currentAmount =
      storeProfileData?.restaurant?.currentWalletAmount || 0;
    if (withdrawAmount > (currentAmount || 0)) {
      return setAmountErrMsg(
        `${t("Please enter a valid amount")}. ${t("You have")} $${currentAmount} ${"available"}.`,
      );
    } else if (withdrawAmount < 10) {
      return setAmountErrMsg(
        t("The withdraw amount must be atleast 10 or greater"),
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
    } catch (error) {
      const err = error as GraphQLError;
      console.log(err);
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
      fetchStoreTransactions({
        userType: "STORE",
        userId: userId,
      });
      fetchStoreCurrentWithdrawRequest({
        storeId: userId,
      });
    }
  }, [userId]);

  if (isLoading) return <WalletScreenMainLoading />;
  else
    return (
      <View
        className="flex flex-col justify-between items-center -top-8  w-[100%] h-[110%] "
        style={{ backgroundColor: appTheme.themeBackground }}
      >
        {storeProfileData?.restaurant ? (
          <View
            className="flex-1 flex flex-column gap-2 items-center top-0"
            style={{ backgroundColor: appTheme.themeBackground }}
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
              {String(storeProfileData?.restaurant?.currentWalletAmount ?? "0")}
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
            ListHeaderComponent={() => {
              return (
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
            }}
            data={storeTransactionData?.transactionHistory?.data}
            ListEmptyComponent={<NoRecordFound />}
            renderItem={({ item, index }) => {
              if (storeTransactionData?.transactionHistory?.data) {
                return (
                  <RecentTransaction
                    transaction={item}
                    isLast={
                      storeTransactionData?.transactionHistory?.data?.length -
                        1 ===
                      index
                    }
                    key={`transaction_${index}#`}
                  />
                );
              } else {
                return <NoRecordFound />;
              }
            }}
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
