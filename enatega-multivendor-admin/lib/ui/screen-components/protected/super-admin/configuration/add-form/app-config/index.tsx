'use client';
// Core
import React, { useMemo } from 'react';
import { Form, Formik } from 'formik';
import { useMutation, useQuery } from '@apollo/client';

// Components
import ConfigCard from '../../view/card';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';

// Toast
import useToast from '@/lib/hooks/useToast';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// Interfaces and Types
import { IAppConfigForm } from '@/lib/utils/interfaces/configurations.interface';
import { IDropdownSelectItem } from '@/lib/utils/interfaces';

// Utils and Constants
import { AppConfigValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  GET_ZONES,
  SAVE_APP_CONFIGURATION,
} from '@/lib/api/graphql';

const AppConfigAddForm = () => {
  // Hooks
  const {
    APP_TERMS,
    APP_PRIVACY,
    APP_TEST_OTP,
    ENABLE_CUSTOMER_DEMO_MODE,
    CUSTOMER_DEMO_ZONE_ID,
  } = useConfiguration();
  const { showToast } = useToast();
  const { data: zoneData, loading: zonesLoading } = useQuery(GET_ZONES);

  const zoneOptions = useMemo(
    () =>
      (zoneData?.zones || []).map((zone: { _id: string; title: string }) => ({
        _id: zone._id,
        code: zone._id,
        label: zone.title,
      })),
    [zoneData?.zones]
  );

  const defaultDemoZone = useMemo(() => {
    if (!zoneOptions.length) return null

    return (
      zoneOptions.find(
        (zone: IDropdownSelectItem) => zone.code === CUSTOMER_DEMO_ZONE_ID
      ) ||
      zoneOptions.find(
        (zone: IDropdownSelectItem) => zone.label === 'Global zone'
      ) ||
      null
    )
  }, [zoneOptions, CUSTOMER_DEMO_ZONE_ID]);

  // Set initial values using the useConfiguration hook
  const initialValues = {
    termsAndConditions: APP_TERMS ?? '',
    privacyPolicy: APP_PRIVACY ?? '',
    testOtp: APP_TEST_OTP ? +APP_TEST_OTP : null,
    enableCustomerDemoMode: !!ENABLE_CUSTOMER_DEMO_MODE,
    customerDemoZone: defaultDemoZone,
  };

  // Mutation for saving the app configuration
  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_APP_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  // Handle form submission
  const handleSubmit = (values: IAppConfigForm) => {
    mutate({
      variables: {
        configurationInput: {
          termsAndConditions: values.termsAndConditions,
          privacyPolicy: values.privacyPolicy,
          testOtp: values.testOtp?.toString(),
          enableCustomerDemoMode: values.enableCustomerDemoMode,
          customerDemoZoneId: values.customerDemoZone?.code ?? null,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'App Configurations Updated',
          duration: 3000,
        });
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = 'ActionFailedTryAgain';
        }
        showToast({
          type: 'error',
          title: 'Error!',
          message,
          duration: 3000,
        });
      },
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={AppConfigValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          setFieldValue,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'App Configuration'}
                buttonLoading={mutationLoading}
                toggleLabel={'Enable customer demo mode'}
                toggleValue={values.enableCustomerDemoMode}
                toggleOnChange={() => {
                  const nextValue = !values.enableCustomerDemoMode
                  setFieldValue('enableCustomerDemoMode', nextValue)
                  if (!nextValue) {
                    setFieldValue('customerDemoZone', null)
                    return
                  }

                  if (!values.customerDemoZone && defaultDemoZone) {
                    setFieldValue('customerDemoZone', defaultDemoZone)
                  }
                }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Terms and Conditions Field */}
                  <CustomTextField
                    type="text"
                    placeholder="Terms and Conditions"
                    name="termsAndConditions"
                    maxLength={255}
                    value={values.termsAndConditions}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.termsAndConditions && touched.termsAndConditions
                          ? 'red'
                          : '',
                    }}
                  />

                  {/* Privacy Policy Field */}
                  <CustomTextField
                    type="text"
                    placeholder="Privacy Policy"
                    name="privacyPolicy"
                    maxLength={255}
                    value={values.privacyPolicy}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.privacyPolicy && touched.privacyPolicy
                          ? 'red'
                          : '',
                    }}
                  />

                  {/* Test OTP Field */}
                  <CustomNumberField
                    min={0}
                    placeholder="Test OTP"
                    name="testOtp"
                    value={values.testOtp}
                    showLabel={true}
                    onChange={setFieldValue}
                    style={{
                      borderColor:
                        errors.testOtp && touched.testOtp ? 'red' : '',
                    }}
                    useGrouping={false}
                  />

                  <CustomDropdownComponent
                    placeholder="Demo zone"
                    options={zoneOptions}
                    showLabel={true}
                    name="customerDemoZone"
                    selectedItem={values.customerDemoZone}
                    setSelectedItem={setFieldValue}
                    isLoading={zonesLoading}
                    disabled={!values.enableCustomerDemoMode}
                    style={{
                      borderColor:
                        errors.customerDemoZone && touched.customerDemoZone
                          ? 'red'
                          : '',
                    }}
                  />
                </div>
              </ConfigCard>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AppConfigAddForm;
