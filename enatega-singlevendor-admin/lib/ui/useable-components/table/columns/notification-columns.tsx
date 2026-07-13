// Components
import { INotification } from '@/lib/utils/interfaces/notification.interface';
import CustomButton from '../../button';

// Hooks
import { useContext, useMemo } from 'react';
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

  // Mutations
  const [sendNotificationUser, { loading }] = useMutation(
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
    await sendNotificationUser({
      variables: {
        notificationTitle: rowData.title,
        notificationBody: rowData.body,
      },
    });
  }

  // Columns
  const notification_columns = useMemo(
    () => [
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
          return <span>{rowData.createdAt}</span>;
        },
      },
      {
        headerName: t('Change Status'),
        propertyName: 'status',
        body: (rowData: INotification) => (
          <CustomButton
            onClick={() => handleResendNotification(rowData)}
            label="Resend"
            loading={loading}
            type="button"
            className="block self-end"
          />
        ),
      },
    ],
    []
  );
  return notification_columns;
};
