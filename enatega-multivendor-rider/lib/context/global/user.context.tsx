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
  useEffect(() => {
    const riderId = dataProfile?.rider?._id ?? userId;
    const zoneIdValue = dataProfile?.rider?.zone?._id ?? zoneId;

    if (!riderId || !zoneIdValue) return;

    const subscribeNewOrders = {
      unsubAssignOrder: subscribeToMore({
        document: SUBSCRIPTION_ASSIGNED_RIDER,
        variables: { riderId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          if (subscriptionData.data.subscriptionAssignRider.origin === "new") {
            return {
              riderOrders: [
                subscriptionData.data.subscriptionAssignRider.order,
                ...prev.riderOrders,
              ],
            };
          } else if (
            subscriptionData.data.subscriptionAssignRider.origin === "remove"
          ) {
            return {
              riderOrders: [
                ...prev.riderOrders.filter(
                  (o: IOrder) =>
                    o._id !==
                    subscriptionData.data.subscriptionAssignRider.order._id
                ),
              ],
            };
          }
          return prev;
        },
      }),

      unsubZoneOrder: subscribeToMore({
        document: SUBSCRIPTION_ZONE_ORDERS,
        variables: { zoneId: zoneIdValue },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          if (subscriptionData.data.subscriptionZoneOrders.origin === "new") {
            return {
              riderOrders: [
                subscriptionData.data.subscriptionZoneOrders.order,
                ...prev.riderOrders,
              ],
            };
          }
          return prev;
        },
      }),
    };

    const { unsubZoneOrder, unsubAssignOrder } = subscribeNewOrders;
    return () => {
      if (zoneIdValue) {
        setZoneId(zoneIdValue);
        try {
          unsubZoneOrder();
        } catch (err) {
          console.log("err in unsubZoneOrder", err);
        }
      }

      if (unsubAssignOrder) {
        try {
          unsubAssignOrder();
        } catch (err) {
          console.log("err in unsubAssignOrder", err);
        }
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
