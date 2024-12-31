// Core
import { ApolloError, useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';
import { ProfileContext } from '@/lib/context/vendor/profile.context';

// Interface and Types
import { IVendorUpdateFormComponentProps } from '@/lib/utils/interfaces';
import { IVendorForm } from '@/lib/utils/interfaces/forms';

// Constants and Methods
import { MAX_SQUARE_FILE_SIZE, VendorErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomIconTextField from '@/lib/ui/useable-components/input-icon-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// Schema
import { VendorEditSchema } from '@/lib/utils/schema';

// GraphQL
import { EDIT_VENDOR } from '@/lib/api/graphql';

// Icons
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const initialValues: IVendorForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  image: '',
};

export default function VendorUpdateForm({
  position = 'right',
  vendorFormVisible,
  setIsUpdateProfileVisible,
}: IVendorUpdateFormComponentProps) {
  // Context
  const { showToast } = useContext(ToastContext);
  const { vendorProfileResponse } = useContext(ProfileContext);
  let vendor = vendorProfileResponse.data?.getVendor;

  // States
  const [formInitialValues, setFormValues] = useState<IVendorForm>({
    ...initialValues,
  });

  // API
  // Mutations
  const [createVendor] = useMutation(EDIT_VENDOR, {
    //  refetchQueries: [{ query: GET_VENDORS, fetchPolicy: 'network-only' }],
    onError,
    onCompleted: () => {},
  });

  // Handlers
  const onVendorCreate = async (data: IVendorForm) => {
    try {
      await createVendor({
        variables: {
          vendorInput: {
            _id: vendor?._id,
            name: data?.name ?? ' ',
            email: data?.email,
            password: data?.password,
            image: data?.image,
            phoneNumber: data?.phoneNumber,
            lastName: data?.lastName,
          },
        },
      });

      showToast({
        type: 'success',
        title: 'New Vendor',
        message: `Vendor has been edited successfully`,
        duration: 3000,
      });

      setIsUpdateProfileVisible(false);
    } catch (error) {
      showToast({
        type: 'error',
        title: `Edit Vendor`,
        message: `Vendor Edit Failed`,
        duration: 2500,
      });
    }
  };
  function onError({ graphQLErrors, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: `Edit Vendor`,
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        `Vendor Edit Failed`,
      duration: 2500,
    });
  }

  // Effects
  useEffect(() => {
    if (vendor) {
      setFormValues({
        name: vendor?.name ?? '',
        email: vendor?.email ?? '',
        password: vendor?.plainPassword ?? '',
        confirmPassword: vendor?.plainPassword ?? '',
        image: vendor?.image || '',
        phoneNumber: vendor?.phoneNumber || '',
        lastName: vendor?.lastName || '',
      });
    }
  }, [vendor]);

  return (
    <Sidebar
      visible={vendorFormVisible}
      position={position}
      onHide={() => setIsUpdateProfileVisible(false)}
      className="w-full sm:w-[450px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">Edit Vendor</span>
            </div>

            <div>
              <Formik
                initialValues={formInitialValues}
                validationSchema={VendorEditSchema}
                enableReinitialize={true}
                onSubmit={async (values) => {
                  await onVendorCreate(values);
                }}
                validateOnChange={false}
              >
                {({
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-3">
                        <CustomTextField
                          type="text"
                          name="name"
                          placeholder="Name"
                          maxLength={35}
                          value={values.name}
                          onChange={handleChange}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'name',
                              errors?.name,
                              VendorErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                        <CustomIconTextField
                          type="email"
                          name="email"
                          placeholder="Email"
                          maxLength={35}
                          showLabel={true}
                          iconProperties={{
                            icon: faEnvelope,
                            position: 'right',
                            style: { marginTop: '1px' },
                          }}
                          value={values.email}
                          onChange={handleChange}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'email',
                              errors?.email,
                              VendorErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

                        <CustomPasswordTextField
                          autoComplete="new-password"
                          placeholder="Password"
                          name="password"
                          maxLength={20}
                          value={values.password}
                          showLabel={true}
                          onChange={handleChange}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'password',
                              errors?.password,
                              VendorErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

                        <CustomPasswordTextField
                          autoComplete="new-password"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          maxLength={20}
                          showLabel={true}
                          value={values.confirmPassword ?? ''}
                          onChange={handleChange}
                          feedback={false}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'confirmPassword',
                              errors?.confirmPassword,
                              VendorErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                        <CustomUploadImageComponent
                          key="image"
                          name="image"
                          title="Upload Profile Image"
                          fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                          maxFileHeight={1080}
                          maxFileWidth={1080}
                          maxFileSize={MAX_SQUARE_FILE_SIZE}
                          orientation="SQUARE"
                          onSetImageUrl={setFieldValue}
                          existingImageUrl={values.image}
                          showExistingImage={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'image',
                              errors?.image as string,
                              VendorErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

                        <div className="mt-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                            label={'Update'}
                            type="submit"
                            loading={isSubmitting}
                          />
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
