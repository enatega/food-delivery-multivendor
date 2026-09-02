import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_EARNING_FOR_STORE } from '@/lib/api/graphql/queries/earnings';
import { FilterMatchMode } from 'primereact/api';
import Table from '@/lib/ui/useable-components/table';
import {
  IEarning,
  IEarningFilters,
  IEarningsRestaurantMainComponentProps,
} from '@/lib/utils/interfaces/earnings.interface';
import { EARNING_COLUMNS } from '@/lib/ui/useable-components/table/columns/earning-column';
import { generateSkeletonTransactionHistory } from '@/lib/utils/dummy';
import EarningRestaurantTableHeader from '../header/table-header';
import { UserTypeEnum } from '@/lib/utils/interfaces';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';
import useDebounce from '@/lib/hooks/useDebounce';

export default function EarningsRestaurantMain({
  setTotalEarnings,
}: IEarningsRestaurantMainComponentProps) {
  // Hooks
  const t = useTranslations();

  // States
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

  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;

  const [dateFilters, setDateFilters] = useState<IEarningFilters>({
    startingDate: '',
    endingDate: '',
    userType: undefined,
    orderType: undefined,
    paymentMethod: undefined,
  });

  const { data, loading, refetch } = useQuery(GET_EARNING_FOR_STORE, {
    variables: {
      pageSize,
      pageNo: currentPage,
      startingDate: dateFilters.startingDate || undefined,
      endingDate: dateFilters.endingDate || undefined,
      userType: UserTypeEnum.STORE,
      search: debouncedSearch,
      orderType:
        dateFilters.orderType !== 'ALL' ? dateFilters.orderType : undefined,
      paymentMethod:
        dateFilters.paymentMethod !== 'ALL'
          ? dateFilters.paymentMethod
          : undefined,
      userId: restaurantId,
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
      label: t('View Details'),
      command: () => {
        // Handle view details action
        // console.log('View details for:', data); removing consoles please uncomment when continuing
      },
    },
  ];

  const clearAllFilters = () => {
      setDateFilters({
        startingDate: '',
        endingDate: '',
        userType: undefined,
        userId: undefined,
        orderType: undefined,
        paymentMethod: undefined,
      });
      setGlobalFilterValue('');
      setFilters({
        global: {
          value: null,
          matchMode: FilterMatchMode.CONTAINS,
        },
      });
    };

  useEffect(() => {
    refetch({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="p-4">
      <Table
        header={
          <EarningRestaurantTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            dateFilters={dateFilters}

            setDateFilters={setDateFilters} 
            onClearFilters={clearAllFilters}          

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
        columns={EARNING_COLUMNS({ menuItems, isSuperAdmin: false })}
        totalRecords={data?.earnings?.pagination?.total}
        onPageChange={onPageChange}
        currentPage={currentPage}
        rowsPerPage={pageSize}
      />
    </div>
  );
}
