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
import {
  STORE_PROFILE,
  STORE_PROFILE_SINGLE_VENDOR,
} from "@/lib/apollo/queries";
import {
  IStoreEarnings,
  IStoreEarningsArray,
} from "@/lib/utils/interfaces/rider-earnings.interface";

// Services
import { getStoreId, storageEmitter } from "@/lib/services";
import { useStoreMode } from "@/lib/context/global/store-mode.context";

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
  const { isSingleVendor, storeIdKey } = useStoreMode();

  const {
    loading: loadingProfile,
    error: errorProfile,
    data: dataProfile,
    refetch: refetchProfile,
  } = useQuery(isSingleVendor ? STORE_PROFILE_SINGLE_VENDOR : STORE_PROFILE, {
    fetchPolicy: "cache-and-network",
    variables: {
      restaurantId: userId,
    },
  }) as QueryResult<
    IStoreProfileResponse | undefined,
    { restaurantId: string }
  >;

  const getUserId = useCallback(async () => {
    const id = await getStoreId(storeIdKey);
    if (id) {
      setUserId(id);
    }
  }, [storeIdKey]);

  useEffect(() => {
    const listener = storageEmitter.addListener(
      storeIdKey,
      (data: { value: string | null }) => {
        setUserId(data?.value ?? "");
      },
    );

    getUserId();

    return () => {
      if (listener) {
        listener.removeListener();
      }
    };
  }, [getUserId, storeIdKey]);

  useEffect(() => {
    if (userId) {
      refetchProfile({ restaurantId: userId });
    }
  }, [refetchProfile, userId]);

  const normalizedProfile = useMemo(() => {
    const profile = dataProfile?.restaurant;
    if (!profile) return null;
    if (!isSingleVendor) return profile;

    const details = profile.bussinessDetails;
    return {
      ...profile,
      hasBusinessDetails: Boolean(
        details?.bankName ||
          details?.accountNumber ||
          details?.accountName ||
          details?.accountCode,
      ),
    };
  }, [dataProfile?.restaurant, isSingleVendor]);

  const value = useMemo<IUserContextProps>(
    () => ({
      modalVisible,
      setModalVisible,
      userId,
      loadingProfile,
      errorProfile,
      dataProfile: normalizedProfile,
      requestForegroundPermissionsAsync,
      setStoreOrderEarnings,
      storeOrdersEarnings,
      refetchProfile,
    }),
    [
      errorProfile,
      normalizedProfile,
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
