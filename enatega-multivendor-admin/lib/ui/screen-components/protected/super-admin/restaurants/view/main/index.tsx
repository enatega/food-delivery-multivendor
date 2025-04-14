'use client';

// Core
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApolloCache, ApolloError, useMutation } from '@apollo/client';

// PrimeReact
import { FilterMatchMode } from 'primereact/api';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

// Custom Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';

// Custom Components
import RestaurantDuplicateDialog from '../duplicate-dialog';
import RestaurantsTableHeader from '../header/table-header';
import Table from '@/lib/ui/useable-components/table';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';

// Constants and Interfaces
import {
  IActionMenuItem,
  IQueryResult,
  IRestaurantResponse,
  IRestaurantsResponseGraphQL,
} from '@/lib/utils/interfaces';

// GraphQL Queries and Mutations
import {
  GET_CLONED_RESTAURANTS,
  GET_RESTAURANTS,
  HARD_DELETE_RESTAURANT,
} from '@/lib/api/graphql';

// Method
import { onUseLocalStorage } from '@/lib/utils/methods';

// Dummy
import { generateDummyRestaurants } from '@/lib/utils/dummy';
import { DataTableRowClickEvent } from 'primereact/datatable';
import { useTranslations } from 'next-intl';
import { RESTAURANT_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/restaurant-column';

export default function RestaurantsMain() {
  // Hooks
  const t = useTranslations();

  // Context
  const { showToast } = useContext(ToastContext);
  const { currentTab } = useContext(RestaurantsContext);
  // Hooks
  const router = useRouter();

  const [deleteId, setDeleteId] = useState('');
  const [duplicateId, setDuplicateId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<
    IRestaurantResponse[]
  >([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    action: {
      value: selectedActions.length > 0 ? selectedActions : null,
      matchMode: FilterMatchMode.IN,
    },
  };

  //Query
  const { data, loading } = useQueryGQL(
    currentTab === 'Actual' ? GET_RESTAURANTS : GET_CLONED_RESTAURANTS,
    {},
    {
      fetchPolicy: 'network-only',
      debounceMs: 300,
    }
  ) as IQueryResult<IRestaurantsResponseGraphQL | undefined, undefined>;
  
  console.log("🚀 Store Screen Rendered")
  
  // API
  const [hardDeleteRestaurant, { loading: isHardDeleting }] = useMutation(
    HARD_DELETE_RESTAURANT,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Store Delete'),
          message: t(`Store has been deleted successfully`),
          duration: 2000,
        });
        setDeleteId('');
      },
      onError: ({ networkError, graphQLErrors }: ApolloError) => {
        showToast({
          type: 'error',
          title: t('Store Delete'),
          message:
            graphQLErrors[0]?.message ??
            networkError?.message ??
            t(`Store delete failed`),
          duration: 2500,
        });
        setDeleteId('');
      },
      update: (cache: ApolloCache<unknown>): void => {
        try {
          const cachedRestaurants =
            currentTab === 'Actual'
              ? data?.restaurants
              : data?.getClonedRestaurants;

          if (currentTab === 'Actual') {
            cache.writeQuery({
              query: GET_RESTAURANTS,
              data: {
                restaurants: [
                  ...(cachedRestaurants || []).filter(
                    (restaurant: IRestaurantResponse) =>
                      restaurant._id !== deleteId
                  ),
                ],
              },
            });
          } else {
            cache.writeQuery({
              query: GET_CLONED_RESTAURANTS,
              data: {
                getClonedRestaurants: [
                  ...(cachedRestaurants || []).filter(
                    (restaurant: IRestaurantResponse) =>
                      restaurant._id !== deleteId
                  ),
                ],
              },
            });
          }
        } finally {
          setDeleteId('');
        }
      },
    }
  );

  const handleDelete = async (id: string) => {
    try {
      hardDeleteRestaurant({ variables: { id: id } });
    } catch (err) {
      showToast({
        type: 'error',
        title: t('Store Delete'),
        message: t(`Store delete failed`),
      });
      setDeleteId('');
    }
  };

  // Constants
  const menuItems: IActionMenuItem<IRestaurantResponse>[] = [
    {
      label: t('View'),
      command: (data?: IRestaurantResponse) => {
        if (data) {
          onUseLocalStorage('save', 'restaurantId', data?._id);
          const routeStack = ['Admin'];
          onUseLocalStorage('save', 'routeStack', JSON.stringify(routeStack));
          router.push(`/admin/store/`);
        }
      },
    },
    {
      label: t('Duplicate'),
      command: (data?: IRestaurantResponse) => {
        if (data) {
          setDuplicateId(data._id);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IRestaurantResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  const _restaurants =
    currentTab === 'Actual' ? data?.restaurants : data?.getClonedRestaurants;

  return (
    <div className="p-3">
      <Table
        header={
          <RestaurantsTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        data={loading ? generateDummyRestaurants() : (_restaurants ?? [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        columns={RESTAURANT_TABLE_COLUMNS({ menuItems })}
        loading={loading}
        handleRowClick={(event: DataTableRowClickEvent) => {
          const target = event.originalEvent.target as HTMLElement | null;

          if (target?.closest('.prevent-row-click')) {
            return;
          }

          onUseLocalStorage('save', 'restaurantId', event.data._id);
          const routeStack = ['Admin'];
          onUseLocalStorage('save', 'routeStack', JSON.stringify(routeStack));
          router.push(`/admin/store/`);
        }}
      />

      <CustomDialog
        loading={isHardDeleting}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          handleDelete(deleteId);
        }}
        message={t('Are you sure you want to delete this store?')}
      />

      <RestaurantDuplicateDialog
        restaurantId={duplicateId}
        visible={!!duplicateId}
        onHide={() => {
          setDuplicateId('');
        }}
      />
    </div>
  );
}
