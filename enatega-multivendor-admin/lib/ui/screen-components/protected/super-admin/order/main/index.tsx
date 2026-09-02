// Hooks
import { useState, useEffect } from 'react';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useDebounce from '@/lib/hooks/useDebounce';
// Interfaces & Types
import {
  IDateFilter,
  IQueryResult,
  IPaginationVars,
} from '@/lib/utils/interfaces';
import { IOrder, IExtendedOrder } from '@/lib/utils/interfaces';
import { getGraphQLErrorMessage } from '@/lib/utils/methods/error';
import { useTranslations } from 'next-intl';

// GraphQL
import {
  GET_ALL_ORDERS_PAGINATED,
  GET_ORDER_FILTER_OPTIONS,
} from '@/lib/api/graphql';

// Components
import OrderSuperAdminTableHeader from '../header/table-header';
import OrderDetailModal from '@/lib/ui/useable-components/popup-menu/order-details-modal';
import DashboardDateFilter from '@/lib/ui/useable-components/date-filter';
import OrderTable from '../order-table';
import ApiErrorAlert from '@/lib/ui/useable-components/api-error-alert';
// Prime React
import { FilterMatchMode } from 'primereact/api';
import { DataTableRowClickEvent } from 'primereact/datatable';

export default function OrderSuperAdminMain() {
  const t = useTranslations();

  // States
  const [selectedData, setSelectedData] = useState<IExtendedOrder[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<IExtendedOrder | null>(null);
  const [dateFilter, setDateFilter] = useState<IDateFilter>({
    dateKeyword: 'All',
    startDate: `${new Date().getFullYear()}-01-01`, // Current year, January 1st
    endDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`, // Today's date
  });
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10); // For PrimeReact Table's 'rows' prop
  const [currentPage, setCurrentPage] = useState(1); // For API 'page' parameter
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const debouncedSearch = useDebounce(globalFilterValue, 600);

  const handleDateFilter = (dateFilter: IDateFilter) => {
    setDateFilter({
      ...dateFilter,
      dateKeyword: dateFilter.dateKeyword ?? '',
    });
  };

  // Only send dates when Custom filter is active, otherwise backend handles date filtering
  const queryVariables = {
    page: currentPage,
    rows: rows,
    dateKeyword: dateFilter.dateKeyword,
    starting_date:
      dateFilter.dateKeyword === 'Custom' ? dateFilter.startDate : undefined,
    ending_date:
      dateFilter.dateKeyword === 'Custom' ? dateFilter.endDate : undefined,
    orderStatus: selectedActions.length > 0 ? selectedActions : undefined,
    search: debouncedSearch,
    restaurantId: selectedRestaurantId ?? undefined,
    riderId: selectedRiderId ?? undefined,
  };

  const {
    data: filterOptionsData,
    loading: filterOptionsLoading,
  } = useQueryGQL(GET_ORDER_FILTER_OPTIONS, {}, {
    fetchPolicy: 'cache-first',
  }) as IQueryResult<
    | {
        orderFilterOptions: {
          restaurants: Array<{ _id: string; name: string }>;
          riders: Array<{
            _id: string;
            name: string;
            username?: string;
            phone?: string;
          }>;
        };
      }
    | undefined,
    Record<string, never>
  >;

  const {
    data: paginatedData,
    error: paginatedError,
    loading: paginatedLoading,
    refetch: refetchPaginated,
  } = useQueryGQL(
    GET_ALL_ORDERS_PAGINATED,
    queryVariables,
    {
      fetchPolicy: 'cache-and-network',
    }
  ) as IQueryResult<
    | {
        allOrdersPaginated: {
          totalCount: number;
          currentPage: number;
          totalPages: number;
          prevPage: number;
          nextPage: number;
          orders: IOrder[];
        };
      }
    | undefined,
    IPaginationVars
  >;

  const [filters, setFilters] = useState({
    global: {
      value: '' as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  useEffect(() => {
    if (!paginatedLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, paginatedLoading]);

  useEffect(() => {
    setFirst(0);
    setCurrentPage(1);
  }, [
    dateFilter,
    debouncedSearch,
    selectedActions,
    selectedRestaurantId,
    selectedRiderId,
  ]);

  // For global search - updates filters for PrimeReact DataTable
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleRowClick = (event: DataTableRowClickEvent) => {
    const selectedOrder = event?.data as IExtendedOrder;
    setSelectedOrder(selectedOrder);
    setIsModalOpen(true);
  };

  const handleRefetch = () => {
    refetchPaginated({
      page: currentPage,
      rows: rows,
    });
  };

  return (
    <div className="p-3 screen-container">
      {
        <>
          <OrderSuperAdminTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
            dateFilter={dateFilter}
            handleDateFilter={handleDateFilter}
            restaurants={filterOptionsData?.orderFilterOptions?.restaurants ?? []}
            riders={filterOptionsData?.orderFilterOptions?.riders ?? []}
            filtersLoading={filterOptionsLoading}
            selectedRestaurantId={selectedRestaurantId}
            selectedRiderId={selectedRiderId}
            setSelectedRestaurantId={setSelectedRestaurantId}
            setSelectedRiderId={setSelectedRiderId}
          />
          <DashboardDateFilter
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </>
      }
      {!paginatedError && (
        <OrderTable
          data={paginatedData?.allOrdersPaginated}
          loading={paginatedLoading}
          isInitialLoad={isInitialLoad}
          handleRowClick={handleRowClick}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          first={first}
          rows={rows}
          filters={filters}
          globalFilterValue={globalFilterValue}
          onPage={(e) => {
            setFirst(e.first);
            setRows(Math.min(e.rows, 100));
            setCurrentPage((e.page ?? 0) + 1);
          }}
        />
      )}
      <OrderDetailModal
        visible={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        restaurantData={selectedOrder}
      />

      <ApiErrorAlert
        error={getGraphQLErrorMessage(paginatedError)}
        refetch={handleRefetch}
        queryName={'GET_ALL_ORDERS_PAGINATED'}
        title={t('Error')}
      />
    </div>
  );
}
