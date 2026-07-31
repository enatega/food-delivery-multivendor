'use client';
// GraphQL
import {
  GIVE_USER_CREDITS,
  EDIT_USER_CREDITS_HISTORY,
} from '@/lib/api/graphql/mutations/user-credits';
import {
  GET_ALL_USERS_DROPDOWN_SEARCH,
  GET_ALL_CREDITS_RECORDS,
} from '@/lib/api/graphql/queries/user-credits';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// Components
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import useDebounce from '@/lib/hooks/useDebounce';

// Interfaces
import { ICreditsFormProps } from '@/lib/utils/interfaces/user-credits.interface';

// Schema
import { useUserCreditsSchema } from '@/lib/utils/schema/user-credits';

// Formik
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';

// Hooks
import { useMutation, useLazyQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function UserCreditsForm({
  open,
  onClose,
  refetch,
  editData,
}: ICreditsFormProps) {
  // Hooks
  const { showToast } = useContext(ToastContext);
  const t = useTranslations();
  const userCreditsSchema = useUserCreditsSchema();

  // States
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(userSearchTerm, 500);
  const [usersOptions, setUsersOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [userSearchError, setUserSearchError] = useState('');

  // Initial values
  const initialValues = {
    userId: editData?.userId?._id || '',
    amount: editData?.amount || 0,
    orderId: editData?.orderId || '',
  };

  // Queries - Fetch users for dropdown
  const [fetchUsers, { loading: usersLoading }] = useLazyQuery(
    GET_ALL_USERS_DROPDOWN_SEARCH,
    {
      fetchPolicy: 'network-only',
      onCompleted: (responseData: {
        getAllUsersDropDownSearch: Array<{
          _id: string;
          name: string;
          email: string;
        }>;
      }) => {
        if (responseData?.getAllUsersDropDownSearch) {
          const options = responseData.getAllUsersDropDownSearch.map(
            (user: { _id: string; name: string; email: string }) => ({
              label: `${user.name || 'N/A'} (${user.email || 'N/A'})`,
              value: user._id,
            })
          );
          setUsersOptions(options);
          setUserSearchError('');
        }
      },
      onError: (err) => {
        console.error('Error fetching users:', err);
        setUserSearchError(t('Error loading users'));
      },
    }
  );

  // Debounced user search - fetch users when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm.length === 0) {
      fetchUsers({
        variables: { searchTerm: debouncedSearchTerm },
      });
    }
  }, [debouncedSearchTerm]);

  // Mutations
  const [giveCredits, { loading: giveCreditsLoading }] = useMutation(
    GIVE_USER_CREDITS,
    {
      refetchQueries: [{ query: GET_ALL_CREDITS_RECORDS }],
      onCompleted: () => {
        showToast({
          title: t('Give Credits'),
          type: 'success',
          message: t('Credits have been given successfully'),
          duration: 2000,
        });
        handleClose();
        refetch();
      },
      onError: (err) => {
        showToast({
          title: t('Give Credits'),
          type: 'error',
          message: err.message || t('Failed to give credits'),
          duration: 2000,
        });
      },
    }
  );

  const [editCredits, { loading: editCreditsLoading }] = useMutation(
    EDIT_USER_CREDITS_HISTORY,
    {
      refetchQueries: [{ query: GET_ALL_CREDITS_RECORDS }],
      onCompleted: () => {
        showToast({
          title: t('Edit Credits'),
          type: 'success',
          message: t('Credit amount has been updated successfully'),
          duration: 2000,
        });
        handleClose();
        refetch();
      },
      onError: (err) => {
        showToast({
          title: t('Edit Credits'),
          type: 'error',
          message: err.message || t('Failed to update credits'),
          duration: 2000,
        });
      },
    }
  );

  // Handlers
  const handleClose = () => {
    onClose();
    setUserSearchTerm('');
    setUsersOptions([]);
  };

  // Load initial users when form opens in create mode
  useEffect(() => {
    if (open && !editData) {
      fetchUsers({ variables: { searchTerm: '' } });
    }
  }, [open, editData]);

  return (
    <Sidebar
      visible={open}
      onHide={handleClose}
      position="right"
      className="w-full sm:w-[450px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={editData ? undefined : userCreditsSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          if (!editData) {
            // Create mode - Give credits
            await giveCredits({
              variables: {
                userId: values.userId as string,
                amount: values.amount,
                orderId: values.orderId,
                recordType: 'credit',
              },
            });
          } else {
            // Edit mode - Update amount
            await editCredits({
              variables: {
                id: editData._id,
                amount: values.amount,
              },
            });
          }

          setSubmitting(false);
        }}
        validateOnChange={true}
      >
        {({
          errors,
          handleSubmit,
          values,
          isSubmitting,
          setFieldValue,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h2 className="mb-3 text-xl font-bold">
                  {editData ? t('Edit Credits') : t('Give Credits')}
                </h2>

                {/* User Dropdown - Only shown in create mode */}
                {!editData && (
                  <div className="flex w-full flex-col justify-center gap-y-1">
                    <label className="text-sm font-[500] dark:text-white">
                      {t('Select User')} <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      value={values.userId}
                      options={usersOptions}
                      onChange={(e) => {
                        setFieldValue('userId', e.value || '');
                      }}
                      optionLabel="label"
                      placeholder={t('Search users by name or email')}
                      filter
                      filterBy="label"
                      loading={usersLoading}
                      className="w-full border dark:border-dark-600 dark:bg-dark-950 dark:text-white border-gray-300"
                      style={{
                        borderColor: errors?.userId ? 'red' : '',
                      }}
                      emptyFilterMessage={
                        userSearchError ? userSearchError : t('No users found')
                      }
                      onFilter={(e) => {
                        const searchValue = e.filter || '';
                        setUserSearchTerm(searchValue);
                      }}
                      showClear={!!values.userId}
                    />
                    {errors?.userId && (
                      <span className="text-sm text-red-500">
                        {t('Please select a user')}
                      </span>
                    )}
                  </div>
                )}

                {/* Amount Input - Shown in both modes */}
                <CustomNumberField
                  value={values.amount}
                  name="amount"
                  minFractionDigits={2}
                  maxFractionDigits={2}
                  showLabel={true}
                  placeholder={t('Amount')}
                  onChange={setFieldValue}
                  min={0.01}
                  style={{
                    borderColor: errors?.amount ? 'red' : '',
                  }}
                />

                {/* Order ID - Only shown in create mode */}
                {!editData && (
                  <div className="flex w-full flex-col justify-center gap-y-1">
                    <label className="text-sm font-[500] dark:text-white">
                      {t('Order ID')} <span className="text-red-500">*</span>
                    </label>
                    <CustomTextField
                      value={values.orderId}
                      name="orderId"
                      showLabel={false}
                      placeholder={t('Enter Order ID')}
                      type="text"
                      onChange={(e) => setFieldValue('orderId', e.target.value)}
                      style={{
                        borderColor: errors?.orderId ? 'red' : '',
                      }}
                    />
                    {errors?.orderId && (
                      <span className="text-sm text-red-500">
                        {t('Order ID is required')}
                      </span>
                    )}
                  </div>
                )}

                <button
                  className="float-end h-10 w-fit rounded-md border dark:border-dark-600 border-gray-300 bg-black px-8 text-white"
                  disabled={
                    isSubmitting || giveCreditsLoading || editCreditsLoading
                  }
                  type="submit"
                >
                  {isSubmitting || giveCreditsLoading || editCreditsLoading ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : editData ? (
                    t('Update')
                  ) : (
                    t('Give')
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
