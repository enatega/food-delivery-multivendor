// Interfaces
import {
  IEarningDetailsMainProps,
  IRiderEarningsResponse,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { QueryResult, useQuery } from "@apollo/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// GraphQL
import { RIDER_EARNINGS_GRAPH } from "@/lib/apollo/queries/earnings.query";

// Components
import EarningDetailsDateFilter from "../date-filter";
import EarningDetailsHeader from "../header";
import EarningsDetailStacks from "./earnings";

// Skeletons
import { EarningsSummaryMainLoading } from "@/lib/ui/skeletons";
import { showMessage } from "react-native-flash-message";

// React Native Gesture
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function EarningDetailsMain({
  dateFilter,
  setDateFilter,
}: IEarningDetailsMainProps) {
  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();

  // States
  const [isFiltering, setIsFiltering] = useState(false);
  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);

  // Contexts
  const { setModalVisible, userId } = useUserContext();

  // Queries
  const {
    loading: isRiderEarningsLoading,
    data: riderEarningsData,
    refetch: fetchRiderEarnings,
  } = useQuery(RIDER_EARNINGS_GRAPH, {
    onError: (err) => {
      console.log(err);
      showMessage({
        message:
          err.graphQLErrors[0].message ||
          err.networkError?.message ||
          "Failed to fetch earnings",
        type: "danger",
        duration: 1000,
      });
    },
    variables: {
      riderId: userId ?? "",
    },
  }) as QueryResult<
    IRiderEarningsResponse | undefined,
    { riderId: string; startDate?: string; endDate?: string }
  >;

  // Handlers
  async function handleDateFilterSubmit() {
    try {
      setIsFiltering(true);
      // Validation
      if (!dateFilter.startDate && !dateFilter.endDate) {
        setIsFiltering(false);
        return showMessage({
          message: t("Please select a date range"),
          type: "danger",
          duration: 1000,
        });
      } else if (!dateFilter.startDate) {
        setIsFiltering(false);
        return showMessage({
          message: t("Please select a start date"),
          type: "danger",
          duration: 1000,
        });
      } else if (!dateFilter.endDate) {
        setIsFiltering(false);
        return showMessage({
          message: t("Please select an end date"),
          type: "danger",
          duration: 1000,
        });
      } else if (
        new Date(dateFilter.startDate) > new Date(dateFilter.endDate)
      ) {
        setIsFiltering(false);
        return showMessage({
          message: t("Start date cannot be after end date"),
          type: "danger",
          duration: 1000,
        });
      }
      if (!userId) {
        setIsFiltering(false);
        return showMessage({
          message: t("Please log in to view your earnings"),
          type: "danger",
          duration: 1000,
        });
      }

      // Fetch with filters
      await fetchRiderEarnings({
        riderId: userId,
        startDate: dateFilter.startDate,
        endDate: dateFilter.endDate,
      });

      setIsFiltering(false);
      setIsDateFilterVisible(false);
    } catch (error) {
      console.log("an error occurred while filtering eanrings", { error });
      return setIsFiltering(false);
    } finally {
      setIsFiltering(false);
    }
  }
  // If loading
  if (isRiderEarningsLoading || isFiltering)
    return <EarningsSummaryMainLoading />;
  return (
    <GestureHandlerRootView
      style={{ backgroundColor: appTheme.screenBackground, height: "100%" }}
    >
      <EarningDetailsDateFilter
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        handleFilterSubmit={handleDateFilterSubmit}
        isFiltering={isRiderEarningsLoading || isFiltering}
        isDateFilterVisible={isDateFilterVisible}
        setIsDateFilterVisible={setIsDateFilterVisible}
        refetchDeafult={fetchRiderEarnings}
      />
      <EarningDetailsHeader />
      <EarningsDetailStacks
        isRiderEarningsLoading={isRiderEarningsLoading}
        riderEarningsData={riderEarningsData}
        setModalVisible={setModalVisible}
      />
    </GestureHandlerRootView>
  );
}
