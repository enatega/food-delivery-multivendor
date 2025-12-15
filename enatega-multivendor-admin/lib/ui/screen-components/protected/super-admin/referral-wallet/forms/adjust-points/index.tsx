'use client';

// Components
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

// Formik
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';

// Hooks
import useToast from '@/lib/hooks/useToast';
import { useTranslations } from 'next-intl';

interface IAdjustPointsFormProps {
  setVisible: (visible: boolean) => void;
  visible: boolean;
}

interface IUser {
  _id: string;
  name: string;
  avatar?: string;
}

export default function AdjustPointsForm({
  setVisible,
  visible,
}: IAdjustPointsFormProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // Validation Schema
  const AdjustPointsSchema = Yup.object().shape({
    userId: Yup.string().required('User is required'),
    points: Yup.number()
      .required('Points are required')
      .notOneOf([0], 'Points cannot be zero'),
    reason: Yup.string().required('Reason is required'),
  });

  // Initial values
  const initialValues = {
    userId: '',
    points: 0,
    reason: '',
  };

  // Mock users - Replace with actual GraphQL query
  const allUsers: IUser[] = [
    {
      _id: 'user1',
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      _id: 'user2',
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/40',
    },
    {
      _id: 'user3',
      name: 'Mike Johnson',
      avatar: 'https://via.placeholder.com/40',
    },
  ];

  // Reason options
  const reasonOptions = [
    { label: t('System Correction'), value: 'system_correction' },
    { label: t('Referral Correction'), value: 'referral_correction' },
    { label: t('Order Correction'), value: 'order_correction' },
    { label: t('Bonus or Compensation'), value: 'bonus_compensation' },
  ];

  // User option template
  const userOptionTemplate = (option: IUser) => {
    return (
      <div className="flex items-center gap-2">
        {option.avatar && (
          <img
            src={option.avatar}
            alt={option.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
        <span>{option.name}</span>
      </div>
    );
  };

  return (
    <Sidebar
      visible={visible}
      onHide={() => setVisible(false)}
      position="right"
      className="w-full sm:w-[450px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={AdjustPointsSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          // TODO: Replace with actual GraphQL mutation
          setTimeout(() => {
            showToast({
              title: t('Adjust Points'),
              type: 'success',
              message: t('Points have been adjusted successfully'),
              duration: 2000,
            });

            setVisible(false);
            resetForm();
            setSubmitting(false);
          }, 1000);
        }}
        validateOnChange={true}
      >
        {({ errors, handleSubmit, values, isSubmitting, setFieldValue }) => {
          const selectedUser =
            allUsers.find((u) => u._id === values.userId) || null;

          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h2 className="text-xl font-bold dark:text-white">{t('Adjust Points')}</h2>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('User')}
                  </label>
                  <Dropdown
                    value={selectedUser}
                    options={allUsers}
                    onChange={(e) => setFieldValue('userId', e.value._id)}
                    optionLabel="name"
                    placeholder={t('Select a user')}
                    filter
                    filterBy="name"
                    filterPlaceholder={t('Search users...')}
                    itemTemplate={userOptionTemplate}
                    valueTemplate={(option: IUser | null) => {
                      if (!option) return <span>{t('Select a user')}</span>;
                      return userOptionTemplate(option);
                    }}
                    className="w-full"
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                  {errors.userId && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.userId}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Points')}
                  </label>
                  <CustomNumberField
                    value={values.points}
                    name="points"
                    minFractionDigits={0}
                    maxFractionDigits={0}
                    min={0}
                    showLabel={false}
                    placeholder={t('Enter points')}
                    onChange={setFieldValue}
                    style={{
                      borderColor: errors?.points ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.points && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.points}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('Use positive for credit, negative for debit')}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Reason')}
                  </label>
                  <Dropdown
                    value={values.reason}
                    options={reasonOptions}
                    onChange={(e) => setFieldValue('reason', e.value)}
                    placeholder={t('Select reason')}
                    className="w-full"
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.reason}</p>
                  )}
                </div>

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 dark:border-dark-600 bg-black dark:bg-primary-color px-8 text-white hover:bg-gray-800 dark:hover:bg-primary-dark disabled:opacity-50"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : (
                    t('Submit')
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Sidebar>
  );
}
