'use client';

// Core
import { createContext, useContext, useEffect, useState } from 'react';

// Interface
import {
  IProvider,
  IQueryResult,
  IRestaurantByOwner,
  IRestaurantContextData,
  IRestaurantContextProps,
  IRestaurantsByOwnerResponseGraphQL,
  IVendorLayoutRestaurantContextData,
} from '@/lib/utils/interfaces';
import { GET_RESTAURANTS_BY_OWNER } from '@/lib/api/graphql';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { onFilterObjects } from '@/lib/utils/methods';
import { VendorLayoutContext } from './layout-vendor.context';

// Types

export const VendorLayoutRestaurantContext =
  createContext<IRestaurantContextProps>({} as IRestaurantContextProps);

export const VendorLayoutRestaurantProvider = ({ children }: IProvider) => {
  // Context
  const {
    vendorLayoutContextData: { vendorId },
  } = useContext(VendorLayoutContext);
  // States
  const [restaurantContextData, setRestaurantContextData] =
    useState<IVendorLayoutRestaurantContextData>({
      id: '',
      filtered: [] as IRestaurantByOwner[] | undefined,
      globalFilter: '',
      isEditing: false,
      autoCompleteAddress: '',
    });

  const [isRestaurantFormVisible, setRestaurantFormVisible] =
    useState<boolean>(false);
  // Form Flow
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isRestaurantModifed, setRestaurantModifed] = useState<boolean>(false);

  // API
  const restaurantByOwnerResponse = useQueryGQL(
    GET_RESTAURANTS_BY_OWNER,
    {
      id: vendorId,
    },
    {
      enabled: !!vendorId,
      debounceMs: 300,
      onCompleted: (data: unknown) => {
        const _data = data as IRestaurantsByOwnerResponseGraphQL;
        onSetRestaurantContextData({
          id: _data?.restaurantByOwner?.restaurants[0]?._id ?? '',
        });
      },
    }
  ) as IQueryResult<IRestaurantsByOwnerResponseGraphQL | undefined, undefined>;

  const onActiveStepChange = (activeStep: number) => {
    setActiveIndex(activeStep);
  };

  const onClearRestaurntsData = () => {
    setActiveIndex(0);
  };

  const onSetRestaurantFormVisible = (status: boolean) => {
    setRestaurantFormVisible(status);
  };

  const onSetRestaurantContextData = (
    data: Partial<IRestaurantContextData>
  ) => {
    setRestaurantContextData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const onHandlerFilterData = () => {
    const _filtered: IRestaurantByOwner[] = onFilterObjects(
      restaurantByOwnerResponse?.data?.restaurantByOwner?.restaurants ?? [],
      restaurantContextData?.globalFilter ?? '',
      ['name', 'address', 'shopType']
    );

    onSetRestaurantContextData({
      filtered: _filtered,
    });
  };

  // Use Effect
  useEffect(() => {
    onHandlerFilterData();
  }, [restaurantContextData?.globalFilter, isRestaurantModifed]);

  useEffect(() => {
    restaurantByOwnerResponse.refetch();
  }, [vendorId]);

  const value: IRestaurantContextProps = {
    // Vendor Information
    vendorId,
    // Form Visibility
    isRestaurantFormVisible,
    onSetRestaurantFormVisible,
    // Restaurant Data
    restaurantByOwnerResponse,
    restaurantContextData,
    onSetRestaurantContextData,
    // Navigation and State Management
    activeIndex,
    onActiveStepChange,
    onClearRestaurntsData,
    isRestaurantModifed,
    setRestaurantModifed,
  };

  return (
    <VendorLayoutRestaurantContext.Provider value={value}>
      {children}
    </VendorLayoutRestaurantContext.Provider>
  );
};
