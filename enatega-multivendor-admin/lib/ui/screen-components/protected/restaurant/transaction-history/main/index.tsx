/* eslint-disable @typescript-eslint/no-explicit-any */
// Core

import { useContext, useEffect, useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Components
import Table from '@/lib/ui/useable-components/table';
import { TRANSACTION_HISTORY_COLUMNS } from '@/lib/ui/useable-components/table/columns/transaction-history-columns';

// Interfaces
import {
  ITransactionHistory,
  ITransactionHistoryResponse,
  ITransactionHistoryFilters,
  UserTypeEnum,
  IQueryResult,
} from '@/lib/utils/interfaces';
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

// GraphQL
import { GET_TRANSACTION_HISTORY } from '@/lib/api/graphql';
import { useQuery } from '@apollo/client';
import { generateSkeletonTransactionHistory } from '@/lib/utils/dummy';
import TransactionDetailModal from '@/lib/ui/useable-components/popup-menu/transaction-history-modal.module';
import TransactionHistoryStoreTableHeader from '../header/table-header';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';
import useDebounce from '@/lib/hooks/useDebounce';

export default function TransactionHistoryStoreMain() {
  // Hooks
  const t = useTranslations();

  // States
  const [selectedTransactions, setSelectedTransactions] = useState<
    ITransactionHistory[]
  >([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: {
      value: null as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  // Hooks
  const debouncedSearch = useDebounce(globalFilterValue);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateFilters, setDateFilters] = useState<ITransactionHistoryFilters>({
    startingDate: '',
    endingDate: '',
    userId: '',
  });
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;
  const [openMenuId, setOpenMenuId] = useState<string>('');

  // Query with proper typing
  const { data, loading, refetch } = useQuery(GET_TRANSACTION_HISTORY, {
    variables: {
      pageSize: pageSize, // Required field
      pageNo: currentPage, // Required field
      startingDate: dateFilters.startingDate || undefined,
      endingDate: dateFilters.endingDate || undefined,
      userId: restaurantId,
      userType: UserTypeEnum.STORE,
    },
  }) as unknown as IQueryResult<ITransactionHistoryResponse | undefined, any>;

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

  // Action menu items
  const menuItems: IActionMenuItem<ITransactionHistory>[] = [
    {
      label: t('View Details'),
      command: (data?: ITransactionHistory) => {
        if (data) {
          setSelectedTransaction(data);
          setIsModalOpen(true);
        }
      },
    },
  ];

  // Safely access data with proper typing
  const transactionData = data?.transactionHistory?.data;

  useEffect(() => {
    refetch({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="p-3">
      <Table
        header={
          <TransactionHistoryStoreTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            dateFilters={dateFilters}
            setDateFilters={setDateFilters}
          />
        }
        data={
          transactionData ||
          (loading ? generateSkeletonTransactionHistory() : [])
        }
        filters={filters}
        setSelectedData={setSelectedTransactions}
        selectedData={selectedTransactions}
        loading={loading}
        columns={TRANSACTION_HISTORY_COLUMNS({
          menuItems,
          openMenuId,
          setOpenMenuId,
        })}
        totalRecords={data?.transactionHistory?.pagination?.total}
        onPageChange={onPageChange}
        currentPage={currentPage}
        rowsPerPage={pageSize}
      />
      <TransactionDetailModal
        visible={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
