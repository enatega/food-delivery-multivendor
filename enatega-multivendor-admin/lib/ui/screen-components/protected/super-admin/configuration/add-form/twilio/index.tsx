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
import { ITwilioForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { TwilioValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_TWILIO_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

const TwilioAddForm = () => {
  // Hooks
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    TWILIO_ENABLED,
  } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    twilioAccountSid: TWILIO_ACCOUNT_SID,
    twilioAuthToken: TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: TWILIO_PHONE_NUMBER ? +TWILIO_PHONE_NUMBER : null,
    twilioEnabled: TWILIO_ENABLED,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_TWILIO_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: ITwilioForm) => {
    mutate({
      variables: {
        configurationInput: {
          twilioAccountSid: values.twilioAccountSid,
          twilioAuthToken: values.twilioAuthToken,
          twilioPhoneNumber: values.twilioPhoneNumber
            ? values.twilioPhoneNumber.toString()
            : '',
          twilioEnabled: values.twilioEnabled,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Twilio Configurations Updated',
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
        validationSchema={TwilioValidationSchema}
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
                cardTitle={'Twilio'}
                buttonLoading={mutationLoading}
                toggleLabel={'Status'}
                toggleOnChange={() => {
                  setFieldValue('twilioEnabled', !values.twilioEnabled);
                }}
                toggleValue={values.twilioEnabled}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CustomPasswordTextField
                    placeholder="Account Sid"
                    name="twilioAccountSid"
                    maxLength={20}
                    feedback={false}
                    value={values.twilioAccountSid}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.twilioAccountSid && touched.twilioAccountSid
                          ? 'red'
                          : '',
                    }}
                  />

                  <CustomPasswordTextField
                    placeholder="Auth Token"
                    name="twilioAuthToken"
                    maxLength={20}
                    feedback={false}
                    value={values.twilioAuthToken}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.twilioAuthToken && touched.twilioAuthToken
                          ? 'red'
                          : '',
                    }}
                  />

                  <CustomNumberField
                    min={0}
                    placeholder="Phone Number"
                    name="twilioPhoneNumber"
                    showLabel={true}
                    value={values.twilioPhoneNumber}
                    useGrouping={false}
                    onChange={setFieldValue}
                    style={{
                      borderColor:
                        errors.twilioPhoneNumber && touched.twilioPhoneNumber
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

export default TwilioAddForm;
