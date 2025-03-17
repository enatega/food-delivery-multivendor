// Core
import { useState, useMemo } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Components
import Table from '@/lib/ui/useable-components/table';
import WithdrawRequestTableHeader from '../header/table-header';
import { WITHDRAW_REQUESTS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/withdraw-requests-columns';

// GraphQL
import { GET_ALL_WITHDRAW_REQUESTS } from '@/lib/api/graphql';
import { useQuery } from '@apollo/client';

// Interfaces
import {
  IGetWithDrawRequestsData,
  IWithDrawRequest,
} from '@/lib/utils/interfaces/';
import { IActionMenuProps, IQueryResult } from '@/lib/utils/interfaces';
import { generateDummyWithdrawRequests } from '@/lib/utils/dummy';

export default function WithdrawRequestsSuperAdminMain({
  setVisible,
  setSelectedRequest,
}: {
  setVisible: (value: boolean) => void;
  setSelectedRequest: (request: IWithDrawRequest | undefined) => void;
}) {
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

  // Get userType from selected actions (RIDER or STORE)
  const selectedUserType = selectedActions.find((action) =>
    ['RIDER', 'STORE'].includes(action)
  );

  // Get status filter from selected actions
  const selectedStatus = selectedActions.find((action) =>
    ['REQUESTED', 'TRANSFERRED', 'CANCELLED'].includes(action)
  );

  // Query with proper typing
  const { data, loading } = useQuery(GET_ALL_WITHDRAW_REQUESTS, {
    variables: {
      pageSize: pageSize,
      pageNo: currentPage,
      userType: selectedUserType,
    },
  }) as unknown as IQueryResult<
    IGetWithDrawRequestsData | undefined,
    undefined
  >;

  // Global search handler
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Handle page change
  const onPageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const menuItems: IActionMenuProps<IWithDrawRequest>['items'] = [
    {
      label: 'Bank Details',
      command: (data?: IWithDrawRequest) => {
        if (data) {
          setSelectedRequest(data);
          setVisible(true);
        }
      },
    },
  ];

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
          <WithdrawRequestTableHeader
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
        columns={WITHDRAW_REQUESTS_TABLE_COLUMNS({
          menuItems,
          currentPage,
          pageSize,
          selectedActions,
        })}
        totalRecords={data?.withdrawRequests?.pagination?.total}
        onPageChange={onPageChange}
        currentPage={currentPage}
        rowsPerPage={pageSize}
      />
    </div>
  );
}
