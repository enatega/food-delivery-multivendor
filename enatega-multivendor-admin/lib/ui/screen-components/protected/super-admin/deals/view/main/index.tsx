'use client';

// Core
import { useEffect, useState } from 'react';

// Hooks
import useToast from '@/lib/hooks/useToast';
import { useTranslations } from 'next-intl';

// Components
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import ErrorState from '@/lib/ui/useable-components/error-state';
import { DEALS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/deals-columns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFileAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

// PrimeReact
import { FilterMatchMode } from 'primereact/api';

// GraphQL
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { GET_ALL_FOOD_DEALS_ADMIN } from '@/lib/api/graphql/queries/food';
import {
  DELETE_FOOD_DEAL,
  UPDATE_FOOD_DEAL,
} from '@/lib/api/graphql/mutations/food-deal';

// Interfaces
import { IEditState, IActionMenuItem } from '@/lib/utils/interfaces';
import { IDeal } from '@/lib/ui/screens/super-admin/management/deals';

interface IDealsMainProps {
  setVisible: (visible: boolean) => void;
  visible: boolean;
  isEditing: IEditState<IDeal>;
  setIsEditing: (editing: IEditState<IDeal>) => void;
}

export default function DealsMain({
  setVisible,
  isEditing,
  setIsEditing,
}: IDealsMainProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // States
  const [deleteId, setDeleteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDeals, setSelectedDeals] = useState<IDeal[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
  const [restaurantId, setRestaurantId] = useState('');
  const [editDealLoading, setEditDealLoading] = useState({
    _id: '',
    bool: false,
  });

  // Get restaurantId from localStorage on client side
  useEffect(() => {
    const id = localStorage.getItem('restaurantId') || '';
    setRestaurantId(id);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(globalFilterValue);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [globalFilterValue]);

  // Fetch deals
  const {
    data: dealsData,
    loading: dealsLoading,
    error: dealsError,
    refetch,
  } = useQuery(GET_ALL_FOOD_DEALS_ADMIN, {
    variables: {
      page,
      limit,
      isActive: isActiveFilter,
      search: debouncedSearch || null,
      restaurantId,
    },
    skip: !restaurantId,
    fetchPolicy: 'cache-and-network',
  });

  const deals: IDeal[] =
    dealsData?.getAllFoodDealsAdmin?.deals?.map((deal: IDeal) => ({
      ...deal,
      _id: deal.id || deal._id,
      dealName: deal.title || deal.dealName,
      productName: deal.foodTitle || deal.productName,
      dealType: deal.discountType || deal.dealType,
      discount: deal.discountValue || deal.discount,
    })) || [];

  const totalRecords = dealsData?.getAllFoodDealsAdmin?.total || 0;

  // Delete mutation
  const [deleteFoodDeal] = useMutation(DELETE_FOOD_DEAL, {
    refetchQueries: [
      {
        query: GET_ALL_FOOD_DEALS_ADMIN,
        variables: {
          page,
          limit,
          isActive: isActiveFilter,
          search: debouncedSearch || null,
          restaurantId,
        },
      },
    ],
  });

  const [updateFoodDeal] = useMutation(UPDATE_FOOD_DEAL, {
    refetchQueries: [
      {
        query: GET_ALL_FOOD_DEALS_ADMIN,
        variables: {
          page,
          limit,
          isActive: isActiveFilter,
          search: debouncedSearch || null,
          restaurantId,
        },
      },
    ],
  });

  // Filters
  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
  };

  // Menu items
  const menuItems: IActionMenuItem<IDeal>[] = [
    {
      label: t('Edit'),
      command: (data?: IDeal) => {
        if (data) {
          setIsEditing({
            bool: true,
            data: data,
          });
          setVisible(true);
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IDeal) => {
        if (data) {
          setDeleteId(data.id || data._id);
        }
      },
    },
  ];

  // Delete handler
  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await deleteFoodDeal({
        variables: {
          id: deleteId,
        },
      });

      showToast({
        type: 'success',
        title: t('Success'),
        message: t('Deal deleted successfully'),
        duration: 3000,
      });

      setDeleteId('');
    } catch (error) {
      let message = '';
      try {
        if (error instanceof ApolloError) {
          message = error.graphQLErrors?.[0]?.message || error.message;
        } else {
          message = (error as Error).message;
        }
      } catch (err) {
        message = t('Failed to delete deal');
      }
      showToast({
        type: 'error',
        title: t('Error'),
        message,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (rowData: IDeal) => {
    setEditDealLoading({
      bool: true,
      _id: rowData._id,
    });

    const input = {
      title: rowData.title || rowData.dealName,
      discountType:
        rowData.discountType === 'percentage_off' ||
        rowData.discountType === 'PERCENTAGE'
          ? 'PERCENTAGE'
          : 'FIXED',
      food: rowData.food,
      variation: rowData.variation,
      restaurant: rowData.restaurant,
      startDate: new Date(
        typeof rowData.startDate === 'string' &&
        !isNaN(Number(rowData.startDate))
          ? Number(rowData.startDate)
          : rowData.startDate
      ).toISOString(),
      endDate: new Date(
        typeof rowData.endDate === 'string' && !isNaN(Number(rowData.endDate))
          ? Number(rowData.endDate)
          : rowData.endDate
      ).toISOString(),
      discountValue: rowData.discountValue || rowData.discount,
      isActive: !rowData.isActive,
    };

    try {
      await updateFoodDeal({
        variables: {
          id: rowData._id,
          input,
        },
      });

      showToast({
        title: t('Success'),
        type: 'success',
        message: t('Deal status has been updated successfully'),
        duration: 2000,
      });
    } catch (error) {
      console.error('Status Update Error:', error);
      let message = '';
      try {
        if (error instanceof ApolloError) {
          message = error.graphQLErrors?.[0]?.message || error.message;
        } else {
          message = (error as Error).message;
        }
      } catch (err) {
        message = t('ActionFailedTryAgain');
      }
      showToast({
        type: 'error',
        title: t('Error'),
        message,
        duration: 3000,
      });
    } finally {
      setEditDealLoading({
        _id: '',
        bool: false,
      });
    }
  };

  // Handle error
  useEffect(() => {
    if (dealsError) {
      let message = '';
      try {
        message = dealsError.graphQLErrors?.[0]?.message || dealsError.message;
      } catch (err) {
        message = t('Failed to load deals');
      }
      showToast({
        type: 'error',
        title: t('Error'),
        message,
        duration: 3000,
      });
    }
  }, [dealsError, showToast, t]);

  // UseEffects
  useEffect(() => {
    if (isEditing.bool) {
      setVisible(true);
    }
  }, [isEditing.bool]);

  // Pagination handler
  const handlePageChange = (page: number, rows: number) => {
    setPage(page);
    setLimit(rows);
  };

  // Empty state
  if (
    deals.length === 0 &&
    !dealsLoading &&
    !dealsError &&
    debouncedSearch.length === 0
  ) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex gap-4">
            <FontAwesomeIcon
              icon={faSearch}
              className="h-16 w-16 text-gray-300 dark:text-gray-600"
            />
            <FontAwesomeIcon
              icon={faFileAlt}
              className="h-16 w-16 text-gray-300 dark:text-gray-600"
            />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
            {t('No Deals Found')}
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            {t('Create and manage your deals here by adding new deals.')}
          </p>
          <button
            onClick={() => setVisible(true)}
            className="rounded-md bg-black dark:bg-primary-color px-6 py-2 text-white hover:bg-gray-800 dark:hover:bg-primary-dark"
          >
            {t('Add Deal')}
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (dealsError) {
    return (
      <ErrorState
        title={t('Error Loading Deals')}
        message={
          dealsError.graphQLErrors?.[0]?.message ||
          dealsError.message ||
          t('Failed to load deals. Please try again.')
        }
        onRetry={() => refetch()}
        retryLabel={t('Retry')}
        loadingLabel={t('Loading...')}
        loading={dealsLoading}
      />
    );
  }

  return (
    <div className="p-3">
      <div className="mb-4">
        <div className="relative w-full max-w-md">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            value={globalFilterValue}
            onChange={(e) => setGlobalFilterValue(e.target.value)}
            placeholder={t('Search deals...')}
            className="w-full rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-gray-900 dark:text-white py-2 pl-10 pr-10 text-sm focus:border-primary-color focus:outline-none focus:ring-1 focus:ring-primary-color placeholder:text-gray-500 dark:placeholder:text-gray-500"
          />
          {globalFilterValue && (
            <button
              onClick={() => setGlobalFilterValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
            >
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <Table
        columns={DEALS_TABLE_COLUMNS({
          menuItems,
          t,
          showToast,
          editDealLoading,
          handleStatusChange,
        })}
        data={deals}
        selectedData={selectedDeals}
        setSelectedData={setSelectedDeals}
        loading={dealsLoading}
        filters={filters}
        totalRecords={totalRecords}
        onPageChange={handlePageChange}
        currentPage={page}
        rowsPerPage={limit}
      />
      <CustomDialog
        loading={loading}
        visible={!!deleteId}
        onHide={() => setDeleteId('')}
        onConfirm={handleDelete}
        message={t('Are you sure you want to delete this deal?')}
      />
    </div>
  );
}
