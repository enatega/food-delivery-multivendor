/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useMemo, useState } from "react";

import {
  ApolloCache,
  FetchResult,
  ServerError,
  ServerParseError,
  useMutation,
  useQuery,
} from "@apollo/client";
import { GraphQLFormattedError } from "graphql";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { GET_CONFIGURATION } from "../api/graphql/query/configuration";
import {
  ASSIGN_ORDER,
  UPDATE_ORDER_STATUS_RIDER,
} from "../apollo/mutations/order.mutation";
import { RIDER_EARNINGS_GRAPH } from "../apollo/queries/earnings.query";
import {
  RIDER_ORDERS,
  RIDER_PROFILE,
} from "../apollo/queries/rider.query";
import UserContext from "../context/global/user.context";
import { FlashMessageComponent } from "../ui/useable-components";
import { IOrder } from "../utils/interfaces/order.interface";

const useDetails = (orderData: IOrder) => {
  // Hooks
  const { t } = useTranslation();
  const { assignedOrders, loadingAssigned, userId } = useContext(UserContext);
  const [order, setOrder] = useState<IOrder>(orderData);

  useEffect(() => {
    if (!loadingAssigned && orderData?._id) {
      setOrder(
        assignedOrders?.find((o) => o._id === orderData._id) ?? orderData,
      );
    }
  }, [assignedOrders, loadingAssigned, orderData]);

  // Derive the prep/now second-of-day values once per order instead of building
  // six `new Date()` objects on every render.
  const { preparationSeconds, currentSeconds } = useMemo(() => {
    const preparationTime = {
      hours: new Date(order?.preparationTime).getHours(),
      minutes: new Date(order?.preparationTime).getMinutes(),
      seconds: new Date(order?.preparationTime).getSeconds(),
    };
    const currentTime = {
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
      seconds: new Date().getSeconds(),
    };
    return {
      preparationSeconds:
        preparationTime.hours * 3600 +
        preparationTime.minutes * 60 +
        preparationTime.seconds,
      currentSeconds:
        currentTime.hours * 3600 +
        currentTime.minutes * 60 +
        currentTime.seconds,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?._id, order?.preparationTime]);

  // Order updates arrive through UserContext's SUBSCRIPTION_ASSIGNED_RIDER /
  // SUBSCRIPTION_ZONE_ORDERS (upserted into RIDER_ORDERS -> assignedOrders), which
  // this hook already reads via `order`. A per-order SUBSCRIPTION_ORDERS here was a
  // duplicate socket whose result was never consumed, so it's removed.

  const {
    data: dataConfig,
    loading: loadingConfig,
    error: errorConfig,
  } = useQuery(GET_CONFIGURATION);

  const [mutateAssignOrder, { loading: loadingAssignOrder }] = useMutation(
    ASSIGN_ORDER,
    {
      refetchQueries: [{ query: RIDER_ORDERS }],
      onCompleted,
      onError,
      update,
    },
  );

  const [mutateOrderStatus, { loading: loadingOrderStatus }] = useMutation(
    UPDATE_ORDER_STATUS_RIDER,
    {
      onCompleted,
      onError,
      update,
      // RIDER_ORDERS is kept in sync by update() (below), so it's not refetched
      // here. Intermediate transitions (PICKED/ASSIGNED) don't change earnings or
      // wallet, so they trigger no network refetch — the rider needs bandwidth to
      // navigate at that moment. Only a "DELIVERED" transition affects earnings /
      // wallet balance, so refetch just those two queries then.
      refetchQueries: (mutationResult) =>
        mutationResult.data?.updateOrderStatusRider?.orderStatus === "DELIVERED"
          ? [
              { query: RIDER_PROFILE, variables: { id: userId } },
              { query: RIDER_EARNINGS_GRAPH, variables: { rideId: userId } },
            ]
          : [],
    },
  );

  async function onCompleted(result: any) {
    if (result.updateOrderStatusRider) {
      FlashMessageComponent({
        message: `${t("Order marked as")} ${result.updateOrderStatusRider.orderStatus}`,
      });
    }
    if (result.assignOrder) {
      FlashMessageComponent({
        message: "Order assigned",
      });
      //   setActive("MyOrders");
    }
  }

  function onError({
    graphQLErrors,
    networkError,
  }: {
    graphQLErrors: ReadonlyArray<GraphQLFormattedError>;
    networkError: Error | ServerParseError | ServerError | null;
  }) {
    let message = t("Something went wrong");
    if (graphQLErrors?.length) {
      message = graphQLErrors.map((o) => o.message).join(", ");
    }
    if (networkError) {
      message = t("Unable to connect. Please check your internet and try again.");
    }

    // Make failures visible to the rider. Critical connectivity/server failures
    // get a blocking Alert; operational (GraphQL) errors get a flash message.
    if (networkError) {
      Alert.alert(t("Something went wrong"), message);
    } else {
      FlashMessageComponent({ message });
    }

    if (__DEV__) {
      console.log({ message });
    }
  }

  async function update(cache: ApolloCache<any>, { data }: FetchResult<any>) {
    if (data?.assignOrder) {
      const existingData = cache.readQuery({ query: RIDER_ORDERS });
      if (existingData) {
        const index = existingData.riderOrders.findIndex(
          (o: IOrder) => o._id === data.assignOrder._id,
        );
        if (index > -1) {
          existingData.riderOrders[index].rider = data.assignOrder.rider;
          existingData.riderOrders[index].orderStatus =
            data.assignOrder.orderStatus;
          cache.writeQuery({
            query: RIDER_ORDERS,
            data: { riderOrders: [...existingData.riderOrders] },
          });
        }
      }
    }
    if (data?.updateOrderStatusRider) {
      const existingData = cache.readQuery({ query: RIDER_ORDERS });
      if (existingData) {
        const index = existingData.riderOrders.findIndex(
          (o: IOrder) => o._id === data.updateOrderStatusRider._id,
        );
        if (index > -1) {
          existingData.riderOrders[index].orderStatus =
            data.updateOrderStatusRider.orderStatus;
          cache.writeQuery({
            query: RIDER_ORDERS,
            data: { riderOrders: [...existingData.riderOrders] },
          });
        }
      }
    }
  }
  return {
    order,
    dataConfig,
    currentSeconds,
    preparationSeconds,
    loadingConfig,
    errorConfig,
    mutateAssignOrder,
    mutateOrderStatus,
    loadingAssignOrder,
    loadingOrderStatus,
  };
};

export default useDetails;
