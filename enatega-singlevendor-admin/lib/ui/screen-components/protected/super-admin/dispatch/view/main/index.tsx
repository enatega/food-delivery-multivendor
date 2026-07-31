// GraphQL
import { GET_ACTIVE_ORDERS, SUBSCRIPTION_DISPATCH_ORDER } from '@/lib/api/graphql';

//Components
import Table from '@/lib/ui/useable-components/table';
import DispatchTableHeader from '../header/table-header';

//Inrfaces
import {
  IActiveOrders,
  IGetActiveOrders,
} from '@/lib/utils/interfaces/dispatch.interface';

//Hooks
import { useEffect, useRef, useState } from 'react';

// Constants
import { DISPATCH_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/dispatch-columns';
import { useQuery, useSubscription } from '@apollo/client';

export default function DispatchMain() {
  // States
  const [selectedData, setSelectedData] = useState<IActiveOrders[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

  // Ref for debouncing subscription-driven refreshes
  const refetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Filters
  // const filters = {
  //   global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
  //   orderStatus: {
  //     value: selectedActions.length > 0 ? selectedActions : null,
  //     matchMode: FilterMatchMode.IN,
  //   },
  // };

  // Queries
  const {
    data: active_orders_data,
    loading: active_orders_loading,
    refetch,
  } = useQuery<
    IGetActiveOrders | undefined,
    {
      page: number;
      rowsPerPage: number;
      search: string;
      actions: string[];
      restaurantId?: string;
    }
  >(GET_ACTIVE_ORDERS, {
    variables: {
      restaurantId: '',
      page: page,
      rowsPerPage: rowsPerPage,
      search: search,
      actions: selectedActions,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: false,
  });

  // Subscription keeps the table current without continuous polling.
  const { data: subscriptionData } = useSubscription(
    SUBSCRIPTION_DISPATCH_ORDER,
    {
      onError: (error) => {
        console.error('❌ Subscription error:', error);
      },
    }
  );

  // Handle subscription data
  useEffect(() => {
    if (subscriptionData) {
      console.log('🔥 Real-time order update received via WebSocket!');

      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }

      refetchTimeoutRef.current = setTimeout(() => {
        if (refetch) {
          refetch();
        }
      }, 500);
    }
  }, [subscriptionData, refetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, []);

  const showInitialLoading =
    active_orders_loading && !active_orders_data?.getActiveOrders;

  return (
    <div className="p-3">
      <Table
        columns={DISPATCH_TABLE_COLUMNS()}
        data={active_orders_data?.getActiveOrders?.orders ?? []}
        loading={showInitialLoading}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e as IActiveOrders[])}
        header={
          <DispatchTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
            search={search}
            setSearch={setSearch}
          />
        }
        rowsPerPage={rowsPerPage}
        totalRecords={active_orders_data?.getActiveOrders.totalCount}
        onPageChange={(page, rowNumber) => {
          setPage(page);
          setRowsPerPage(rowNumber);
        }}
        currentPage={page}
        // filters={filters}
      />
    </div>
  );
}
