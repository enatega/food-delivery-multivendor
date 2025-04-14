/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";

import {
  ApolloCache,
  FetchResult,
  ServerError,
  ServerParseError,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { GraphQLFormattedError } from "graphql";
import { useTranslation } from "react-i18next";
import { GET_CONFIGURATION } from "../api/graphql/query/configuration";
import {
  ASSIGN_ORDER,
  UPDATE_ORDER_STATUS_RIDER,
} from "../apollo/mutations/order.mutation";
import { RIDER_EARNINGS_GRAPH } from "../apollo/queries/earnings.query";
import {
  RIDER_CURRENT_WITHDRAW_REQUEST,
  RIDER_ORDERS,
  RIDER_PROFILE,
  RIDER_TRANSACTIONS_HISTORY,
} from "../apollo/queries/rider.query";
import { SUBSCRIPTION_ORDERS } from "../apollo/subscriptions";
import UserContext from "../context/global/user.context";
import { FlashMessageComponent } from "../ui/useable-components";
import { IOrder } from "../utils/interfaces/order.interface";

const useDetails = (orderData: IOrder) => {
  // Hooks
  const { t } = useTranslation();
  const { assignedOrders, loadingAssigned, userId } = useContext(UserContext);
  const [order, setOrder] = useState<IOrder>(orderData);

  useEffect(() => {
    if (!loadingAssigned && order) {
      setOrder(
        assignedOrders?.find((o) => o._id === order?._id) ?? ({} as IOrder),
      );
    }
  }, [assignedOrders]);

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

  const preparationSeconds =
    preparationTime.hours * 3600 +
    preparationTime.minutes * 60 +
    preparationTime.seconds;
  const currentSeconds =
    currentTime.hours * 3600 + currentTime.minutes * 60 + currentTime.seconds;

  useSubscription(SUBSCRIPTION_ORDERS, {
    variables: { id: order?._id },
    skip: !order,
  });

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
      refetchQueries: [
        { query: RIDER_PROFILE, variables: { id: userId } },
        {
          query: RIDER_TRANSACTIONS_HISTORY,
          variables: { userId: userId, userType: "RIDER" },
        },
        {
          query: RIDER_CURRENT_WITHDRAW_REQUEST,
          variables: { riderId: userId },
        },
        {
          query: RIDER_EARNINGS_GRAPH,
          variables: { rideId: userId },
        },
        { query: RIDER_ORDERS },
      ],
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
    cause,
    graphQLErrors,
    networkError,
  }: {
    graphQLErrors: ReadonlyArray<GraphQLFormattedError>;
    networkError: Error | ServerParseError | ServerError | null;
  }) {
    let message = t("Something went wrong");
    if (networkError) message = "Internal Server Error";
    if (graphQLErrors) message = graphQLErrors.map((o) => o.message).join(", ");
    if (cause) message = cause.message;
    // FlashMessageComponent({ message: message });
    console.log({ message });
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
