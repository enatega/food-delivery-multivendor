'use client';

// Components
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';
import { ISubscriptionPlan } from '@/lib/ui/screens/super-admin/subscription';

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

// GraphQL
import { useMutation } from '@apollo/client';
import { CREATE_SUBSCRIPTION_PLAN } from '@/lib/api/graphql/mutations/subscription';
import { GET_ALL_SUBSCRIPTION_PLANS } from '@/lib/api/graphql/queries/subscription';

interface ISubscriptionFormProps {
  setVisible: (visible: boolean) => void;
  isEditing: IEditState<ISubscriptionPlan>;
  visible: boolean;
  setIsEditing: (editing: IEditState<ISubscriptionPlan>) => void;
}

export default function SubscriptionForm({
  setVisible,
  isEditing,
  visible,
  setIsEditing,
}: ISubscriptionFormProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  const [createPrice, { loading: mutationLoading }] = useMutation(
    CREATE_SUBSCRIPTION_PLAN,
    {
      refetchQueries: [{ query: GET_ALL_SUBSCRIPTION_PLANS }],
      onCompleted: (result) => {
        showToast({
          title: `${isEditing.bool ? t('Edit') : t('New')} ${t('Subscription Plan')}`,
          type: 'success',
          message:
            result?.createPriceForProduct?.message ||
            t('Subscription plan added successfully'),
          duration: 2000,
        });

        setVisible(false);
        resetForm();
      },
      onError: (err) => {
        const message =
          err.graphQLErrors?.[0]?.message ||
          err.message ||
          t('Something went wrong');
        showToast({
          type: 'error',
          title: t('Error'),
          message: message,
          duration: 3000,
        });
      },
    }
  );

  // Validation Schema
  const SubscriptionFormSchema = Yup.object().shape({
    duration: Yup.number()
      .required('Duration is required')
      .min(1, 'Duration must be at least 1 month')
      .max(12, 'Duration cannot exceed 12 months'),
    price: Yup.number()
      .required('Price is required')
      .min(0, 'Price must be greater than 0'),
  });

  // Initial values
  const initialValues = {
    duration: isEditing.bool ? isEditing.data.intervalCount : 1, // Mapping intervalCount to duration
    price: isEditing.bool ? isEditing.data.amount : 0, // Mapping amount to price
  };

  // Duration options (1-12 months)
  const durationOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} ${i + 1 === 1 ? 'Month' : 'Months'}`,
    value: i + 1,
  }));

  // Reset form
  const resetForm = () => {
    setIsEditing({
      bool: false,
      data: {
        id: '',
        amount: 0,
        interval: 'month',
        intervalCount: 1,
      },
    });
  };

  return (
    <Sidebar
      visible={visible}
      onHide={() => {
        setVisible(false);
        resetForm();
      }}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={SubscriptionFormSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          try {
            await createPrice({
              variables: {
                input: {
                  amount: Number(values.price),
                  interval: 'month',
                  intervalCount: Number(values.duration),
                },
              },
            });
          } catch (err) {
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
        validateOnChange={true}
      >
        {({ errors, handleSubmit, values, isSubmitting, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="space-y-4 flex-grow">
                <h2 className="text-xl font-bold">
                  {isEditing.bool ? t('Edit') : t('Add')}{' '}
                  {t('Subscription Plan')}
                </h2>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Duration')}
                  </label>
                  <Dropdown
                    value={values.duration}
                    options={durationOptions}
                    onChange={(e) => setFieldValue('duration', e.value)}
                    placeholder={t('Select duration')}
                    className="w-full"
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                    }}
                    disabled={isSubmitting || mutationLoading}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.duration}
                    </p>
                  )}
                </div>

                <CustomNumberField
                  value={values.price}
                  name="price"
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  showLabel={true}
                  prefix="€"
                  placeholder={t('Price')}
                  onChange={setFieldValue}
                  min={0}
                  style={{
                    borderColor: errors?.price ? 'red' : '',
                  }}
                  disabled={isSubmitting || mutationLoading}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}

                {/* Reward field removed as it is not part of CreatePriceInput */}
              </div>

              <div className="mt-auto py-4">
                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white disabled:opacity-50"
                  disabled={isSubmitting || mutationLoading}
                  type="submit"
                >
                  {isSubmitting || mutationLoading ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : isEditing.bool ? (
                    t('Update')
                  ) : (
                    t('Add')
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
