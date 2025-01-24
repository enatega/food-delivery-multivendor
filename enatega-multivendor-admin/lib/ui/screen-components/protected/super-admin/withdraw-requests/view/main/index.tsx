//GraphQL
import { GET_ALL_WITHDRAW_REQUESTS } from '@/lib/api/graphql';

// Interfaces
import { ILazyQueryResult } from '@/lib/utils/interfaces';
import {
  IGetWithDrawRequestsData,
  IWithDrawRequest,
} from '@/lib/utils/interfaces/withdraw-request.interface';

// Hooks
import { useLazyQueryQL } from '@/lib/hooks/useLazyQueryQL';
import { useEffect, useState } from 'react';

// Prime react
import { FilterMatchMode } from 'primereact/api';

// Components
import Table from '@/lib/ui/useable-components/table';

// Constants
import WithdrawRequestTableHeader from '../header/table-header';
import { generateDummyWithdrawRequests } from '@/lib/utils/dummy';
import { WITHDRAW_REQUESTS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/withdraw-requests-columns';

export default function WithdrawRequestsMain() {
  // States
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<IWithDrawRequest[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  // Queries
  const { fetch, data, loading } = useLazyQueryQL(GET_ALL_WITHDRAW_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  }) as ILazyQueryResult<IGetWithDrawRequestsData | undefined, undefined>;

  // Filters
  const filters = {
    global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
    status: {
      value: selectedActions.length > 0 ? selectedActions : null,
      matchMode: FilterMatchMode.IN,
    },
  };

  // UseEffects
  useEffect(() => {
    fetch();
  }, []);

  return (
    <div className="p-3">
      <Table
        data={
          data?.getAllWithdrawRequests?.data ||
          (loading ? generateDummyWithdrawRequests() : [])
        }
        columns={WITHDRAW_REQUESTS_TABLE_COLUMNS()}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        header={
          <WithdrawRequestTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={(e) => setGlobalFilterValue(e.target.value)}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        filters={filters}
        loading={loading}
      />
    </div>
  );
}
