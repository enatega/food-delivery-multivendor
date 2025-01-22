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
import { useTranslations } from 'next-intl';

export const RESTAURANT_TABLE_COLUMNS = ({
  menuItems,
}: {
  menuItems: IActionMenuProps<IRestaurantResponse>['items'];
}) => {
  // Hooks
  const t = useTranslations();

  // Context
  const { showToast } = useContext(ToastContext);

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
        title: t('Store Status'),
        message: `${t('Store has been marked as')} ${deletingRestaurant.isActive ? t('in-active') : t('active')}`,
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
        title: t('Store Status'),
        message: `${t('Store marked as')} ${isActive ? t('in-active') : t('active')} ${t('failed')}`,
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
      title: t('Store Status Change'),
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        t('Store Status Change Failed'),
      duration: 2500,
    });

    setDeletingRestaurant({
      ...deletingRestaurant,
      id: '',
    });
  }

  return [
    {
      headerName: t('Image'),
      propertyName: 'image',
      body: (restaurant: IRestaurantResponse) => {
        return (
          <Image
            width={30}
            height={30}
            alt={t('Store')}
            src={
              restaurant.image
                ? restaurant.image
                : 'https://images.unsplash.com/photo-1595418917831-ef942bd9f9ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            }
          />
        );
      },
    },
    { headerName: t('ID'), propertyName: 'unique_restaurant_id' },
    { headerName: t('Name'), propertyName: 'name' },
    { headerName: t('Vendor'), propertyName: 'username' },
    {
      headerName: t('Email'),
      propertyName: 'owner.email',
    },
    { headerName: t('Address'), propertyName: 'address' },
    {
      headerName: t('Status'),
      propertyName: 'actions',
      body: (rowData: IRestaurantResponse) => {
        return (
          <CustomInputSwitch
            className="prevent-row-click"
            loading={rowData?._id === deletingRestaurant?.id}
            isActive={rowData.isActive}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();
              onHandleRestaurantStatusChange(rowData.isActive, rowData._id);
            }}
          />
        );
      },
    },
    {
      headerName: t('Actions'),
      propertyName: 'actions',
      body: (rowData: IRestaurantResponse) => (
        <ActionMenu items={menuItems} data={rowData} />
      ),
    },
  ];
};
