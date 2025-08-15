// Interfaces
import { ILazyQueryResult } from "@/lib/utils/interfaces";
import {
  IRiderByIdResponse,
  IRiderCurrentWithdrawRequestResponse,
  // IRiderEarningsResponse,
  IRiderTransactionHistoryResponse,
} from "@/lib/utils/interfaces/rider.interface";

// Components
import {
  CustomContinueButton,
  FlashMessageComponent,
  NoRecordFound,
} from "@/lib/ui/useable-components";
import WithdrawModal from "../form";
import RecentTransaction from "../recent-transactions";

// Hooks
import { useUserContext } from "@/lib/context/global/user.context";
import { useLazyQueryQL } from "@/lib/hooks/useLazyQueryQL";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// GraphQL
import { CREATE_WITHDRAW_REQUEST } from "@/lib/apollo/mutations/withdraw-request.mutation";
import {
  RIDER_BY_ID,
  RIDER_CURRENT_WITHDRAW_REQUEST,
  RIDER_TRANSACTIONS_HISTORY,
} from "@/lib/apollo/queries";
import { GraphQLError } from "graphql";

// Expo
import { router } from "expo-router";

// Core
import { Alert, ScrollView, Text, View } from "react-native";

// Skeletons
import { useApptheme } from "@/lib/context/global/theme.context";
import { WalletScreenMainLoading } from "@/lib/ui/skeletons";

