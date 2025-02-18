// GraphQL
import { GET_ACTIVE_ORDERS } from '@/lib/api/graphql';

//Components
import Table from '@/lib/ui/useable-components/table';
import DispatchTableHeader from '../header/table-header';

//Inrfaces
import {
  IActiveOrders,
  IGetActiveOrders,
} from '@/lib/utils/interfaces/dispatch.interface';

//Hooks
import { useEffect, useState } from 'react';

// Constants
import { generateDummyDispatchOrders } from '@/lib/utils/dummy';
import { DISPATCH_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/dispatch-columns';
import { useLazyQuery } from '@apollo/client';

export default function DispatchMain() {
  // States
  const [selectedData, setSelectedData] = useState<IActiveOrders[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

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
    { data: active_orders_data, loading: active_orders_loading },
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
    onCompleted: () => {
      setIsLoading(false);
    },
    pollInterval: 3000,
  });

  // fetchPolicy: 'network-only',
  // onCompleted: () => {
  //   setIsLoading(false);
  // },
  // UseEffects
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
    setIsLoading(true);
  }, [rowsPerPage, page, selectedActions, search]);

  return (
    <div className="p-3">
      <Table
        columns={DISPATCH_TABLE_COLUMNS()}
        data={
          active_orders_data?.getActiveOrders.orders ||
          (isLoading ? generateDummyDispatchOrders() : [])
        }
        loading={isLoading || active_orders_loading}
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
