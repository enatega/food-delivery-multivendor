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
import { IAmplitudeForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { AmplitudeValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_AMPLITUDE_API_KEY_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const AmplitudeAddForm = () => {
  // Hooks
  const { AMPLITUDE_API_KEY_WEB, AMPLITUDE_API_KEY_APP } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    webAmplitudeApiKey: AMPLITUDE_API_KEY_WEB || '',
    appAmplitudeApiKey: AMPLITUDE_API_KEY_APP || '',
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_AMPLITUDE_API_KEY_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: IAmplitudeForm) => {
    mutate({
      variables: {
        configurationInput: {
          webAmplitudeApiKey: values.webAmplitudeApiKey,
          appAmplitudeApiKey: values.appAmplitudeApiKey,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Amplitude Configuration Updated',
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
        validationSchema={AmplitudeValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Amplitude'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CustomPasswordTextField
                    placeholder="Web Amplitude API Key"
                    feedback={false}
                    name="webAmplitudeApiKey"
                    maxLength={255}
                    value={values.webAmplitudeApiKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.webAmplitudeApiKey && touched.webAmplitudeApiKey
                          ? 'red'
                          : '',
                    }}
                  />

                  <CustomPasswordTextField
                    placeholder="App Amplitude API Key"
                    feedback={false}
                    name="appAmplitudeApiKey"
                    maxLength={255}
                    value={values.appAmplitudeApiKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.appAmplitudeApiKey && touched.appAmplitudeApiKey
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

export default AmplitudeAddForm;
