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
import { IGeneralForm } from '@/lib/utils/interfaces/configurations.interface';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_GENERAL_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';

const GeneralAddForm = () => {
  // Hooks
  const { IS_APP_LAUNCHED } = useConfiguration();
  const { showToast } = useToast();

  // Set initial values using the useConfiguration hook
  const initialValues = {
    isAppLaunched: IS_APP_LAUNCHED ?? false,
  };

  // Mutation for saving the app configuration
  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_GENERAL_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  // Handle form submission
  const handleSubmit = (values: IGeneralForm) => {
    mutate({
      variables: {
        configurationInput: {
          isAppLaunched: values.isAppLaunched
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'General Configurations Updated',
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
                cardTitle={'General Configuration'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4">
                  <CustomInputSwitch
                    label={`Is App Launched`}
                    onChange={() =>
                      setFieldValue(
                        'isAppLaunched',
                        !values.isAppLaunched
                      )
                    }
                    isActive={values.isAppLaunched}
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

export default GeneralAddForm;
