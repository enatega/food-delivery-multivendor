// GraphQL
import { GET_NOTIFICATIONS, SEND_NOTIFICATION_USER } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';
import CustomButton from '@/lib/ui/useable-components/button';

//Components
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import { NotificationErrors } from '@/lib/utils/constants';

// Hooks & react interfaces
import { INotificationFormProps } from '@/lib/utils/interfaces/notification.interface';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { NotificationSchema } from '@/lib/utils/schema/notification';
import { useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import { ChangeEvent, useContext } from 'react';

export default function NotificationForm({
  setVisible,
  visible,
}: INotificationFormProps) {
  // Hooks
  const t = useTranslations();

  //Toast
  const { showToast } = useContext(ToastContext);

  //Intial state
  const initialValues = {
    title: '',
    body: '',
    recipientType: 'CUSTOMER' as const,
  };

  //Mutation
  const [sendNotificationUser] = useMutation(SEND_NOTIFICATION_USER, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
    onCompleted: (data) => {
      showToast({
        title: t('New Notification'),
        type: 'success',
        message: data?.sendNotificationUser || t('Notification has been sent successfully'),
        duration: 2500,
      });
    },
    onError: (err) => {
      showToast({
        title: t('Error Notification'),
        type: 'error',
        message: err.cause?.message || t('Something went wrong'),
        duration: 2500,
      });
    },
  });

  return (
    <Sidebar
      visible={visible}
      onHide={() => setVisible(false)}
      position="right"
      className="w-full sm:w-[450px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={NotificationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            await sendNotificationUser({
              variables: {
                notificationTitle: values.title.trim(),
                notificationBody: values.body.trim(),
                recipientType: values.recipientType,
              },
            });
            setVisible(false);
          } finally {
            setSubmitting(false);
          }
        }}
        validateOnChange={false}
      >
        {({ handleSubmit, setFieldValue, values, isSubmitting, errors }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="mb-2 flex flex-col">
                <h2 className='className="mb-3 text-xl font-bold'>
                  {t('Send Notification')}
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="recipientType" className="text-sm font-medium">
                    {t('Recipient Type')}
                  </label>
                  <Dropdown
                    inputId="recipientType"
                    value={values.recipientType}
                    options={[
                      { label: t('Customer'), value: 'CUSTOMER' },
                      { label: t('Store'), value: 'STORE' },
                      { label: t('Rider'), value: 'RIDER' },
                    ]}
                    onChange={(event) => setFieldValue('recipientType', event.value)}
                    className="w-full border border-gray-300 dark:border-dark-600"
                  />
                </div>
                <CustomTextField
                  value={values.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('title', e.target.value)
                  }
                  name="title"
                  showLabel={true}
                  placeholder={t('Title')}
                  type="text"
                  className={`${
                    onErrorMessageMatcher(
                      'title',
                      errors.title,
                      NotificationErrors
                    )
                      ? 'border border-red-500'
                      : ''
                  }`}
                />
                <CustomTextAreaField
                  value={values.body}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFieldValue('body', e.target.value)
                  }
                  showLabel={true}
                  label={t('Description')}
                  name="body"
                  placeholder={t('Add description here')}
                  className={`${
                    onErrorMessageMatcher(
                      'body',
                      errors.body,
                      NotificationErrors
                    )
                      ? 'border border-red-500'
                      : ''
                  }`}
                  rows={5}
                />

                <div className="mt-4 flex justify-end">
                  <CustomButton
                    className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                    label={t('Send')}
                    type="submit"
                    loading={isSubmitting}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Sidebar>
  );
}
