'use client';

// Core
import { ApolloError, useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';

// Prime React

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// Interface and Types
import { ICreateVendorResponseGraphQL } from '@/lib/utils/interfaces';
import { IRestauransVendorDetailsForm } from '@/lib/utils/interfaces/forms';

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
import { RestaurantsVendorDetails, VendorSchema } from '@/lib/utils/schema';

// GraphQL
import { CREATE_VENDOR, GET_VENDORS } from '@/lib/api/graphql';

// Icons
import { RestaurantsContext } from '@/lib/context/super-admin/restaurants.context';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import { IRestaurantsVendorDetailsComponentProps } from '@/lib/utils/interfaces/restaurants.interface';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const initialValues: IRestauransVendorDetailsForm = {
  _id: null,
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  image: '',
};
export default function VendorDetails({
  stepperProps,
  vendorsDropdown,
}: IRestaurantsVendorDetailsComponentProps) {
  // Props
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => {},
    type: '',
    order: -1,
  };
  // Context

  const { showToast } = useContext(ToastContext);
  const { restaurantsContextData, onSetRestaurantsContextData } =
    useContext(RestaurantsContext);

  // States
  const [formInitialValues, setFormValues] =
    useState<IRestauransVendorDetailsForm>({
      ...initialValues,
    });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Constants

  // API
  // Mutations
  const [createVendor] = useMutation(CREATE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS }],
    onError,
    onCompleted: (data: ICreateVendorResponseGraphQL) => {
      showToast({
        type: 'success',
        title: 'New Vendor',
        message: `Vendor has been ${!showAddForm ? 'selected' : 'added'} successfully`,
        duration: 3000,
      });

      onStepChange(order + 1);
      onSetRestaurantsContextData({
        ...restaurantsContextData,
        vendor: {
          _id: {
            label: data.createVendor?.email,
            code: data.createVendor?._id,
          },
        },
      });
    },
  });

  // Handlers
  const onVendorSubmitHandler = async (
    formData: IRestauransVendorDetailsForm
  ) => {
    try {
      if (showAddForm) {
        await createVendor({
          variables: {
            vendorInput: {
              _id: '',
              email: formData.email,
              password: formData.password,
            },
          },
        });
      } else {
        onSetRestaurantsContextData({
          ...restaurantsContextData,
          vendor: {
            _id: formData?._id ?? null,
          },
        });

        onStepChange(order + 1);
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: `${!showAddForm ? 'Select' : 'Create'} Vendor`,
        message: `Vendor ${!showAddForm ? 'Selection' : 'Create'} Failed`,
        duration: 2500,
      });
    }
  };

  function onError({ graphQLErrors, networkError }: ApolloError) {
    if (!graphQLErrors && !networkError) return;
    showToast({
      type: 'error',
      title: `${!showAddForm ? 'Select' : 'Create'} Vendor`,
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        `Vendor ${!showAddForm ? 'Selection' : 'Create'} Failed`,
      duration: 2500,
    });
  }

  const onSelectVendor = () => {
    const _id = restaurantsContextData?.vendor?._id;

    if (!_id) return;

    setFormValues({
      ...initialValues,
      _id,
    });
  };

  // Use Effects
  useEffect(() => {
    onSelectVendor();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div>
            <Formik
              initialValues={formInitialValues}
              validationSchema={
                showAddForm ? VendorSchema : RestaurantsVendorDetails
              }
              enableReinitialize={true}
              onSubmit={async (values) => {
                await onVendorSubmitHandler(values);
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
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:items-center">
                        <div className="flex flex-shrink-0 items-center justify-end">
                          <CustomInputSwitch
                            label="Add Vendor"
                            isActive={showAddForm}
                            onChange={() => {
                              if (!showAddForm) {
                                setFieldValue('_id', null);
                              }
                              setShowAddForm((prevState) => !prevState);
                            }}
                          />
                        </div>
                      </div>
                      {!showAddForm ? (
                        <div>
                          <CustomDropdownComponent
                            name="_id"
                            placeholder="Select Vendor"
                            showLabel={true}
                            selectedItem={values._id}
                            setSelectedItem={setFieldValue}
                            options={vendorsDropdown ?? []}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                '_id',
                                errors?._id,
                                VendorErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
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
                          </div>
                          <div>
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
                          </div>

                          <div>
                            <CustomPasswordTextField
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
                          </div>

                          <div>
                            <CustomPasswordTextField
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
                          </div>

                          <div>
                            <CustomUploadImageComponent
                              key="image"
                              name="image"
                              title="Upload Profile Image"
                              fileTypes={[
                                'image/jpg',
                                'image/webp',
                                'image/jpeg',
                              ]}
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
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <CustomButton
                          className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                          label="Save & Next"
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
  );
}
