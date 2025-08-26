'use client';
// GraphQL
import { CREATE_COUPON, EDIT_COUPON, GET_COUPONS } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// Components
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

// Interfaces
import { IAddCouponProps } from '@/lib/utils/interfaces/coupons.interface';

// Schema
import { CouponFormSchema } from '@/lib/utils/schema/coupon';

// Formik
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';

// Hooks
import { useMutation } from '@apollo/client';
import { ChangeEvent, useContext } from 'react';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { CouponErrors } from '@/lib/utils/constants';
import { useTranslations } from 'next-intl';

export default function CouponForm({
  setVisible,
  isEditing,
  visible,
  setIsEditing,
}: IAddCouponProps) {
  // Hooks
  const { showToast } = useContext(ToastContext);
  const t = useTranslations();

  // Initial values
  const initialValues = {
    _id: isEditing.bool ? isEditing?.data?._id : '',
    title: isEditing.bool ? isEditing?.data?.title : '',
    discount: isEditing.bool ? isEditing?.data?.discount : 0,
    enabled: isEditing.bool ? isEditing?.data?.enabled : true,
  };

  // Mutations
  const [CreateCoupon, { loading: createCouponLoading }] = useMutation(
    CREATE_COUPON,
    {
      refetchQueries: [{ query: GET_COUPONS }],
      onCompleted: () => {
        showToast({
          title: `${isEditing.bool ? t('Edit') : t('New')} ${t('Coupon')}`,
          type: 'success',
          message: t('Coupon has been added successfully'),
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
          },
        });
      },
      onError: (err) => {
        showToast({
          title: `${isEditing.bool ? t('Edit') : t('New')} ${t('Coupon')}`,
          type: 'error',
          message:
            err.message ||
            `${t('Coupon')} ${isEditing.bool ? t('Edition') : t('Creation')} ${t('Failed')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
          },
        });
      },
    }
  );
  const [editCoupon, { loading: editCouponLoading }] = useMutation(
    EDIT_COUPON,
    {
      refetchQueries: [{ query: GET_COUPONS }],
      onCompleted: () => {
        showToast({
          title: `${isEditing.bool ? t('Edit') : t('New')} ${t('Coupon')}`,
          type: 'success',
          message: `${t('Coupon has been')} ${isEditing.bool ? t('Edited') : t('Added')}  ${t('Successfully')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
          },
        });
      },
      onError: (err) => {
        showToast({
          title: `${isEditing.bool ? t('Edit') : t('New')} ${t('Coupon')}`,
          type: 'error',
          message:
            err.message ||
            `${t('Coupon')} ${isEditing.bool ? t('Edition') : t('Creation')} ${t('Failed')}`,
          duration: 2000,
        });
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            discount: 0,
            enabled: false,
            title: '',
          },
        });
      },
    }
  );

  return (
    <Sidebar
      visible={visible}
      onHide={() => {
        setVisible(false);
      }}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={CouponFormSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          let formData;
          if (!isEditing.bool) {
            formData = {
              title: values.title,
              discount: values.discount,
              enabled: values.enabled,
            };
          } else {
            formData = {
              _id: values._id,
              title: values.title,
              discount: values.discount,
              enabled: values.enabled,
            };
          }

          if (!isEditing.bool) {
            await CreateCoupon({
              variables: {
                couponInput: formData,
              },
            });
          } else {
            await editCoupon({
              variables: {
                couponInput: formData,
              },
            });
          }
          setIsEditing({
            bool: false,
            data: {
              __typename: '',
              _id: '',
              discount: 0,
              enabled: true,
              title: '',
            },
          });
          setVisible(false);

          setSubmitting(false);
        }}
        validateOnChange={true}
      >
        {({ errors, handleSubmit, values, isSubmitting, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <h2 className='className="mb-3 text-xl font-bold'>
                    {isEditing.bool ? t('Edit') : t('Add')} {t('Coupon')}
                  </h2>
                  <div className="flex items-center gap-x-1">
                    {values.enabled ? t('Enabled') : t('Disabled')}
                    <CustomInputSwitch
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFieldValue('enabled', e.target.checked)
                      }
                      isActive={values.enabled}
                      className={values.enabled ? 'p-inputswitch-checked' : ''}
                    />
                  </div>
                </div>
                <CustomTextField
                  value={values.title}
                  name="title"
                  showLabel={true}
                  placeholder={t('Title')}
                  type="text"
                  onChange={(e) => setFieldValue('title', e.target.value)}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'title',
                      errors?.title,
                      CouponErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <CustomNumberField
                  value={values.discount}
                  name="discount"
                  minFractionDigits={0}
                  maxFractionDigits={2}
                  showLabel={true}
                  suffix="%"
                  placeholder={t('Discount')}
                  onChange={setFieldValue}
                  min={0}
                  max={100}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'discount',
                      errors?.discount,
                      CouponErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white"
                  disabled={
                    isSubmitting || editCouponLoading || createCouponLoading
                  }
                  type="submit"
                >
                  {isSubmitting || editCouponLoading || createCouponLoading ? (
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
