// GraphQL
import { GET_ACTIVE_ORDERS } from '@/lib/api/graphql';

//Components
import Table from '@/lib/ui/useable-components/table';
import DispatchTableHeader from '../header/table-header';

//Inrfaces
import { ILazyQueryResult } from '@/lib/utils/interfaces';
import {
  IActiveOrders,
  IGetActiveOrders,
} from '@/lib/utils/interfaces/dispatch.interface';

//Prime react
import { FilterMatchMode } from 'primereact/api';

//Hooks
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';
import { useEffect, useState } from 'react';

// Constants
import { generateDummyDispatchOrders } from '@/lib/utils/dummy';
import { DISPATCH_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/dispatch-columns';

export default function DispatchMain() {
  // States
  const [selectedData, setSelectedData] = useState<IActiveOrders[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    orderStatus: {
      value: selectedActions.length > 0 ? selectedActions : null,
      matchMode: FilterMatchMode.IN,
    },
  };

  // Queries
  const { data: active_orders_data, fetch: fetchActiveOrders } = useLazyQueryQL(
    GET_ACTIVE_ORDERS,
    {
      fetchPolicy: 'network-only',
      onCompleted: () => {
        setIsLoading(false);
      },
    }
  ) as ILazyQueryResult<IGetActiveOrders | undefined, undefined>;

  // UseEffects
  useEffect(() => {
    fetchActiveOrders();
    setIsLoading(true);
  }, []);

  return (
    <div className="p-3">
      <Table
        columns={DISPATCH_TABLE_COLUMNS(fetchActiveOrders)}
        data={
          active_orders_data?.getActiveOrders ||
          (isLoading ? generateDummyDispatchOrders() : [])
        }
        loading={isLoading}
        selectedData={selectedData}
        setSelectedData={(e) => setSelectedData(e as IActiveOrders[])}
        header={
          <DispatchTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        filters={filters}
      />
    </div>
  );
}