'use client';

// Core
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApolloError, useMutation } from '@apollo/client';

// PrimeReact
import { FilterMatchMode } from 'primereact/api';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';

// Custom Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useDebounce from '@/lib/hooks/useDebounce';

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
  GET_RESTAURANTS_PAGINATED,
  GET_CLONED_RESTAURANTS_PAGINATED,
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

  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState('');
  const [duplicateId, setDuplicateId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IRestaurantResponse[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  // Debounce search to avoid too many API calls
  const debouncedSearchTerm = useDebounce(globalFilterValue, 500);

  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    action: {
      value: selectedActions.length > 0 ? selectedActions : null,
      matchMode: FilterMatchMode.IN,
    },
  };

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, currentTab]);

  // Query variables
  const queryVariables = {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearchTerm || undefined,
  };

  //Query
  const { data, loading, refetch } = useQueryGQL(
    currentTab === 'Actual' ? GET_RESTAURANTS_PAGINATED : GET_CLONED_RESTAURANTS_PAGINATED,
    queryVariables,
    {
      fetchPolicy: 'cache-and-network',
      debounceMs: 300,
    }
  ) as IQueryResult<IRestaurantsResponseGraphQL | undefined, undefined>;

  useEffect(() => {
    console.log("🚀 Store Screen Rendered");
  });

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
        // Refetch data after deletion
        refetch();
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
    }
  );

  const handleDelete = async (id: string) => {
    try {
      await hardDeleteRestaurant({ variables: { id: id } });
    } catch (err) {
      showToast({
        type: 'error',
        title: t('Store Delete'),
        message: t(`Store delete failed`),
      });
      setDeleteId('');
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number, rows: number) => {
    setCurrentPage(page);
    setRowsPerPage(rows);
  };

  // Constants
  const menuItems: IActionMenuItem<IRestaurantResponse>[] = [
    {
      label: t('View'),
      command: (data?: IRestaurantResponse) => {
        if (data) {
          onUseLocalStorage('save', 'restaurantId', data?._id);
          onUseLocalStorage('save', 'shopType', data?.shopType);
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

  // Get pagination data
  const restaurantData = currentTab === 'Actual'
    ? data?.restaurantsPaginated
    : data?.getClonedRestaurantsPaginated;

  const restaurants = restaurantData?.data || [];
  const totalRecords = restaurantData?.totalCount || 0;

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
        data={loading ? generateDummyRestaurants() : restaurants}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        columns={RESTAURANT_TABLE_COLUMNS({ menuItems })}
        loading={loading}
        rowsPerPage={rowsPerPage}
        // Server-side pagination props
        totalRecords={totalRecords}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        handleRowClick={(event: DataTableRowClickEvent) => {
          const target = event.originalEvent.target as HTMLElement | null;

          if (target?.closest('.prevent-row-click')) {
            return;
          }

          onUseLocalStorage('save', 'restaurantId', event.data._id);
          onUseLocalStorage('save', 'shopType', event.data.shopType);
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