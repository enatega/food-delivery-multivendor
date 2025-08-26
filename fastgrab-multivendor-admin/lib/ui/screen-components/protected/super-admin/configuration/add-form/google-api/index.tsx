'use client';
// Core
import { Form, Formik } from 'formik';

// Components
import ConfigCard from '../../view/card';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';

// Toast
import useToast from '@/lib/hooks/useToast';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// Interfaces and Types
import { IGoogleApiForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { GoogleApiValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_GOOGLE_API_KEY_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const GoogleApiAddForm = () => {
  // Hooks
  const { GOOGLE_MAPS_KEY } = useConfiguration();
  const { showToast } = useToast();

  // Initial values for the form
  const initialValues = {
    googleApiKey: GOOGLE_MAPS_KEY ?? '',
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_GOOGLE_API_KEY_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IGoogleApiForm) => {
    mutate({
      variables: {
        configurationInput: {
          googleApiKey: values.googleApiKey,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Google API Key Updated',
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
        validationSchema={GoogleApiValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Google API'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4">
                  <CustomPasswordTextField
                    placeholder="Google API Key"
                    name="googleApiKey"
                    maxLength={255}
                    feedback={false}
                    value={values.googleApiKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.googleApiKey && touched.googleApiKey
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

export default GoogleApiAddForm;
