import { useMemo } from 'react';
import { Tag } from 'primereact/tag';
import { IWithDrawRequest } from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl'

export const WITHDRAW_REQUESTS_ADMIN_TABLE_COLUMNS = () => {
  const t = useTranslations();
  const options = useMemo(
    () => [
      {
        code: 'REQUESTED',
        label: t('REQUESTED'),
      },
      {
        code: 'TRANSFERRED',
        label: t('TRANSFERRED'),
      },
      {
        code: 'CANCELLED',
        label: t('CANCELLED'),
      },
    ],
    [t]
  );

  return useMemo(
    () => [
      {
        headerName: t('RequestID'),
        propertyName: 'requestId',
      },
      {
        headerName: t('User Type'),
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
        headerName: t('Amount'),
        propertyName: 'requestAmount',
        body: (rowData: IWithDrawRequest) => (
          <span className="font-medium">
            ${rowData?.requestAmount?.toFixed(2)}
          </span>
        ),
      },
      {
        headerName: t('Date'),
        propertyName: 'requestTime',
        body: (rowData: IWithDrawRequest) => {
          const date = new Date(rowData.requestTime);
          const formattedDate = date?.toISOString().split('T')[0];
          return <div>{formattedDate}</div>;
        },
      },
      {
        headerName: t('Status'),
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
    [options, t]
  );
};
