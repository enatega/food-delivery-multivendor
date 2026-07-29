// GraphQL
import { GET_ACTIVE_ORDERS, SUBSCRIPTION_DISPATCH_ORDER } from '@/lib/api/graphql';

//Components
import Table from '@/lib/ui/useable-components/table';
import DispatchTableHeader from '../header/table-header';
import OrderDetailModal from '@/lib/ui/useable-components/popup-menu/order-details-modal';

//Inrfaces
import {
  IActiveOrders,
  IGetActiveOrders,
} from '@/lib/utils/interfaces/dispatch.interface';
import { IExtendedOrder } from '@/lib/utils/interfaces';

//Hooks
import { useEffect, useRef, useState } from 'react';

// Constants
import { useDispatchOrderUI } from '@/lib/ui/useable-components/table/columns/dispatch-columns';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { DataTableRowClickEvent } from 'primereact/datatable';

export default function DispatchMain() {
  // States
  const [selectedData, setSelectedData] = useState<IActiveOrders[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const hasDataRef = useRef(false);
  const [lastValidOrders, setLastValidOrders] = useState<IActiveOrders[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IExtendedOrder | null>(
    null
  );
  const { columns } = useDispatchOrderUI();

  // Ref for debouncing and polling
  const refetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

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
      shouldResubscribe: true,
    }
  );

  // Handle subscription data
  useEffect(() => {
    if (subscriptionData) {

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

  //  POLLING FALLBACK - Polls every 5 seconds
  useEffect(() => {
    // Start polling
    pollingIntervalRef.current = setInterval(() => {
      if (refetch && !active_orders_loading) {
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

  const handleRowClick = (event: DataTableRowClickEvent) => {
    const target = event.originalEvent.target as HTMLElement | null;
    if (
      target?.closest(
        '.p-dropdown, .p-dropdown-panel, .p-inputtext, .p-checkbox, button, input, a'
      )
    ) {
      return;
    }

    setSelectedOrder(event.data as IExtendedOrder);
    setIsModalOpen(true);
  };

  const activeOrders =
    showLoading
      ? []
      : active_orders_data?.getActiveOrders.orders ?? lastValidOrders;

  return (
    <div className="p-3">
      <DispatchTableHeader
        globalFilterValue={globalFilterValue}
        onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
        selectedActions={selectedActions}
        setSelectedActions={setSelectedActions}
        search={search}
        setSearch={setSearch}
      />
      <Table
        className="dispatch-responsive-table"
        columns={columns}
        data={activeOrders}
        loading={showLoading}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e as IActiveOrders[])}
        rowsPerPage={rowsPerPage}
        totalRecords={active_orders_data?.getActiveOrders.totalCount}
        handleRowClick={handleRowClick}
        moduleName="SuperAdmin-Dispatch"
        onPageChange={(nextPage, rowNumber) => {
          setPage(nextPage);
          setRowsPerPage(rowNumber);
        }}
        currentPage={page}
      />

      <OrderDetailModal
        visible={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        restaurantData={selectedOrder}
      />
    </div>
  );
}
