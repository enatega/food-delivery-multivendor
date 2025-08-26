// Core
import { useContext } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

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
    enabled: true,
    ...coupon,
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
      className="w-full sm:w-[600px]"
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
                          style={{
                            borderColor:
                              errors.title && touched.title ? 'red' : '',
                          }}
                        />

                        <CustomNumberField
                          min={0}
                          placeholder={t('Discount')}
                          minFractionDigits={0}
                          maxFractionDigits={2}
                          name="discount"
                          showLabel={true}
                          value={values.discount}
                          useGrouping={false}
                          onChange={setFieldValue}
                          style={{
                            borderColor:
                              errors.discount && touched.discount ? 'red' : '',
                          }}
                        />

                        <Toggle
                          checked={values.enabled}
                          onClick={() => {
                            setFieldValue('enabled', !values.enabled);
                          }}
                          showLabel
                          placeholder={t('Status')}
                        />

                        <CustomButton
                          className="h-10 ml-auto  w-fit border-gray-300 bg-black px-8 text-white"
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
