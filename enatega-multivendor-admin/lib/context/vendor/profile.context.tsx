// Core
import React, { createContext, useState, useEffect, useContext } from 'react';

// Interfaces and Types
import {
  IQueryResult,
  IProfileProviderProps,
  ISingleVendorResponseGraphQL,
} from '../../utils/interfaces';

import { IVendorProfileContextData } from '@/lib/utils/interfaces/profile/vendor.profile.interface';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';
import { VendorLayoutContext } from './layout-vendor.context';

// GraphQL
import { GET_VENDOR_BY_ID } from '@/lib/api/graphql';
import { useQueryGQL } from '../../hooks/useQueryQL';

export const ProfileContext = createContext<IVendorProfileContextData>(
  {} as IVendorProfileContextData
);

export const ProfileProvider: React.FC<IProfileProviderProps> = ({
  children,
}) => {
  const { showToast } = useContext(ToastContext);
  const { vendorLayoutContextData } = useContext(VendorLayoutContext);
  const { vendorId } = vendorLayoutContextData;

  const [isUpdateProfileVisible, setIsUpdateProfileVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const vendorProfileResponse = useQueryGQL(
    GET_VENDOR_BY_ID,
    { id: vendorId },
    {
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
  ) as IQueryResult<ISingleVendorResponseGraphQL | undefined, undefined>;


  const handleUpdateProfile = () => {
    setIsUpdateProfileVisible(true);
  };

  const onActiveStepChange = (activeStep: number) => {
    setActiveIndex(activeStep);
  };

  const refetchVendorProfile = async (): Promise<void> => {
    vendorProfileResponse.refetch();
  };

  useEffect(() => {
    if (vendorId) {
      vendorProfileResponse.refetch();
    }
  }, [vendorId]);

  const value: IVendorProfileContextData = {
    isUpdateProfileVisible,
    setIsUpdateProfileVisible,
    handleUpdateProfile,
    vendorProfileResponse,
    activeIndex,
    onActiveStepChange,
    refetchVendorProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
