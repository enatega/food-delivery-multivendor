'use client';
// Core
import { Form, Formik } from 'formik';

// Components
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import ConfigCard from '../../view/card';

// Toast
import useToast from '@/lib/hooks/useToast';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// Interfaces and Types
import { IPaypalForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { PayPalValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_PAYPAL_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const PayPalAddForm = () => {
  // Hooks
  const { PAYPAL_KEY, PAYPAL_SANDBOX } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    clientId: PAYPAL_KEY,
    clientSecret: '',
    sandbox: PAYPAL_SANDBOX,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_PAYPAL_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IPaypalForm) => {
    const clientSecret = values.clientSecret?.trim();
    mutate({
      variables: {
        configurationInput: {
          clientId: values.clientId,
          sandbox: values.sandbox,
          ...(clientSecret ? { clientSecret } : {}),
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'PayPal Configurations Updated',
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
        validationSchema={PayPalValidationSchema}
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
                cardTitle={'PayPal'}
                buttonLoading={mutationLoading}
                toggleLabel={'Sandbox'}
                toggleOnChange={() => {
                  setFieldValue('sandbox', !values.sandbox);
                }}
                toggleValue={values.sandbox}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CustomPasswordTextField
                    placeholder="Publishable Key"
                    feedback={false}
                    name="clientId"
                    maxLength={20}
                    value={values.clientId}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.clientId && touched.clientId ? 'red' : '',
                    }}
                  />

                  <CustomPasswordTextField
                    placeholder="Client Secret"
                    feedback={false}
                    name="clientSecret"
                    maxLength={20}
                    value={values.clientSecret}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.clientSecret && touched.clientSecret
                          ? 'red'
                          : '',
                    }}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Leave the client secret blank to keep the current value.
                </p>
              </ConfigCard>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default PayPalAddForm;
