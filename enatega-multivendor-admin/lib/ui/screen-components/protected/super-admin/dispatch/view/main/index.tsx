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
import { generateDummyDispatchOrders } from '@/lib/utils/dummy';
import { DISPATCH_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/dispatch-columns';
import { useLazyQuery, useSubscription } from '@apollo/client';

export default function DispatchMain() {
  // States
  const [selectedData, setSelectedData] = useState<IActiveOrders[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const hasDataRef = useRef(false);
  const [lastValidOrders, setLastValidOrders] = useState<IActiveOrders[]>([]);



  // Ref for debouncing and polling
  const refetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  // Filters
  // const filters = {
  //   global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
  //   orderStatus: {
  //     value: selectedActions.length > 0 ? selectedActions : null,
  //     matchMode: FilterMatchMode.IN,
  //   },
  // };

  // Queries
  const [
    fetchActiveOrders,
    { data: active_orders_data, loading: active_orders_loading, refetch },
  ] = useLazyQuery<
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
    // onCompleted: () => {
    //   setIsLoading(false);
    // },
    fetchPolicy: 'network-only',
  });
  const showLoading =
    !hasDataRef.current && active_orders_loading;

  useEffect(() => {
    const orders = active_orders_data?.getActiveOrders?.orders;

    if (orders?.length) {
      hasDataRef.current = true;
      setLastValidOrders(orders);
    }
  }, [active_orders_data]);


  // 🔥 SUBSCRIPTION (will attempt to use, but has fallback)
  const { data: subscriptionData } = useSubscription(
    SUBSCRIPTION_DISPATCH_ORDER,
    {
      onError: (error) => {
        console.error('❌ Subscription error:', error);
        console.log('⚠️ Falling back to polling...');
      },
      shouldResubscribe: true,
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
          console.log('📡 Refetching orders...');
          refetch();
        }
      }, 500);
    }
  }, [subscriptionData, refetch]);

  //  POLLING FALLBACK - Polls every 5 seconds
  useEffect(() => {
    // Start polling
    pollingIntervalRef.current = setInterval(() => {
      if (refetch && !active_orders_loading) {
        console.log('Polling for updates...');
        refetch();
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [refetch, active_orders_loading]);

  useEffect(() => {
    fetchActiveOrders({
      variables: {
        page,
        rowsPerPage,
        search,
        actions: selectedActions,
        restaurantId: '',
      },
    });
    // setIsLoading(true);
  }, [rowsPerPage, page, selectedActions, search, fetchActiveOrders]);


  // Cleanup
  useEffect(() => {
    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="p-3">
      <Table
        columns={DISPATCH_TABLE_COLUMNS()}
        data={
          showLoading
            ? generateDummyDispatchOrders()
            : active_orders_data?.getActiveOrders.orders ??
            lastValidOrders
        }
        loading={showLoading}
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
