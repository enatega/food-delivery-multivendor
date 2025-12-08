// Core
import { useEffect, useState } from 'react';

// PrimeReact
import { FilterMatchMode } from 'primereact/api';

// Hooks
import useToast from '@/lib/hooks/useToast';

// Custom Components
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import { BANNER_RESTAURANT_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/banners-restaurant-columns';
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';
import BannerRestaurantTableHeader from '../header/table-header';

// Interfaces and Types
import {
  IBannerRestaurantDataResponse,
  IBannerRestaurantMainComponentsProps,
  IBannerRestaurantResponse,
} from '@/lib/utils/interfaces/banner.restaurant.interface';

// GraphQL
import { DELETE_BANNER_RESTAURANT } from '@/lib/api/graphql/mutations/bannerRestaurant';
import { GET_BANNER_RESTAURANTS } from '@/lib/api/graphql/queries/bannerRestaurant';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';

export default function BannerRestaurantMain({
  setIsAddBannerVisible,
  setBanner,
  restaurantId,
}: IBannerRestaurantMainComponentsProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // State - Table
  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IBannerRestaurantResponse[]>(
    []
  );
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS }
  };

  //Query
  const {
    data,
    loading,
    refetch
  } = useQuery<
    IBannerRestaurantDataResponse,
    { restaurantId: string }
  >(GET_BANNER_RESTAURANTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      restaurantId
    },
    skip: !restaurantId
  });

  //Mutation
  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_BANNER_RESTAURANT,
    {
      refetchQueries: [
        {
          query: GET_BANNER_RESTAURANTS,
          variables: { restaurantId }
        },
      ],
    }
  );

  const menuItems: IActionMenuItem<IBannerRestaurantResponse>[] = [
    {
      label: t('Edit'),
      command: (data?: IBannerRestaurantResponse) => {
        if (data) {
          setIsAddBannerVisible(true);
          setBanner(data);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IBannerRestaurantResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  // UseEffects
  useEffect(() => {
    if (restaurantId) {
      refetch({
        restaurantId
      });
    }
  }, [restaurantId, refetch]);

  return (
    <div className="p-3">
      <Table
        header={
          <BannerRestaurantTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
          />
        }
        data={data?.bannerRestaurants || []}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        columns={BANNER_RESTAURANT_TABLE_COLUMNS({ menuItems })}
        loading={loading}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          mutateDelete({
            variables: { id: deleteId },
            onCompleted: () => {
              showToast({
                type: 'success',
                title: t('Success'),
                message: t(`Banner Deleted`),
                duration: 3000,
              });
              setDeleteId('');
            },
          });
        }}
        message={t('Are you sure you want to delete this item?')}
      />
    </div>
  );
}