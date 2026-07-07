import { QueryResult, useQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
// Interface
import {
  IRiderProfileResponse,
  IUserContextProps,
  IUserProviderProps,
} from "@/lib/utils/interfaces";
// API
import { RIDER_ORDERS, RIDER_PROFILE } from "@/lib/apollo/queries";
import {
  SUBSCRIPTION_ASSIGNED_RIDER,
  SUBSCRIPTION_ZONE_ORDERS,
} from "@/lib/apollo/subscriptions";
import { asyncStorageEmitter } from "@/lib/services/async-storage";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import {
  IRiderEarnings,
  IRiderEarningsArray,
} from "@/lib/utils/interfaces/rider-earnings.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext<IUserContextProps>({} as IUserContextProps);

export const UserProvider = ({ children }: IUserProviderProps) => {
  // States
  const [modalVisible, setModalVisible] = useState<
    IRiderEarnings & { bool: boolean }
  >({
    bool: false,
    _id: "",
    date: "",
    earningsArray: [] as IRiderEarningsArray[],
    totalEarningsSum: 0,
    totalTipsSum: 0,
    totalDeliveries: 0,
  });
  const [riderOrderEarnings, setRiderOrderEarnings] = useState<
    IRiderEarningsArray[]
  >([] as IRiderEarningsArray[]);
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");

  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
    refetch: refetchProfile,
  } = useQuery(RIDER_PROFILE, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !userId,
    variables: {
      id: userId,
    },
  }) as QueryResult<IRiderProfileResponse | undefined, { id: string }>;

  const {
    loading: loadingAssigned,
    error: errorAssigned,
    data: dataAssigned,
    networkStatus: networkStatusAssigned,
    subscribeToMore,
    refetch: refetchAssigned,
  } = useQuery(RIDER_ORDERS, {
    // Orders change constantly (status updates, new assignments), so every
    // fetch/refetch/poll must hit the network rather than falling back to
    // cache-first, which could serve stale order lists.
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    pollInterval: 30000,
    skip: !userId,
    variables: {
      userId,
    },
  });

  async function getUserId() {
    const id = await AsyncStorage.getItem("rider-id");

    if (id) {
      setUserId(id);
    }
  }

  // UseEffects

  // Persist the zone id once the profile loads so the subscription can still
  // resubscribe if dataProfile is momentarily undefined. Done in its own effect
  // (not inside the subscription cleanup) to avoid a resubscribe loop.
  useEffect(() => {
    const z = dataProfile?.rider?.zone?._id;
    if (z && z !== zoneId) setZoneId(z);
  }, [dataProfile, zoneId]);

  useEffect(() => {
    const riderId = dataProfile?.rider?._id ?? userId;
    const zoneIdValue = dataProfile?.rider?.zone?._id ?? zoneId;

    if (!riderId || !zoneIdValue) return;

    // Add the order if it's not in the list yet, otherwise replace it in place.
    // Used for "update" events (e.g. status change / assignment coming through
    // as an update) so the list reflects them live instead of waiting on the
    // 30s poll — and self-heals if the original "new" event was missed.
    const upsertOrder = (orders: IOrder[] = [], order: IOrder): IOrder[] => {
      const index = orders.findIndex((o: IOrder) => o?._id === order?._id);
      if (index < 0) return [order, ...orders];
      const next = [...orders];
      next[index] = order;
      return next;
    };

    const unsubAssignOrder = subscribeToMore({
      document: SUBSCRIPTION_ASSIGNED_RIDER,
      variables: { riderId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { origin, order } = subscriptionData.data.subscriptionAssignRider;
        if (origin === "new" || origin === "update") {
          return { riderOrders: upsertOrder(prev.riderOrders, order) };
        } else if (origin === "remove") {
          return {
            riderOrders: (prev.riderOrders ?? []).filter(
              (o: IOrder) => o._id !== order._id
            ),
          };
        }
        return prev;
      },
    });

    const unsubZoneOrder = subscribeToMore({
      document: SUBSCRIPTION_ZONE_ORDERS,
      variables: { zoneId: zoneIdValue },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { origin, order } = subscriptionData.data.subscriptionZoneOrders;
        if (origin === "new" || origin === "update") {
          return { riderOrders: upsertOrder(prev.riderOrders, order) };
        }
        return prev;
      },
    });

    return () => {
      try {
        unsubZoneOrder();
      } catch (err) {
        console.log("err in unsubZoneOrder", err);
      }
      try {
        unsubAssignOrder();
      } catch (err) {
        console.log("err in unsubAssignOrder", err);
      }
    };
  }, [dataProfile, subscribeToMore, userId, zoneId]);

  useEffect(() => {
    if (!userId) return;

    refetchProfile({ id: userId });
    refetchAssigned({ userId });
  }, [refetchProfile, refetchAssigned, userId]);

  useEffect(() => {
    const listener = asyncStorageEmitter.addListener("rider-id", (data) => {
      setUserId(data?.value ?? "");
    });

    getUserId();
    return () => {
      if (listener) {
        listener.removeListener("rider-id", () => {
          console.log("Rider Id listerener removed");
        });
      }
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        modalVisible,
        riderOrderEarnings,
        setModalVisible,
        setRiderOrderEarnings,
        userId,
        loadingProfile,
        errorProfile,
        dataProfile: dataProfile?.rider ?? null,
        loadingAssigned,
        errorAssigned,
        assignedOrders:
          loadingAssigned || errorAssigned ? [] : dataAssigned?.riderOrders,
        refetchAssigned,
        refetchProfile,
        networkStatusAssigned,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const UserConsumer = UserContext.Consumer;
export const useUserContext = () => useContext(UserContext);
export default UserContext;