export default function WalletMain() {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // States
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
  const [amountErrMsg, setAmountErrMsg] = useState("");
  const { userId } = useUserContext();

  // Queries

  const {
    data: riderTransactionData,
    fetch: fetchRiderTransactions,
    loading: isRiderTransactionLoading,
  } = useLazyQueryQL(
    RIDER_TRANSACTIONS_HISTORY,
    {},
    {
      userType: "RIDER",
      userId: userId,
    }
  ) as ILazyQueryResult<
    IRiderTransactionHistoryResponse | undefined,
    {
      userType: string;
      userId: string;
    }
  >;
  const {
    data: riderProfileData,
    fetch: fetchRiderProfile,
    loading: isRiderProfileLoading,
  } = useLazyQueryQL(
    RIDER_BY_ID,
    { enabled: !!userId },
    {
      id: userId,
    }
  ) as ILazyQueryResult<IRiderByIdResponse | undefined, { id: string }>;

  const {
    data: riderCurrentWithdrawRequestData,
    fetch: fetchRiderCurrentWithdrawRequest,
    loading: isRiderCurrentWithdrawRequestLoading,
  } = useLazyQueryQL(
    RIDER_CURRENT_WITHDRAW_REQUEST,
    {},
    { riderId: userId }
  ) as ILazyQueryResult<
    IRiderCurrentWithdrawRequestResponse | undefined,
    {
      riderId: string;
    }
  >;

  // Mutaions
  const [createWithDrawRequest, { loading: createWithDrawRequestLoading }] =
    useMutation(CREATE_WITHDRAW_REQUEST, {
      onCompleted: () => {
        FlashMessageComponent({
          message: t("Successfully created the withdraw request"),
        });
        setIsBottomModalOpen(false);
        // setIsModalVisible(true)
        router.push({
          pathname: "/(tabs)/wallet/(routes)/success",
        });
      },
      onError: (error) => {
        Alert.alert(t("Warning"), error.message, [
          {
            onPress: () => setIsBottomModalOpen(false),
            text: t("Okay"),
          },
        ]);
        FlashMessageComponent({
          message:
            error.message ||
            error.graphQLErrors[0].message ||
            JSON.stringify(error) ||
            t("Something went wrong"),
        });
      },
      refetchQueries: [
        {
          query: RIDER_BY_ID,
          variables: { riderId: userId },
        },
        {
          query: RIDER_TRANSACTIONS_HISTORY,
          variables: { userId: userId, userType: "RIDER" },
        },
        {
          query: RIDER_CURRENT_WITHDRAW_REQUEST,
          variables: { riderId: userId },
        },
      ],
    });

  // Handlers
  async function handleFormSubmission(withdrawAmount: number) {
    const currentAmount = riderProfileData?.rider.currentWalletAmount || 0;
    if (withdrawAmount > (currentAmount || 0)) {
      return setAmountErrMsg(
        `${t("Please enter a valid amount, You have $")}${currentAmount} ${t("available")}.`
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
        },
      });
    } catch (error) {
      const err = error as GraphQLError;

      // FlashMessageComponent({
      //   message:
      //     err.message || JSON.stringify(error) || t("Something went wrong"),
      // });

      console.log("error wallet", err);
    }
  }
  // Loading state
  const isLoading =
    createWithDrawRequestLoading ||
    isRiderProfileLoading ||
    isRiderTransactionLoading ||
    isRiderCurrentWithdrawRequestLoading;

  // UseEffects
  useEffect(() => {
    // fetchRiderEarnings();
    if (userId) {
      fetchRiderProfile();
      fetchRiderTransactions();
      fetchRiderCurrentWithdrawRequest({
        riderId: userId,
      });
    }
  }, [userId]);
  if (isLoading) return <WalletScreenMainLoading />;
  return (
    <View
      className="flex flex-col justify-between  w-[100%] h-full "
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      {!isLoading && (
        <View
          className="flex flex-column gap-4 items-center m-4 p-4 rounded-lg"
          style={{ backgroundColor: appTheme.themeBackground }}
        >
          <Text
            className="text-[18px] font-[600]"
            style={{ color: appTheme.secondaryTextColor }}
          >
            {t("Current Balance")}
          </Text>
          <Text
            className="font-semibold text-[32px]"
            style={{ color: appTheme.fontMainColor }}
          >
            $
            {riderProfileData?.rider.currentWalletAmount.toFixed(2) ??
              Number(0.0).toFixed(2)}
          </Text>
          <CustomContinueButton
            title={t("Withdraw Now")}
            onPress={() => setIsBottomModalOpen((prev) => !prev)}
          />
        </View>
      )}
      {riderCurrentWithdrawRequestData?.riderCurrentWithdrawRequest
        ?.requestAmount !== 0 &&
        riderCurrentWithdrawRequestData?.riderCurrentWithdrawRequest && (
          <View
            style={{
              backgroundColor: appTheme.themeBackground,
              borderBottomColor: appTheme.borderLineColor,
              borderTopColor: "transparen",
              borderBottomWidth: 1,
            }}
          >
            <Text
              className="font-bold text-lg p-5 mt-4"
              style={{ color: appTheme.fontMainColor }}
            >
              {t("Pending Request")}
            </Text>
            <RecentTransaction
              transaction={{
                amountTransferred:
                  Number(
                    riderCurrentWithdrawRequestData?.riderCurrentWithdrawRequest.requestAmount.toFixed(
                      2
                    )
                  ) || Number(Number(0.0).toFixed(2)),
                status:
                  riderCurrentWithdrawRequestData?.riderCurrentWithdrawRequest
                    .status,
                createdAt:
                  riderCurrentWithdrawRequestData?.riderCurrentWithdrawRequest
                    .createdAt,
              }}
              key={
                riderCurrentWithdrawRequestData?.riderCurrentWithdrawRequest
                  .createdAt
              }
              isLast={false}
            />
          </View>
        )}
      <Text
        className="font-bold text-lg  p-5 mt-4"
        style={{
          backgroundColor: appTheme.themeBackground,
          borderBottomColor: appTheme.borderLineColor,
          borderTopColor: "transparent",
          borderBottomWidth: 1,
          color: appTheme.fontMainColor,
        }}
      >
        {t("Recent Transactions")}
      </Text>

      <ScrollView style={{ backgroundColor: appTheme.themeBackground }}>
        {riderTransactionData?.transactionHistory.data.map(
          (transaction, index) => {
            return (
              <RecentTransaction
                transaction={transaction}
                key={transaction.createdAt}
                isLast={
                  riderTransactionData?.transactionHistory.data.length - 1 ===
                  index
                }
              />
            );
          }
        )}
        {!riderTransactionData?.transactionHistory?.data?.length && (
          <NoRecordFound />
        )}
      </ScrollView>

      <WithdrawModal
        isBottomModalOpen={isBottomModalOpen}
        setIsBottomModalOpen={setIsBottomModalOpen}
        amountErrMsg={amountErrMsg}
        setAmountErrMsg={setAmountErrMsg}
        currentTotal={riderProfileData?.rider?.currentWalletAmount ?? 0}
        handleFormSubmission={handleFormSubmission}
        withdrawRequestLoading={createWithDrawRequestLoading}
      />
    </View>
  );
}
