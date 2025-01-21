// Core
import { useState } from 'react';

// Prime React
import { FilterMatchMode } from 'primereact/api';

// Interface and Types
import { IQueryResult } from '@/lib/utils/interfaces';
import {
  IUserResponse,
  IUsersDataResponse,
} from '@/lib/utils/interfaces/users.interface';

// Components
import { USERS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/user-columns';

//Toast
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import Table from '@/lib/ui/useable-components/table';

// GraphQL
import { GET_USERS } from '@/lib/api/graphql';
import { generateDummyUsers } from '@/lib/utils/dummy';
import UsersTableHeader from '../header/table-header';

export default function UsersMain() {
  // State - Table
  const [selectedProducts, setSelectedProducts] = useState<IUserResponse[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  // Query
  const { data, loading } = useQueryGQL(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IUsersDataResponse | undefined, undefined>;

  // For global search
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <div className="p-3">
      <Table
        header={
          <UsersTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        loading={loading}
        data={data?.users || (loading ? generateDummyUsers() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        columns={USERS_TABLE_COLUMNS()}
      />
    </div>
  );
}
