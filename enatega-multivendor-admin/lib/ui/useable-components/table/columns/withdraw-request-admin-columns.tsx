import { useMemo } from 'react';
import { Tag } from 'primereact/tag';
import { IWithDrawRequest } from '@/lib/utils/interfaces';

export const WITHDRAW_REQUESTS_ADMIN_TABLE_COLUMNS = () => {
  const options = useMemo(
    () => [
      {
        code: 'REQUESTED',
        label: 'Requested',
      },
      {
        code: 'TRANSFERRED',
        label: 'Transferred',
      },
      {
        code: 'CANCELLED',
        label: 'Cancelled',
      },
    ],
    []
  );

  return useMemo(
    () => [
      {
        headerName: 'Request ID',
        propertyName: 'requestId',
      },
      {
        headerName: 'User Type',
        propertyName: 'rider.name',
        body: (rowData: IWithDrawRequest) => (
          <div className="flex flex-col">
            <span className="font-medium">
              {rowData.rider?.name || rowData.store?.slug || '-'}
            </span>
            <span className="text-sm text-gray-500">
              {rowData.rider ? 'Rider' : 'Restaurant'}
            </span>
          </div>
        ),
      },
      {
        headerName: 'Amount',
        propertyName: 'requestAmount',
        body: (rowData: IWithDrawRequest) => (
          <span className="font-medium">
            ${rowData?.requestAmount?.toFixed(2)}
          </span>
        ),
      },
      {
        headerName: 'Date',
        propertyName: 'requestTime',
        body: (rowData: IWithDrawRequest) => {
          const date = new Date(rowData.requestTime);
          const formattedDate = date?.toISOString().split('T')[0];
          return <div>{formattedDate}</div>;
        },
      },
      {
        headerName: 'Status',
        propertyName: 'status',
        body: (rowData: IWithDrawRequest) => {
          const findSeverity = (code: string | undefined) => {
            switch (code) {
              case 'REQUESTED':
                return 'info';
              case 'TRANSFERRED':
                return 'success';
              case 'CANCELLED':
                return 'danger';
              default:
                return 'warning';
            }
          };

          const statusLabel =
            options.find((option) => option.code === rowData.status)?.label ||
            rowData.status;

          return (
            <Tag
              severity={findSeverity(String(rowData.status))}
              value={statusLabel}
              rounded
            />
          );
        },
      },
    ],
    [options]
  );
};
