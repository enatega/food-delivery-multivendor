import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { requestForegroundPermissionsAsync } from "expo-location";
import { QueryResult, useQuery } from "@apollo/client";
// Interface
import {
  IStoreProfileResponse,
  IUserContextProps,
  IUserProviderProps,
} from "@/lib/utils/interfaces";

// API
import { STORE_PROFILE } from "@/lib/apollo/queries";
import {
  IStoreEarnings,
  IStoreEarningsArray,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Services
import { getStoreId, storageEmitter } from "@/lib/services";
import { STORE_ID } from "@/lib/utils/constants";

const UserContext = createContext<IUserContextProps>({} as IUserContextProps);

export const UserProvider = ({ children }: IUserProviderProps) => {
  // States
  const [modalVisible, setModalVisible] = useState<
    IStoreEarnings & { bool: boolean }
  >({
    bool: false,
    _id: "",
    date: "",
    earningsArray: [] as IStoreEarningsArray[],
    totalEarningsSum: 0,
    totalDeliveries: 0,
    totalOrderAmount: 0,
  });
  const [userId, setUserId] = useState("");
  const [storeOrdersEarnings, setStoreOrderEarnings] = useState<
    IStoreEarningsArray[] | null
  >(null);

  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
    refetch: refetchProfile,
  } = useQuery(STORE_PROFILE, {
    fetchPolicy: "cache-and-network",
    variables: {
      restaurantId: userId,
    },
  }) as QueryResult<
    IStoreProfileResponse | undefined,
    { restaurantId: string }
  >;

  const getUserId = useCallback(async () => {
    const id = await getStoreId();
    if (id) {
      setUserId(id);
    }
  }, []);

  useEffect(() => {
    const listener = storageEmitter.addListener(
      STORE_ID,
      (data: { value?: string }) => {
        setUserId(data?.value ?? "");
      },
    );

    getUserId();

    return () => {
      if (listener) {
        listener.removeListener();
      }
    };
  }, [getUserId]);

  useEffect(() => {
    if (userId) {
      refetchProfile({ restaurantId: userId });
    }
  }, [refetchProfile, userId]);

  const value = useMemo<IUserContextProps>(
    () => ({
      modalVisible,
      setModalVisible,
      userId,
      loadingProfile,
      errorProfile,
      dataProfile: dataProfile?.restaurant ?? null,
      requestForegroundPermissionsAsync,
      setStoreOrderEarnings,
      storeOrdersEarnings,
      refetchProfile,
    }),
    [
      dataProfile?.restaurant,
      errorProfile,
      loadingProfile,
      modalVisible,
      refetchProfile,
      storeOrdersEarnings,
      userId,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export const UserConsumer = UserContext.Consumer;
export const useUserContext = () => useContext(UserContext);
export default UserContext;
