'use client';

// Core
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// Components
import ConfigCard from '../../view/card';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Toast
import useToast from '@/lib/hooks/useToast';

// GraphQL
import { GET_VERSIONS, SET_VERSIONS } from '@/lib/api/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { VersionConfigValidationSchema } from '@/lib/utils/schema';
import { IVersionConfigForm } from '@/lib/utils/interfaces';

const VersionConfigAddForm = () => {
  const { showToast } = useToast();
  
  // Query to fetch current versions
  const { data: versionsData } = useQuery(GET_VERSIONS);

  // Set initial values from query data
  const initialValues: IVersionConfigForm = {
    customerAppVersionAndroid: versionsData?.getVersions?.customerAppVersion?.android ?? '',
    customerAppVersionIos: versionsData?.getVersions?.customerAppVersion?.ios ?? '',
    riderAppVersionAndroid: versionsData?.getVersions?.riderAppVersion?.android ?? '',
    riderAppVersionIos: versionsData?.getVersions?.riderAppVersion?.ios ?? '',
    restaurantAppVersionAndroid: versionsData?.getVersions?.restaurantAppVersion?.android ?? '',
    restaurantAppVersionIos: versionsData?.getVersions?.restaurantAppVersion?.ios ?? '',
  };

  // Mutation for saving versions
  const [mutate, { loading: mutationLoading }] = useMutation(SET_VERSIONS, {
    refetchQueries: [{ query: GET_VERSIONS }],
  });

  // Handle form submission
  const handleSubmit = (values: IVersionConfigForm) => {
    mutate({
      variables: {
        customerAppVersion: {
          android: values.customerAppVersionAndroid,
          ios: values.customerAppVersionIos,
        },
        riderAppVersion: {
          android: values.riderAppVersionAndroid,
          ios: values.riderAppVersionIos,
        },
        restaurantAppVersion: {
          android: values.restaurantAppVersionAndroid,
          ios: values.restaurantAppVersionIos,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'App Versions Updated',
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
        validationSchema={VersionConfigValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'App Versions Configuration'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Customer App Version Fields */}
                  <CustomTextField
                    type="text"
                    placeholder="Customer App Version for Android"
                    name="customerAppVersionAndroid"
                    maxLength={10}
                    value={values.customerAppVersionAndroid}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.customerAppVersionAndroid && touched.customerAppVersionAndroid
                          ? 'red'
                          : '',
                    }}
                  />
                  <CustomTextField
                    type="text"
                    placeholder="Customer App Version for iOS"
                    name="customerAppVersionIos"
                    maxLength={10}
                    value={values.customerAppVersionIos}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.customerAppVersionIos && touched.customerAppVersionIos
                          ? 'red'
                          : '',
                    }}
                  />

                  {/* Rider App Version Fields */}
                  <CustomTextField
                    type="text"
                    placeholder="Rider App Version for Android"
                    name="riderAppVersionAndroid"
                    maxLength={10}
                    value={values.riderAppVersionAndroid}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.riderAppVersionAndroid && touched.riderAppVersionAndroid
                          ? 'red'
                          : '',
                    }}
                  />
                  <CustomTextField
                    type="text"
                    placeholder="Rider App Version for iOS"
                    name="riderAppVersionIos"
                    maxLength={10}
                    value={values.riderAppVersionIos}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.riderAppVersionIos && touched.riderAppVersionIos
                          ? 'red'
                          : '',
                    }}
                  />

                  {/* Restaurant App Version Fields */}
                  <CustomTextField
                    type="text"
                    placeholder="Restaurant App Version for Android"
                    name="restaurantAppVersionAndroid"
                    maxLength={10}
                    value={values.restaurantAppVersionAndroid}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.restaurantAppVersionAndroid && touched.restaurantAppVersionAndroid
                          ? 'red'
                          : '',
                    }}
                  />
                  <CustomTextField
                    type="text"
                    placeholder="Restaurant App Version for iOS"
                    name="restaurantAppVersionIos"
                    maxLength={10}
                    value={values.restaurantAppVersionIos}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.restaurantAppVersionIos && touched.restaurantAppVersionIos
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

export default VersionConfigAddForm;