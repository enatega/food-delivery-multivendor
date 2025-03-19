import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EARNING } from '@/lib/api/graphql/queries/earnings';
import { FilterMatchMode } from 'primereact/api';
import Table from '@/lib/ui/useable-components/table';
import {
  IEarning,
  IEarningFilters,
  IEarningsMainComponentProps,
} from '@/lib/utils/interfaces';
import EarningTableHeader from '../header/table-header';
import { EARNING_COLUMNS } from '@/lib/ui/useable-components/table/columns/earning-column';
import { generateSkeletonTransactionHistory } from '@/lib/utils/dummy';
import useDebounce from '@/lib/hooks/useDebounce';

export default function EarningsMain({
  setTotalEarnings,
}: IEarningsMainComponentProps) {
  const [selectedEarnings, setSelectedEarnings] = useState<IEarning[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    global: {
      value: null as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  // Hooks
  const debouncedSearch = useDebounce(globalFilterValue);

  const [dateFilters, setDateFilters] = useState<IEarningFilters>({
    startingDate: '',
    endingDate: '',
    userType: undefined,
    userId: undefined,
    orderType: undefined,
    paymentMethod: undefined,
  });

  const { data, loading, refetch } = useQuery(GET_EARNING, {
    variables: {
      pageSize,
      pageNo: currentPage,
      startingDate: dateFilters.startingDate || undefined,
      endingDate: dateFilters.endingDate || undefined,
      search: debouncedSearch,
      userType:
        dateFilters.userType !== 'ALL' ? dateFilters.userType : undefined,
      userId: dateFilters?.userId ?? undefined,
      orderType:
        dateFilters.orderType !== 'ALL' ? dateFilters.orderType : undefined,
      paymentMethod:
        dateFilters.paymentMethod !== 'ALL'
          ? dateFilters.paymentMethod
          : undefined,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const grandTotalEarnings = data?.earnings?.data?.grandTotalEarnings;
      setTotalEarnings(grandTotalEarnings);
    },
  });

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

  const menuItems = [
    {
      label: 'View Details',
      command: () => {
        // Handle view details action
        // console.log('View details for:', data);
      },
    },
  ];

  useEffect(() => {
    refetch({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="p-4">
      <Table
        header={
          <EarningTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            dateFilters={dateFilters}
            setDateFilters={setDateFilters}
          />
        }
        data={
          data?.earnings?.data?.earnings ||
          (loading ? generateSkeletonTransactionHistory() : [])
        }
        filters={filters}
        setSelectedData={setSelectedEarnings}
        selectedData={selectedEarnings}
        loading={loading}
        columns={EARNING_COLUMNS({
          menuItems,
          isSuperAdmin: true,
        })}
        totalRecords={data?.earnings?.pagination?.total}
        onPageChange={onPageChange}
        currentPage={currentPage}
        rowsPerPage={pageSize}
      />
    </div>
  );
}
