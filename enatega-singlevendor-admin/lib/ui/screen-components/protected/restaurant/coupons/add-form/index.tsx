// Core
import { useContext } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';
import { Calendar } from 'primereact/calendar';

// Interface and Types
import { ICouponRestaurantForm } from '@/lib/utils/interfaces/forms/coupon-restaurant.form.interface';
import { ICouponRestaurantAddFormComponentProps } from '@/lib/utils/interfaces/coupons-restaurant.interface';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import Toggle from '@/lib/ui/useable-components/toggle';

// Context
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Utilities and Constants
import { CouponRestaurantFormSchema } from '@/lib/utils/schema';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import { useMutation } from '@apollo/client';
import {
  CREATE_RESTAURANT_COUPON,
  EDIT_RESTAURANT_COUPON,
} from '@/lib/api/graphql/mutations/coupons-restaurant';
import { GET_RESTAURANT_COUPONS } from '@/lib/api/graphql/queries/coupons-restaurant';
import { useTranslations } from 'next-intl';

export default function CouponsAddForm({
  onHide,
  coupon,
  position = 'right',
  isAddCouponVisible,
}: ICouponRestaurantAddFormComponentProps) {
  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // State
  const initialValues: ICouponRestaurantForm = {
    title: '',
    discount: null,
    startDate: coupon?.startDate ? new Date(coupon.startDate) : null,
    endDate: coupon?.endDate ? new Date(coupon.endDate) : null,
    enabled: true,
    ...(coupon
      ? {
          title: coupon.title,
          discount: coupon.discount,
          enabled: coupon.enabled,
        }
      : {}),
  };

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // Mutation
  const mutation = coupon ? EDIT_RESTAURANT_COUPON : CREATE_RESTAURANT_COUPON;
  const [mutate, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [
      { query: GET_RESTAURANT_COUPONS, variables: { restaurantId } },
    ],
  });

  // Form Submission
  const handleSubmit = (
    values: ICouponRestaurantForm,
    { resetForm }: FormikHelpers<ICouponRestaurantForm>
  ) => {
    mutate({
      variables: {
        restaurantId: restaurantId,
        couponInput: {
          _id: coupon ? coupon._id : '',
          title: values.title,
          discount: values.discount,
          enabled: values.enabled,
          startDate: values.startDate?.toISOString(),
          endDate: values.endDate?.toISOString(),
          couponType: 'PERCENTAGE',
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Success'),
          message: coupon ? t('Coupon updated') : t('Coupon added'),
          duration: 3000,
        });
        resetForm();
        onHide();
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = t('ActionFailedTryAgain');
        }
        showToast({
          type: 'error',
          title: t('Error'),
          message,
          duration: 3000,
        });
      },
    });
  };

  return (
    <Sidebar
      visible={isAddCouponVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[600px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {coupon ? t('Edit') : t('Add')} {t('Coupon')}
              </span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={CouponRestaurantFormSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-4 flex flex-col">
                        <CustomTextField
                          type="text"
                          name="title"
                          placeholder={t('Title')}
                          maxLength={35}
                          value={values.title}
                          onChange={handleChange}
                          showLabel={true}
                          isRequired
                          style={{
                            borderColor:
                              errors.title && touched.title ? 'red' : '',
                          }}
                        />
                        {touched.title && errors.title && (
                          <small className="text-red-500 dark:text-red-400">
                            {errors.title}
                          </small>
                        )}

                        <CustomNumberField
                          min={1}
                          max={100}
                          suffix="%"
                          placeholder={t('Discount')}
                          minFractionDigits={0}
                          maxFractionDigits={2}
                          name="discount"
                          showLabel={true}
                          isRequired
                          value={values.discount}
                          useGrouping={false}
                          onChange={setFieldValue}
                          style={{
                            borderColor:
                              errors.discount && touched.discount ? 'red' : '',
                          }}
                        />
                        {touched.discount && errors.discount && (
                          <small className="text-red-500 dark:text-red-400">
                            {errors.discount}
                          </small>
                        )}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="coupon-valid-from" className="mb-2 block text-sm font-medium">
                              Valid From <span className="text-red-500">*</span>
                            </label>
                            <Calendar
                              inputId="coupon-valid-from"
                              value={values.startDate}
                              onChange={(event) => {
                                const startDate = event.value as Date | null;
                                setFieldValue('startDate', startDate);
                                if (
                                  startDate &&
                                  values.endDate &&
                                  values.endDate <= startDate
                                ) {
                                  setFieldValue('endDate', null);
                                }
                              }}
                              showIcon
                              showTime
                              hourFormat="24"
                              dateFormat="dd/mm/yy"
                              className="w-full"
                              inputClassName="h-10 w-full text-sm dark:bg-dark-900 dark:text-white"
                            />
                            {touched.startDate && errors.startDate && (
                              <small className="text-red-500 dark:text-red-400">
                                {errors.startDate}
                              </small>
                            )}
                          </div>

                          <div>
                            <label htmlFor="coupon-valid-until" className="mb-2 block text-sm font-medium">
                              Valid Until <span className="text-red-500">*</span>
                            </label>
                            <Calendar
                              inputId="coupon-valid-until"
                              value={values.endDate}
                              onChange={(event) =>
                                setFieldValue('endDate', event.value)
                              }
                              minDate={values.startDate ?? undefined}
                              showIcon
                              showTime
                              hourFormat="24"
                              dateFormat="dd/mm/yy"
                              className="w-full"
                              inputClassName="h-10 w-full text-sm dark:bg-dark-900 dark:text-white"
                            />
                            {touched.endDate && errors.endDate && (
                              <small className="text-red-500 dark:text-red-400">
                                {errors.endDate}
                              </small>
                            )}
                          </div>
                        </div>

                        <Toggle
                          checked={values.enabled}
                          onClick={() => {
                            setFieldValue('enabled', !values.enabled);
                          }}
                          showLabel
                          placeholder={t('Status')}
                        />

                        <CustomButton
                          className="h-10 ml-auto  w-fit border dark:border-dark-600 border-gray-300 bg-black  px-8 text-white"
                          label={coupon ? t('Update') : t('Add')}
                          type="submit"
                          loading={mutationLoading}
                        />
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
