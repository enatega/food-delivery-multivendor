// Core
import { useState, useMemo, useContext } from 'react'; // Added useContext

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Components
import Table from '@/lib/ui/useable-components/table';
import { WITHDRAW_REQUESTS_ADMIN_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/withdraw-request-admin-columns';

// GraphQL
import { GET_ALL_WITHDRAW_REQUESTS } from '@/lib/api/graphql';
import { useQuery } from '@apollo/client';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context'; // Add this import

// Interfaces
import {
  IGetWithDrawRequestsData,
  IWithDrawRequest,
} from '@/lib/utils/interfaces/withdraw-request.interface';
import {
  IQueryResult,
  UserTypeEnum, // Add this import if not already present
} from '@/lib/utils/interfaces';
import { generateDummyWithdrawRequests } from '@/lib/utils/dummy';
import WithdrawRequestAdminTableHeader from '../header/table-header';

export default function WithdrawRequestsAdminMain() {
  // Get restaurant ID from context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;

  // States
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<IWithDrawRequest[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: {
      value: null as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Get status filter from selected actions
  const selectedStatus = selectedActions.find((action) =>
    ['REQUESTED', 'TRANSFERRED', 'CANCELLED'].includes(action)
  );

  // Query with proper typing and hardcoded STORE userType
  const { data, loading } = useQuery(GET_ALL_WITHDRAW_REQUESTS, {
    variables: {
      pageSize: pageSize,
      pageNo: currentPage,
      userType: UserTypeEnum.STORE, // Hardcoded to STORE
      userId: restaurantId, // Added restaurantId
    },
    fetchPolicy: 'network-only', // Add this line
  }) as unknown as IQueryResult<
    IGetWithDrawRequestsData | undefined,
    undefined
  >;

  // Rest of your code remains the same...

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onPageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Filter data based on status on the frontend
  const filteredData = useMemo(() => {
    if (!data?.withdrawRequests?.data) return [];

    let filtered = data.withdrawRequests.data;

    // Apply status filter if selected
    if (selectedStatus) {
      filtered = filtered.filter((item) => item.status === selectedStatus);
    }

    return filtered;
  }, [data?.withdrawRequests?.data, selectedStatus]);

  return (
    <div className="p-3">
      <Table
        header={
          <WithdrawRequestAdminTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        data={loading ? generateDummyWithdrawRequests() : filteredData}
        filters={filters}
        setSelectedData={setSelectedData}
        selectedData={selectedData}
        loading={loading}
        columns={WITHDRAW_REQUESTS_ADMIN_TABLE_COLUMNS()}
        totalRecords={data?.withdrawRequests?.pagination?.total}
        onPageChange={onPageChange}
        currentPage={currentPage}
        rowsPerPage={pageSize}
      />
    </div>
  );
}
