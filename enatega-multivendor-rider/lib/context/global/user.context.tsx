import { QueryResult, useQuery } from "@apollo/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// Interface
import {
  IRiderProfileResponse,
  IUserContextProps,
  IUserProviderProps,
} from "@/lib/utils/interfaces";
// API
import {
  RIDER_ORDERS,
  RIDER_PROFILE,
  SINGLE_VENDOR_RIDER_ORDERS,
} from "@/lib/apollo/queries";
import {
  SINGLE_VENDOR_SUBSCRIPTION_ASSIGNED_RIDER,
  SINGLE_VENDOR_SUBSCRIPTION_ZONE_ORDERS,
  SUBSCRIPTION_ASSIGNED_RIDER,
  SUBSCRIPTION_ZONE_ORDERS,
} from "@/lib/apollo/subscriptions";
import { asyncStorageEmitter } from "@/lib/services/async-storage";
import { IOrder } from "@/lib/utils/interfaces/order.interface";
import {
  IRiderEarnings,
  IRiderEarningsArray,
} from "@/lib/utils/interfaces/rider-earnings.interface";
import { getSecureItem } from "@/lib/services/secure-storage";
import { useRiderMode } from "@/lib/context/global/rider-mode.context";
import { RIDER_SERVER_MODES } from "@/lib/mode/rider-mode";
import { isNewOrderForMode } from "@/lib/utils/order-state";

const UserContext = createContext<IUserContextProps>({} as IUserContextProps);

// Stable reference for the "no orders" case so consumers don't see a new []
// (and re-render) on every provider render.
const EMPTY_ORDERS: IOrder[] = [];

