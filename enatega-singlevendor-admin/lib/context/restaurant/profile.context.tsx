import React, { createContext, useState, useEffect, useContext } from 'react';
import { GET_RESTAURANT_PROFILE } from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useQueryGQL } from '../../hooks/useQueryQL';
import {
  IQueryResult,
  IProfileContextData,
  IProfileProviderProps,
} from '../../utils/interfaces';
import { IRestaurantProfileProps } from '../../utils/interfaces';
import { ToastContext } from '@/lib/context/global/toast.context';

export const ProfileContext = createContext<IProfileContextData>(
  {} as IProfileContextData
);

export const ProfileProvider: React.FC<IProfileProviderProps> = ({
  children,
}) => {
  const { showToast } = useContext(ToastContext);
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;

  const [isUpdateProfileVisible, setIsUpdateProfileVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const restaurantProfileResponse = useQueryGQL(
    GET_RESTAURANT_PROFILE,
    { id: restaurantId },
    {
      enabled: !!restaurantId,
      fetchPolicy: 'network-only',
      debounceMs: 300,
      onCompleted: () => {
        // You can perform any actions with the fetched data here
      },
      onError: () => {
        showToast({
          type: 'error',
          title: 'Profile Fetch',
          message: 'Failed to fetch profile',
        });
      },
    }
  ) as IQueryResult<IRestaurantProfileProps | undefined, undefined>;

  const handleUpdateProfile = () => {
    setIsUpdateProfileVisible(true);
  };

  const onActiveStepChange = (activeStep: number) => {
    setActiveIndex(activeStep);
  };

  const refetchRestaurantProfile = async (): Promise<void> => {
    restaurantProfileResponse.refetch();
  };

  useEffect(() => {
    if (restaurantId) {
      restaurantProfileResponse.refetch();
    }
  }, [restaurantId]);

  const value: IProfileContextData = {
    restaurantId,
    isUpdateProfileVisible,
    setIsUpdateProfileVisible,
    handleUpdateProfile,
    restaurantProfileResponse,
    activeIndex,
    onActiveStepChange,
    refetchRestaurantProfile,
    loading: restaurantProfileResponse.loading,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
