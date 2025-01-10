'use client';

// Core
import Image from 'next/image';
import { useContext, useState } from 'react';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// Apollo Client
import { ApolloError, useMutation } from '@apollo/client';

// Custom Components
import CustomInputSwitch from '../../custom-input-switch';

// Interfaces
import { IActionMenuProps, IRestaurantResponse } from '@/lib/utils/interfaces';

// GraphQL Queries and Mutations
import { DELETE_RESTAURANT } from '@/lib/api/graphql';

// Components
import ActionMenu from '../../action-menu';
import { useRouter } from 'next/navigation';

export const RESTAURANT_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IRestaurantResponse>['items'];
}) => {
  // Context
  const { showToast } = useContext(ToastContext);

  // Route
  const router = useRouter();

  // State
  const [deletingRestaurant, setDeletingRestaurant] = useState<{
    id: string;
    isActive: boolean;
  }>({ id: '', isActive: false });

  // API
  const [deleteRestaurant] = useMutation(DELETE_RESTAURANT, {
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Store Status',
        message: `Store has been marked as ${deletingRestaurant.isActive ? 'in-active' : 'active'}`,
        duration: 2000,
      });
    },
    onError,
  });

  // Handle checkbox change
  const onHandleRestaurantStatusChange = async (
    isActive: boolean,
    id: string
  ) => {
    try {
      setDeletingRestaurant({
        id,
        isActive,
      });
      await deleteRestaurant({ variables: { id: id } });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Store Status',
        message: `Store marked as ${isActive ? 'in-active' : 'active'} failed`,
        duration: 2000,
      });
    } finally {
      setDeletingRestaurant({
        ...deletingRestaurant,
        id: '',
      });
    }
  };

  function onError({ graphQLErrors, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: 'Store Status Change',
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        'Store Status Change Failed',
      duration: 2500,
    });

    setDeletingRestaurant({
      ...deletingRestaurant,
      id: '',
    });
  }

  return [
    {
      headerName: 'Image',
      propertyName: 'image',
      body: (restaurant: IRestaurantResponse) => {
        return (
          <Image
            width={30}
            height={30}
            alt="Store"
            src={
              restaurant.image
                ? restaurant.image
                : 'https://images.unsplash.com/photo-1595418917831-ef942bd9f9ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
          />
        );
      },
    },
    { headerName: 'ID', propertyName: 'unique_restaurant_id' },
    { headerName: 'Name', propertyName: 'name' },
    { headerName: 'Vendor', propertyName: 'username' },
    {
      headerName: 'Email',
      propertyName: 'owner.email',
    },
    { headerName: 'Address', propertyName: 'address' },
    {
      headerName: 'Status',
      propertyName: 'actions',
      body: (rowData: IRestaurantResponse) => {
        return (
          <CustomInputSwitch
            // className="no-row-click2"
            loading={rowData?._id === deletingRestaurant?.id}
            isActive={rowData.isActive}
            onChange={async (e) => {
              e.stopPropagation();
              await onHandleRestaurantStatusChange(
                rowData.isActive,
                rowData._id
              );
            }}
          />
        );
      },
    },
    {
      headerName: 'Actions',
      propertyName: 'actions',
      body: (rowData: IRestaurantResponse) => (
        <ActionMenu items={menuItems} data={rowData} />
      ),
    },
  ];
};
