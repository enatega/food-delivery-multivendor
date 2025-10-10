import React, { useState, useMemo } from 'react';

// Prime React
import { DataTableRowClickEvent } from 'primereact/datatable';

// Interface and Types
import {
  IUserResponse,
  IUsersDataResponse,
} from '@/lib/utils/interfaces/users.interface';

// Components
import Table from '@/lib/ui/useable-components/table';

// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/lib/api/graphql/queries/user';
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

  const { data, loading } = useQuery<IUsersDataResponse>(GET_USERS, {
    fetchPolicy: 'network-only',
  });

  const allUsers: IUserResponse[] = useMemo(() => data?.users ?? [], [data]);

  const filteredUsers = useMemo(() => {
    let currentUsers = allUsers;

    if (debouncedSearch) {
      currentUsers = currentUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    if (registrationMethodFilter.length > 0) {
      currentUsers = currentUsers.filter((user) =>
        registrationMethodFilter.flatMap(item => item.code).includes(user.userType)
      );
    }

    if (accountStatusFilter.length > 0) {
      currentUsers = currentUsers.filter((user) =>
        accountStatusFilter?.flatMap(item => item.code).includes(user.status)
      );
    }

    return currentUsers;
  }, [allUsers, debouncedSearch, registrationMethodFilter, accountStatusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, limit]);

  const totalFilteredUsers = filteredUsers.length;

  const handleRowClick = (event: DataTableRowClickEvent) => {

    router.push(`/general/users/user-detail/${event.data._id}`);
    console.log('Row clicked:', event.data);
  };



  return (
    <div className="flex flex-col gap-3 p-3 w-full overflow-auto">
      <Table
        data={paginatedUsers}
        columns={USERS_TABLE_COLUMNS()}
        rowsPerPage={limit}
        totalRecords={totalFilteredUsers}
        currentPage={currentPage}
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
