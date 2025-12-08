import { useContext, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { useMutation } from '@apollo/client';

import { ProfileContext } from '@/lib/context/restaurant/profile.context';
import { ToastContext } from '@/lib/context/global/toast.context';

import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

import { BussinessDetailsErrors } from '@/lib/utils/constants';
import { UPDATE_RESTAURANT_BUSSINESS_DETAILS } from '@/lib/api/graphql';
import { onErrorMessageMatcher } from '@/lib/utils/methods';

import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

import {
  IUpdateProfileProps,
  IUpdateBussinessDetailsForm,
} from '@/lib/utils/interfaces';
import { BussinessDetailsSchema } from '@/lib/utils/schema';
import { useTranslations } from 'next-intl';

export default function UpdateBusinessDetails({
  stepperProps,
}: IUpdateProfileProps) {
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => { },
    order: -1,
  };

  // Hooks
  const t = useTranslations();

  // Contexts
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;

  const { showToast } = useContext(ToastContext);
  const { restaurantProfileResponse } = useContext(ProfileContext);

  const [updateRestaurantBussinessDetails] = useMutation(
    UPDATE_RESTAURANT_BUSSINESS_DETAILS,
    {
      onError: ({ graphQLErrors, networkError }) => {
        showToast({
          type: 'error',
          title: t('Edit Store'),
          message:
            graphQLErrors[0]?.message ??
            networkError?.message ??
            t('Store Edit Failed'),
          duration: 2500,
        });
      },
      onCompleted: async () => {
        onStepChange(order + 1);
      },
    }
  );

  const initialValues: IUpdateBussinessDetailsForm = useMemo(() => {
    const restaurantData = restaurantProfileResponse.data?.restaurant;

    return {
      bankName: restaurantData?.bussinessDetails?.bankName ?? '',
      accountName: restaurantData?.bussinessDetails?.accountName ?? '',
      accountCode: restaurantData?.bussinessDetails?.accountCode ?? '',
      accountNumber: restaurantData?.bussinessDetails?.accountNumber ?? null,
      bussinessRegNo: restaurantData?.bussinessDetails?.bussinessRegNo ?? null,
      companyRegNo: restaurantData?.bussinessDetails?.companyRegNo ?? null,
      taxRate: restaurantData?.bussinessDetails?.taxRate ?? null,
    };
  }, [restaurantProfileResponse.data?.restaurant]);

  const onEditRestaurant = async (data: IUpdateBussinessDetailsForm) => {
    if (!restaurantId) {
      showToast({
        type: 'error',
        title: t('Edit Store'),
        message: t('Store Edit Failed - Please select a vendor'),
        duration: 2500,
      });
      return;
    }

    try {
      await updateRestaurantBussinessDetails({
        variables: {
          id: restaurantId,
          bussinessDetails: {
            bankName: data.bankName,
            accountName: data.accountName,
            accountCode: data.accountCode,
            accountNumber: data.accountNumber,
            bussinessRegNo: data.bussinessRegNo || null,
            companyRegNo: data.companyRegNo || null,
            taxRate: data.taxRate,
          },
        },
      });

      showToast({
        type: 'success',
        title: t('Store Details'),
        message: t('Business details updated successfully'),
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: t('Store Details'),
        message: t('Something went wrong'),
      });
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="mb-2 flex flex-col">
            <span className="text-lg">{t('Update Business Details')}</span>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={BussinessDetailsSchema}
            onSubmit={(values) => {
              return onEditRestaurant(values);
            }}
            validateOnChange={false}
            enableReinitialize
          >
            {({
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <div className="mb-2 space-y-3">
                    <CustomTextField
                      type="text"
                      name="bankName"
                      placeholder={t('Bank Name')}
                      showLabel={true}
                      value={values.bankName}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'bankName',
                          errors?.bankName,
                          BussinessDetailsErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomTextField
                      type="text"
                      placeholder={t('Account Name')}
                      name="accountName"
                      value={values.accountName}
                      showLabel={true}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'accountName',
                          errors?.accountName,
                          BussinessDetailsErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <div>
                      <CustomTextField
                        type="text"
                        placeholder={t("bsb_iban_swift_code")}
                        name="accountCode"
                        showLabel={true}
                        value={values.accountCode ?? ''}
                        onChange={handleChange}
                        style={{
                          borderColor: onErrorMessageMatcher(
                            'accountCode',
                            errors?.accountCode,
                            BussinessDetailsErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>

                    <CustomNumberField
                      min={0}
                      useGrouping={false}
                      placeholder={t('Account Number')}
                      name="accountNumber"
                      showLabel={true}
                      value={values.accountNumber}
                      onChange={setFieldValue}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'accountNumber',
                          errors?.accountNumber,
                          BussinessDetailsErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomNumberField
                      min={0}
                      useGrouping={false}
                      placeholder={t('Business Registration Number')}
                      name="bussinessRegNo"
                      showLabel={true}
                      value={values.bussinessRegNo}
                      onChange={setFieldValue}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'bussinessRegNo',
                          errors?.bussinessRegNo,
                          BussinessDetailsErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomNumberField
                      min={0}
                      useGrouping={false}
                      placeholder={t('Company Registration Number')}
                      name="companyRegNo"
                      showLabel={true}
                      value={values.companyRegNo}
                      onChange={setFieldValue}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'companyRegNo',
                          errors?.companyRegNo,
                          BussinessDetailsErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomNumberField
                      min={0}
                      suffix="%"
                      useGrouping={false}
                      placeholder={`${t('tax_rate_%')} %`}
                      name="taxRate"
                      showLabel={true}
                      value={values.taxRate}
                      onChange={setFieldValue}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'taxRate',
                          errors?.taxRate,
                          BussinessDetailsErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <div className="mt-4 flex justify-end">
                      <CustomButton
                        className="h-10 w-fit border-gray-300 bg-black  px-8 text-white"
                        label={t('Update')}
                        type="submit"
                        loading={isSubmitting}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
