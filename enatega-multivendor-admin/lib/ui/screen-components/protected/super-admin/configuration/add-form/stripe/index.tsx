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
import { IStripeForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { StripeValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_STRIPE_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const StripeAddForm = () => {
  // Hooks
  const { STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    publishableKey: STRIPE_PUBLIC_KEY,
    secretKey: STRIPE_SECRET_KEY,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_STRIPE_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IStripeForm) => {
    mutate({
      variables: {
        configurationInput: {
          publishableKey: values.publishableKey,
          secretKey: values.secretKey,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Stripe Configurations Updated',
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
        validationSchema={StripeValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard cardTitle={'Stripe'} buttonLoading={mutationLoading}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CustomPasswordTextField
                    placeholder="Publishable Key"
                    name="publishableKey"
                    maxLength={20}
                    value={values.publishableKey}
                    showLabel={true}
                    feedback={false}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.publishableKey && touched.publishableKey
                          ? 'red'
                          : '',
                    }}
                  />

                  <CustomPasswordTextField
                    placeholder="SecretKey"
                    name="secretKey"
                    maxLength={20}
                    feedback={false}
                    value={values.secretKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.secretKey && touched.secretKey ? 'red' : '',
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

export default StripeAddForm;