export const UserProvider = ({ children }: IUserProviderProps) => {
  const { mode, riderIdKey } = useRiderMode();
  const isSingleVendor = mode === RIDER_SERVER_MODES.SINGLE;
  const riderOrdersQuery = isSingleVendor
    ? SINGLE_VENDOR_RIDER_ORDERS
    : RIDER_ORDERS;
  const assignedRiderSubscription = isSingleVendor
    ? SINGLE_VENDOR_SUBSCRIPTION_ASSIGNED_RIDER
    : SUBSCRIPTION_ASSIGNED_RIDER;
  const zoneOrdersSubscription = isSingleVendor
    ? SINGLE_VENDOR_SUBSCRIPTION_ZONE_ORDERS
    : SUBSCRIPTION_ZONE_ORDERS;
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
  const [hasMoreAssigned, setHasMoreAssigned] = useState(true);

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
    fetchMore: fetchMoreAssigned,
  } = useQuery(riderOrdersQuery, {
    // Orders change constantly (status updates, new assignments), so every
    // fetch/refetch/poll must hit the network rather than falling back to
    // cache-first, which could serve stale order lists.
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    pollInterval: isSingleVendor ? 0 : 30000,
    skip: !userId,
    variables: isSingleVendor ? {limit: 50, offset: 0} : {userId},
  });
  const loadMoreAssigned = useCallback(async () => {
    if (!isSingleVendor || loadingAssigned || !hasMoreAssigned) return;
    const existing = dataAssigned?.riderOrders ?? [];
    const {data: nextPage} = await fetchMoreAssigned({
      variables: {limit: 50, offset: existing.length},
      updateQuery: (previous, {fetchMoreResult}) => {
        const incoming = fetchMoreResult?.riderOrders ?? [];
        const byId = new Map(
          [...(previous.riderOrders ?? []), ...incoming].map((order: IOrder) => [order._id, order]),
        );
        return {riderOrders: [...byId.values()]};
      },
    });
    setHasMoreAssigned((nextPage?.riderOrders?.length ?? 0) === 50);
  }, [dataAssigned?.riderOrders, fetchMoreAssigned, hasMoreAssigned, isSingleVendor, loadingAssigned]);
  const isRiderAvailable = Boolean(dataProfile?.rider?.available);

  const getUserId = useCallback(async () => {
    const id = await getSecureItem(riderIdKey);

    if (id) {
      setUserId(id);
    }
  }, [riderIdKey]);

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
      document: assignedRiderSubscription,
      variables: { riderId },
      onError: () => {
        void refetchAssigned();
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { origin, order } = subscriptionData.data.subscriptionAssignRider;
        if (origin === "new" || origin === "update") {
          return { riderOrders: upsertOrder(prev.riderOrders, order) };
        } else if (origin === "remove") {
          return {
            riderOrders: (prev.riderOrders ?? []).filter(
              (o: IOrder) => o._id !== order._id,
            ),
          };
        }
        return prev;
      },
    });

    const unsubZoneOrder = isRiderAvailable
      ? subscribeToMore({
          document: zoneOrdersSubscription,
          variables: { zoneId: zoneIdValue },
          onError: () => {
            void refetchAssigned();
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const { origin, order } =
              subscriptionData.data.subscriptionZoneOrders;
            if (origin === "new" || origin === "update") {
              return { riderOrders: upsertOrder(prev.riderOrders, order) };
            }
            return prev;
          },
        })
      : null;

    return () => {
      try {
        unsubZoneOrder?.();
      } catch (err) {
        if (__DEV__) {
          console.log("err in unsubZoneOrder", err);
        }
      }
      try {
        unsubAssignOrder();
      } catch (err) {
        if (__DEV__) {
          console.log("err in unsubAssignOrder", err);
        }
      }
    };
  }, [
    assignedRiderSubscription,
    dataProfile,
    isRiderAvailable,
    refetchAssigned,
    subscribeToMore,
    userId,
    zoneId,
    zoneOrdersSubscription,
  ]);

  // Only blank the list on a hard error — NOT while `loadingAssigned` is true.
  // With cache-and-network + a 30s poll + notifyOnNetworkStatusChange,
  // `loadingAssigned` flips true on every background poll while Apollo still holds
  // the previous data; clearing here made every order disappear and reappear each
  // poll (the "blink"). Memoized + falls back to the shared EMPTY_ORDERS so the
  // reference stays stable when there are no matching orders.
  const assignedOrders = useMemo<IOrder[]>(() => {
    if (errorAssigned) return EMPTY_ORDERS;
    const filtered = (dataAssigned?.riderOrders ?? EMPTY_ORDERS).filter(
      (order: IOrder) =>
        isRiderAvailable ||
        !isNewOrderForMode(order, mode) ||
        Boolean(order?.rider) ||
        Boolean(order?.isPickedUp),
    );
    return filtered.length ? filtered : EMPTY_ORDERS;
  }, [dataAssigned?.riderOrders, errorAssigned, isRiderAvailable, mode]);

  // Apollo automatically re-runs RIDER_PROFILE and RIDER_ORDERS when `skip`
  // flips to false (userId becomes available) using the new variables, so an
  // explicit refetch here would only duplicate those network requests.

  useEffect(() => {
    // Keep a single stable handler reference so the cleanup removes the exact
    // listener that was added. Previously a fresh anonymous function was passed
    // to removeListener, so it never matched and listeners leaked on every
    // remount (each firing setUserId on every rider-id storage event).
    const handleRiderId = (data?: { value?: string }) => {
      setUserId(data?.value ?? "");
    };
    asyncStorageEmitter.addListener(riderIdKey, handleRiderId);

    getUserId();
    return () => {
      asyncStorageEmitter.removeListener(riderIdKey, handleRiderId);
    };
  }, [getUserId, riderIdKey]);

  // Memoize the context value so a new object isn't created on every render.
  // UserProvider re-renders frequently (cache-and-network + 30s poll + two live
  // subscriptions); without this, every consumer re-rendered each time. The
  // setModalVisible / setRiderOrderEarnings state setters are referentially
  // stable per React, so they're intentionally omitted from the dependency list.
  const contextValue = useMemo<IUserContextProps>(
    () => ({
      modalVisible,
      riderOrderEarnings,
      setModalVisible,
      setRiderOrderEarnings,
      userId,
      setUserId,
      loadingProfile,
      errorProfile,
      dataProfile: dataProfile?.rider ?? null,
      loadingAssigned,
      errorAssigned,
      assignedOrders,
      refetchAssigned,
      loadMoreAssigned,
      hasMoreAssigned,
      refetchProfile,
      networkStatusAssigned,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      modalVisible,
      riderOrderEarnings,
      userId,
      loadingProfile,
      errorProfile,
      dataProfile,
      loadingAssigned,
      errorAssigned,
      assignedOrders,
      refetchAssigned,
      loadMoreAssigned,
      hasMoreAssigned,
      refetchProfile,
      networkStatusAssigned,
    ],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
export const UserConsumer = UserContext.Consumer;
export const useUserContext = () => useContext(UserContext);
export default UserContext;
