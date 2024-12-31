// Core
import { ApolloError, useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';
import { ProfileContext } from '@/lib/context/vendor/profile.context';

// Interface and Types
import { IVendorForm } from '@/lib/utils/interfaces/forms';

// Constants and Methods
import { MAX_SQUARE_FILE_SIZE, VendorErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// Schema
import { VendorEditSchema } from '@/lib/utils/schema';

// GraphQL
import { EDIT_VENDOR } from '@/lib/api/graphql';

// Icons
import CustomPhoneTextField from '@/lib/ui/useable-components/phone-input-field';

const initialValues: IVendorForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  image: '',
  phoneNumber: '',
  lastName: '',
  firstName: '',
};

export default function VendorUpdateForms() {
  // Context
  const { showToast } = useContext(ToastContext);
  const { vendorProfileResponse } = useContext(ProfileContext);
  let vendor = vendorProfileResponse.data?.getVendor;

  // States
  const [formInitialValues, setFormValues] = useState<IVendorForm>({
    ...initialValues,
  });
  const [profileImage, setprofileImage] = useState('');

  // API
  // Mutations
  const [updateVendor] = useMutation(EDIT_VENDOR, {
    //  refetchQueries: [{ query: GET_VENDORS, fetchPolicy: 'network-only' }],
    onError,
    onCompleted: () => {},
  });

  // Handlers
  const onVendorCreate = async (data: IVendorForm) => {
    try {
      await updateVendor({
        variables: {
          vendorInput: {
            _id: vendor?._id,
            name: data?.name ?? ' ',
            email: data?.email,
            password: data?.password,
            image: data?.image,
            lastName: data?.lastName,
            phoneNumber: `${data.phoneNumber?.toString()}`,
            firstName: data?.firstName,
          },
        },
      });

      showToast({
        type: 'success',
        title: 'Edit Vendor',
        message: `Vendor has been edited successfully`,
        duration: 3000,
      });
      // setIsUpdateProfileVisible(false);
    } catch (error) {
      console.log('error', error);

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

  //  Effects
  useEffect(() => {
    if (vendor) {
      setFormValues({
        name: vendor?.name ?? '',
        email: vendor?.email ?? '',
        password: vendor?.plainPassword ?? '',
        confirmPassword: vendor?.plainPassword ?? '',
        image: vendor?.image || '',
        phoneNumber: vendor?.phoneNumber ?? '',
        lastName: vendor?.lastName ?? '',
        firstName: vendor?.firstName ?? '',
      });
      setprofileImage(vendor?.image || '');
    }
  }, [vendor]);

  return (
    <div className="flex h-full w-full items-center justify-start overflow-y-auto">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
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
                console.log('errors', errors);
                return (
                  <>
                    <div>
                      <Form onSubmit={handleSubmit}>
                        <div className="edit-profile-file-upload ml-[11px] space-y-3 rounded-[10px] border border-[#E4E4E7] p-[34px] max-[991px]:p-[20px]">
                          <div className="mb-[32px] flex flex-wrap max-[991px]:mb-[20px] max-[400px]:mb-[0px] max-[400px]:justify-center">
                            <div className="h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={
                                  profileImage ||
                                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWpobWs-3hvPvk690kT3zKFY7BVXScJfLomw&s'
                                }
                                alt="profile"
                                className="h-full w-full object-cover"
                                width={120}
                                height={120}
                                objectFit="cover"
                              />
                            </div>
                            ;
                            <div className="sm:pl-[50px] remove-gap">
                              <CustomUploadImageComponent
                                key="image"
                                name="image"
                                title=""
                                page="vendor-profile-edit"
                                // onChange={memoizedCallback}
                                fileTypes={['image/png', 'image/jpg']}
                                maxFileHeight={512}
                                maxFileWidth={512}
                                maxFileSize={MAX_SQUARE_FILE_SIZE}
                                onSetImageUrl={setFieldValue}
                                showExistingImage={false}
                                orientation={'SQUARE'}
                              />
                            </div>
                          </div>
                          <div className="border-t border-[#E4E4E7] pt-[32px] max-[991px]:pt-[20px]">
                            <div>
                              <h3 className="pb-[32px] text-[20px] font-semibold text-[#18181B] max-[991px]:pb-[8px]">
                                Personal Information
                              </h3>
                            </div>
                          </div>
                          <div className="!mb-8 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                            <div>
                              <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                                First Name
                              </label>
                              <CustomTextField
                                type="text"
                                name="firstName"
                                placeholder=""
                                maxLength={35}
                                value={values.firstName}
                                onChange={handleChange}
                                showLabel={true}
                                style={{
                                  borderColor: onErrorMessageMatcher(
                                    'firstName',
                                    errors?.firstName,
                                    VendorErrors
                                  )
                                    ? 'red'
                                    : '',
                                }}
                                className="rounded-[6px] border-[#D1D5DB]"
                              />
                            </div>

                            <div>
                              <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                                Last Name
                              </label>
                              <CustomTextField
                                type="text"
                                name="lastName"
                                placeholder=""
                                maxLength={35}
                                value={values.lastName}
                                onChange={handleChange}
                                showLabel={true}
                                className="rounded-[6px] border-[#D1D5DB]"
                              />
                            </div>
                            <div>
                              <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                                Email
                              </label>
                              <CustomTextField
                                type="email"
                                name="email"
                                placeholder=""
                                maxLength={35}
                                showLabel={true}
                                className="rounded-[6px] border-[#D1D5DB]"
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
                              <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                                Phone
                              </label>
                              <CustomPhoneTextField
                                mask="999-999-9999"
                                name="phoneNumber"
                                showLabel={true}
                                page="vendor-profile-edit"
                                // placeholder="Phone Number"
                                onChange={(e) => {
                                  // console.log("phone number format ==> ", e, code);
                                  setFieldValue('phoneNumber', e);
                                  // setCountryCode(code);
                                }}
                                value={values.phoneNumber}
                                // value={values.phoneNumber?.toString().match(/\(\+(\d+)\)\s(.+)/)?.[2]}
                                type="text"
                                style={{
                                  borderColor: onErrorMessageMatcher(
                                    'phoneNumber',
                                    errors?.phoneNumber,
                                    VendorErrors
                                  )
                                    ? 'red'
                                    : '',
                                }}
                                className="rounded-[6px] border-[#D1D5DB]"
                              />
                            </div>
                          </div>

                          <div className="border-t border-[#E4E4E7] pt-[32px] max-[991px]:pt-[20px]">
                            <div>
                              <h3 className="pb-[32px] text-[20px] font-semibold text-[#18181B] max-[991px]:pb-[20px]">
                                Change Password
                              </h3>
                            </div>
                          </div>

                          <div className="!mt-0 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                            <div>
                              <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                                Current Password
                              </label>
                              <CustomPasswordTextField
                                autoComplete="new-password"
                                placeholder=""
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
                                className="rounded-[6px] border-[#D1D5DB]"
                              />
                            </div>
                            <div>
                              <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                                {' '}
                                New Password
                              </label>
                              <CustomPasswordTextField
                                autoComplete="new-password"
                                placeholder=""
                                name="password"
                                maxLength={20}
                                value={values.password}
                                showLabel={true}
                                style={{
                                  borderColor: onErrorMessageMatcher(
                                    'password',
                                    errors?.password,
                                    VendorErrors
                                  )
                                    ? 'red'
                                    : '',
                                }}
                                onChange={handleChange}
                                className="rounded-[6px] border-[#D1D5DB]"
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <CustomButton
                              className="h-10 w-[65px] border-gray-300 bg-[#18181B] text-center text-[#FAFAFA]"
                              label={'Save'}
                              type="submit"
                              loading={isSubmitting}
                            />
                          </div>
                        </div>
                      </Form>
                    </div>
                  </>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
