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
import { ICloudinaryForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { CloudinaryValidationSchema } from '@/lib/utils/schema';

// GraphQL
import {
  GET_CONFIGURATION,
  SAVE_CLOUDINARY_CONFIGURATION,
} from '@/lib/api/graphql';
import { useMutation } from '@apollo/client';

const CloudinaryAddForm = () => {
  const { showToast } = useToast();

  const { CLOUDINARY_UPLOAD_URL, CLOUDINARY_API_KEY } = useConfiguration();

  // Set initial values
  const initialValues = {
    cloudinaryUploadUrl: CLOUDINARY_UPLOAD_URL,
    cloudinaryApiKey: CLOUDINARY_API_KEY,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_CLOUDINARY_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: ICloudinaryForm) => {
    mutate({
      variables: {
        configurationInput: {
          cloudinaryUploadUrl: values.cloudinaryUploadUrl,
          cloudinaryApiKey: values.cloudinaryApiKey,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'Cloudinary Configuration Updated',
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
        validationSchema={CloudinaryValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ConfigCard
                cardTitle={'Cloudinary'}
                buttonLoading={mutationLoading}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CustomPasswordTextField
                    placeholder="Cloudinary Upload URL"
                    name="cloudinaryUploadUrl"
                    feedback={false}
                    maxLength={255}
                    value={values.cloudinaryUploadUrl}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.cloudinaryUploadUrl &&
                        touched.cloudinaryUploadUrl
                          ? 'red'
                          : '',
                    }}
                  />

                  <CustomPasswordTextField
                    placeholder="Cloudinary API Key"
                    feedback={false}
                    name="cloudinaryApiKey"
                    maxLength={255}
                    value={values.cloudinaryApiKey}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.cloudinaryApiKey && touched.cloudinaryApiKey
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

export default CloudinaryAddForm;
