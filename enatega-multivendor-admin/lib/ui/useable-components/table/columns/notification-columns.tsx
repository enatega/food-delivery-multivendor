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

export const NOTIFICATIONS_TABLE_COLUMNS = () => {
  // Toast
  const { showToast } = useContext(ToastContext);

  // Mutations
  const [sendNotificationUser, { loading }] = useMutation(
    SEND_NOTIFICATION_USER,
    {
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Resend Notification',
          message: 'The notification has been resent successfully',
        });
      },
      onError: (err) => {
        showToast({
          type: 'error',
          title: 'Resend Notification',
          message:
            err?.cause?.message ||
            'An error occured while resending the notification',
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
        headerName: 'Title',
        propertyName: 'title',
      },
      {
        headerName: 'description',
        propertyName: 'body',
      },
      {
        headerName: 'Date',
        propertyName: 'createdAt',
        body: (rowData: INotification) => {
          const seconds = parseInt(rowData.createdAt);
          const newDate = new Date(seconds).toDateString();
          return <span>{newDate}</span>;
        },
      },
      {
        headerName: 'Change Status',
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
