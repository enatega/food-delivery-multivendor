//Hooks
import { ChangeEvent, useEffect, useState } from 'react';

//Components
import NotificationTableHeader from '../header/table-header';
import Table from '@/lib/ui/useable-components/table';

// Constants
import { NOTIFICATIONS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/notification-columns';

// GraphQL

// Interfaces
import { IQueryResult } from '@/lib/utils/interfaces';
import {
  IGetNotificationsPaginated,
} from '@/lib/utils/interfaces/notification.interface';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { GET_NOTIFICATIONS_PAGINATED } from '@/lib/api/graphql';
import useDebounce from '@/lib/hooks/useDebounce';

export default function NotificationMain() {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(globalFilterValue, 500);

  // Global filters change
  const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGlobalFilterValue(e.target.value);
  };

  const { data, loading } = useQueryGQL(GET_NOTIFICATIONS_PAGINATED, {
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearch || undefined,
  }, {
    fetchPolicy: 'network-only',
  }) as IQueryResult<IGetNotificationsPaginated | undefined, undefined>;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return (
    <div className="p-3">
      <Table
        columns={NOTIFICATIONS_TABLE_COLUMNS()}
        data={data?.notificationsPaginated?.data ?? []}
        selectedData={[]}
        setSelectedData={() => {}}
        header={
          <NotificationTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        loading={loading}
        totalRecords={data?.notificationsPaginated?.totalCount ?? 0}
        currentPage={data?.notificationsPaginated?.currentPage ?? currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={(page, rowCount) => {
          setCurrentPage(page);
          setRowsPerPage(rowCount);
        }}
      />
    </div>
  );
}
