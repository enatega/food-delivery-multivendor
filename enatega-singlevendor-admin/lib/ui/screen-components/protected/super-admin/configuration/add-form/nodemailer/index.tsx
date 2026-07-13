'use client';
// Core
import { Form, Formik } from 'formik';

// Components
import ConfigCard from '../../view/card';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Toast
import useToast from '@/lib/hooks/useToast';

// Hooks
import { useConfiguration } from '@/lib/hooks/useConfiguration';

// Interfaces and Types
import { INodeMailerForm } from '@/lib/utils/interfaces/configurations.interface';

// Utils and Constants
import { NodeMailerValidationSchema } from '@/lib/utils/schema';

// GraphQL
import { useMutation } from '@apollo/client';
import { GET_CONFIGURATION, SAVE_EMAIL_CONFIGURATION } from '@/lib/api/graphql';

const NodeMailerAddForm = () => {
  // Hooks
  const { EMAIL_NAME, EMAIL, PASSWORD, ENABLE_EMAIL } = useConfiguration();
  const { showToast } = useToast();

  const initialValues = {
    email: EMAIL,
    password: PASSWORD,
    emailName: EMAIL_NAME,
    enableEmail: ENABLE_EMAIL,
  };

  const [mutate, { loading: mutationLoading }] = useMutation(
    SAVE_EMAIL_CONFIGURATION,
    {
      refetchQueries: [{ query: GET_CONFIGURATION }],
    }
  );

  const handleSubmit = (values: INodeMailerForm) => {
    mutate({
      variables: {
        configurationInput: {
          email: values.email,
          emailName: values.emailName,
          password: values.password,
          enableEmail: values.enableEmail,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: 'Success!',
          message: 'NodeMailer Configurations Updated',
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
        validationSchema={NodeMailerValidationSchema}
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
                cardTitle={'NodeMailer Email'}
                buttonLoading={mutationLoading}
                toggleLabel={'Status'}
                toggleOnChange={() => {
                  setFieldValue('enableEmail', !values.enableEmail);
                }}
                toggleValue={values.enableEmail}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CustomTextField
                    type="text"
                    name="email"
                    placeholder="Email"
                    maxLength={35}
                    value={values.email}
                    onChange={handleChange}
                    showLabel={true}
                    style={{
                      borderColor: errors.email && touched.email ? 'red' : '',
                    }}
                  />

                  <CustomTextField
                    type="text"
                    name="emailName"
                    placeholder="Email Name"
                    maxLength={35}
                    value={values.emailName}
                    onChange={handleChange}
                    showLabel={true}
                    style={{
                      borderColor:
                        errors.emailName && touched.emailName ? 'red' : '',
                    }}
                  />

                  <CustomPasswordTextField
                    placeholder="Password"
                    name="password"
                    feedback={false}
                    maxLength={20}
                    value={values.password}
                    showLabel={true}
                    onChange={handleChange}
                    style={{
                      borderColor:
                        errors.password && touched.password ? 'red' : '',
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

export default NodeMailerAddForm;
