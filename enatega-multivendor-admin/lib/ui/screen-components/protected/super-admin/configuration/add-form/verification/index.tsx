'use client';
// Core
import { Form, Formik } from 'formik';

// Components
import ConfigCard from '../../view/card';

// Toast
import useToast from '@/lib/hooks/useToast';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// Interfaces and Types
import { IVerificationConfigForm } from '@/lib/utils/interfaces/configurations.interface';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_VERIFICATION_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';

const VerificationAddForm = () => {
  // Hooks
  const { SKIP_EMAIL_VERIFICATION, SKIP_MOBILE_VERIFICATION } =
    useConfiguration();
  const { showToast } = useToast();

  // Set initial values using the useConfiguration hook
  const initialValues = {
    skipEmailVerification: SKIP_EMAIL_VERIFICATION ?? false,
    skipMobileVerification: SKIP_MOBILE_VERIFICATION ?? false,
  };

  // Mutation for saving the app configuration
  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_VERIFICATION_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  // Handle form submission
  const handleSubmit = (values: IVerificationConfigForm) => {
    mutate({
      variables: {
        configurationInput: {
          skipEmailVerification: values.skipEmailVerification,
          skipMobileVerification: values.skipMobileVerification,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Verification Configurations Updated',
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
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, handleSubmit, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Verification Configuration'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4">
                  <CustomInputSwitch
                    label={`Skip Mobile Verification`}
                    onChange={() =>
                      setFieldValue(
                        'skipMobileVerification',
                        !values.skipMobileVerification
                      )
                    }
                    isActive={values.skipMobileVerification}
                    reverse
                  />
                  <CustomInputSwitch
                    label={`Skip Email Verification`}
                    onChange={() =>
                      setFieldValue(
                        'skipEmailVerification',
                        !values.skipEmailVerification
                      )
                    }
                    isActive={values.skipEmailVerification}
                    reverse
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

export default VerificationAddForm;
