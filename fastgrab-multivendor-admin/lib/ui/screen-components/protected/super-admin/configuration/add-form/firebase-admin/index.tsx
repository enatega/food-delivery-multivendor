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
import { IFirebaseForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { FirebaseValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_FIREBASE_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const FirebaseAdminAddForm = () => {
  // Hooks to fetch environment variables
  const {
    FIREBASE_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MSG_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
    FIREBASE_VAPID_KEY,
  } = useConfiguration();
  const { showToast } = useToast();

  // Set initial values based on fetched configuration
  const initialValues = {
    firebaseKey: FIREBASE_KEY ?? '',
    authDomain: FIREBASE_AUTH_DOMAIN ?? '',
    projectId: FIREBASE_PROJECT_ID ?? '',
    storageBucket: FIREBASE_STORAGE_BUCKET ?? '',
    msgSenderId: FIREBASE_MSG_SENDER_ID ?? '',
    appId: FIREBASE_APP_ID ?? '',
    measurementId: FIREBASE_MEASUREMENT_ID ?? '',
    vapidKey: FIREBASE_VAPID_KEY ?? '',
  };

  // GraphQL mutation to save the Firebase configuration
  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_FIREBASE_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  // Handle form submission
  const handleSubmit = (values: IFirebaseForm) => {
    mutate({
      variables: {
        configurationInput: {
          firebaseKey: values.firebaseKey,
          authDomain: values.authDomain,
          projectId: values.projectId,
          storageBucket: values.storageBucket,
          msgSenderId: values.msgSenderId,
          appId: values.appId,
          measurementId: values.measurementId,
          vapidKey: values.vapidKey,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Firebase Configuration Updated',
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
        validationSchema={FirebaseValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Firebase Admin Configuration'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Firebase Key */}
                  <CustomPasswordTextField
                    placeholder="Firebase Key"
                    name="firebaseKey"
                    feedback={false}
                    maxLength={255}
                    value={values.firebaseKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.firebaseKey && touched.firebaseKey ? 'red' : '',
                    }}
                  />

                  {/* Auth Domain */}
                  <CustomPasswordTextField
                    placeholder="Auth Domain"
                    name="authDomain"
                    feedback={false}
                    maxLength={255}
                    value={values.authDomain}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.authDomain && touched.authDomain ? 'red' : '',
                    }}
                  />

                  {/* Project ID */}
                  <CustomPasswordTextField
                    placeholder="Project ID"
                    name="projectId"
                    feedback={false}
                    maxLength={255}
                    value={values.projectId}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.projectId && touched.projectId ? 'red' : '',
                    }}
                  />

                  {/* Storage Bucket */}
                  <CustomPasswordTextField
                    placeholder="Storage Bucket"
                    name="storageBucket"
                    maxLength={255}
                    feedback={false}
                    value={values.storageBucket}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.storageBucket && touched.storageBucket
                          ? 'red'
                          : '',
                    }}
                  />

                  {/* Message Sender ID */}
                  <CustomPasswordTextField
                    placeholder="Message Sender ID"
                    name="msgSenderId"
                    maxLength={255}
                    feedback={false}
                    value={values.msgSenderId}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.msgSenderId && touched.msgSenderId ? 'red' : '',
                    }}
                  />

                  {/* App ID */}
                  <CustomPasswordTextField
                    placeholder="App ID"
                    name="appId"
                    feedback={false}
                    maxLength={255}
                    value={values.appId}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor: errors.appId && touched.appId ? 'red' : '',
                    }}
                  />

                  {/* Measurement ID */}
                  <CustomPasswordTextField
                    placeholder="Measurement ID"
                    name="measurementId"
                    feedback={false}
                    maxLength={255}
                    value={values.measurementId}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.measurementId && touched.measurementId
                          ? 'red'
                          : '',
                    }}
                  />

                  {/* Vapid Key */}
                  <CustomPasswordTextField
                    placeholder="Vapid Key"
                    name="vapidKey"
                    feedback={false}
                    maxLength={255}
                    value={values.vapidKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.vapidKey && touched.vapidKey ? 'red' : '',
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

export default FirebaseAdminAddForm;
