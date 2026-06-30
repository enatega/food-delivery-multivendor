import React, { useEffect, useMemo, useState } from 'react';

// Prime React
import { DataTableRowClickEvent } from 'primereact/datatable';

// Interface and Types
import {
  IUserResponse,
  IUsersPaginatedDataResponse,
} from '@/lib/utils/interfaces/users.interface';

// Components
import Table from '@/lib/ui/useable-components/table';

// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USERS_PAGINATED } from '@/lib/api/graphql/queries/user';
import { IDropdownSelectItem } from '@/lib/utils/interfaces';
import { USERS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/user-columns';
import { useRouter } from 'next/navigation';

interface UsersMainProps {
  debouncedSearch: string;
  registrationMethodFilter: IDropdownSelectItem[];
  accountStatusFilter: IDropdownSelectItem[];
}

export default function UsersMain({
  debouncedSearch,
  registrationMethodFilter = [],
  accountStatusFilter = [],
}: UsersMainProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const registrationMethod =
    registrationMethodFilter.length === 1
      ? String(registrationMethodFilter[0].code)
      : undefined;
  const status =
    accountStatusFilter.length === 1
      ? String(accountStatusFilter[0].code)
      : undefined;

  const { data, loading } = useQuery<IUsersPaginatedDataResponse>(
    GET_USERS_PAGINATED,
    {
      variables: {
        page: currentPage,
        limit,
        search: debouncedSearch || undefined,
        registrationMethod,
        status,
      },
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, registrationMethod, status]);

  const paginatedUsers: IUserResponse[] = useMemo(
    () => data?.usersPaginated?.data ?? [],
    [data]
  );

  const handleRowClick = (event: DataTableRowClickEvent) => {
    router.push(`/general/users/user-detail/${event.data._id}`);
  };

  return (
    <div className="flex flex-col gap-3 p-3 w-full overflow-auto">
      <Table
        data={loading ? [] : paginatedUsers}
        columns={USERS_TABLE_COLUMNS(openMenuId, setOpenMenuId)}
        rowsPerPage={limit}
        totalRecords={data?.usersPaginated?.totalCount ?? 0}
        currentPage={data?.usersPaginated?.currentPage ?? currentPage}
        onPageChange={(page, newLimit) => {
          setCurrentPage(page);
          setLimit(newLimit);
        }}
        handleRowClick={handleRowClick}
        loading={loading}
        minWidth="85rem"
      />
    </div>
  );
}
