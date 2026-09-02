// Components
import { INotification } from '@/lib/utils/interfaces/notification.interface';
import CustomButton from '../../button';

// Hooks
import { useContext, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';

// GrahpQL
import { GET_NOTIFICATIONS, SEND_NOTIFICATION_USER } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import { useTranslations } from 'next-intl';

export const NOTIFICATIONS_TABLE_COLUMNS = () => {
  // Hooks
  const t = useTranslations();
  const { showToast } = useContext(ToastContext);
  const [resendingId, setResendingId] = useState<string | null>(null);

  // Mutations
  const [sendNotificationUser] = useMutation(
    SEND_NOTIFICATION_USER,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Resend Notification'),
          message: t('The notification has been resent successfully'),
        });
      },
      onError: (err) => {
        showToast({
          type: 'error',
          title: t('Resend Notification'),
          message:
            err?.cause?.message ||
            t('An error occured while resending the notification'),
        });
      },
      refetchQueries: [{ query: GET_NOTIFICATIONS }],
    }
  );

  // Handlers
  async function handleResendNotification(rowData: INotification) {
    setResendingId(rowData._id);
    try {
      await sendNotificationUser({
        variables: {
          notificationTitle: rowData.title,
          notificationBody: rowData.body,
          recipientType: rowData.recipientType || 'CUSTOMER',
        },
      });
    } finally {
      setResendingId(null);
    }
  }

  const formatNotificationDate = (value: string) => {
    const date = /^\d+$/.test(value) ? new Date(Number(value)) : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(undefined, {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(date);
  };

  // Columns
  const notification_columns = useMemo(
    () => [
      {
        headerName: t('Recipient Type'),
        propertyName: 'recipientType',
        body: (rowData: INotification) => <span>{t(rowData.recipientType || 'CUSTOMER')}</span>,
      },
      {
        headerName: t('Title'),
        propertyName: 'title',
      },
      {
        headerName: t('Description'),
        propertyName: 'body',
      },
      {
        headerName: t('Date'),
        propertyName: 'createdAt',
        body: (rowData: INotification) => {
          return <span>{formatNotificationDate(rowData.createdAt)}</span>;
        },
      },
      {
        headerName: t('Change Status'),
        propertyName: 'status',
        body: (rowData: INotification) => (
          <CustomButton
            onClick={() => handleResendNotification(rowData)}
            label={t('Resend')}
            loading={resendingId === rowData._id}
            disabled={resendingId !== null}
            type="button"
            className="block self-end"
          />
        ),
      },
    ],
    [resendingId, t]
  );
  return notification_columns;
};
