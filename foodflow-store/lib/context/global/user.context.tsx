import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { requestForegroundPermissionsAsync } from "expo-location";
import { QueryResult, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { asyncStorageEmitter } from "@/lib/services";

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
    fetchPolicy: "network-only",
    variables: {
      restaurantId: userId,
    },
  }) as QueryResult<
    IStoreProfileResponse | undefined,
    { restaurantId: string }
  >;

  const getUserId = useCallback(async () => {
    const id = await AsyncStorage.getItem("store-id");
    if (id) {
      setUserId(id);
    }
  }, [userId]);

  useEffect(() => {
    const listener = asyncStorageEmitter.addListener("store-id", (data:any) => {
      setUserId(data?.value ?? "");
    });

    getUserId();

    return () => {
      if (listener) {
        listener.removeListener();
      }
    };
  }, []);

  useEffect(() => {
    if (userId) {
      refetchProfile({ restaurantId: userId });
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        modalVisible,
        setModalVisible,
        userId,
        loadingProfile,
        errorProfile,
        dataProfile: dataProfile?.restaurant ?? null,
        requestForegroundPermissionsAsync,
        setStoreOrderEarnings,
        storeOrdersEarnings,
        refetchProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const UserConsumer = UserContext.Consumer;
export const useUserContext = () => useContext(UserContext);
export default UserContext;
