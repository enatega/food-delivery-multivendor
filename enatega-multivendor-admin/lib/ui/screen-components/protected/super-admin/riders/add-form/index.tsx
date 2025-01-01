// Core
import { Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import { IQueryResult } from '@/lib/utils/interfaces';
import { IRiderForm } from '@/lib/utils/interfaces/forms';
import {
  IRidersAddFormComponentProps,
  IRiderZonesResponse,
} from '@/lib/utils/interfaces';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';

// Utilities and Constants
import { RiderErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';
import { RiderSchema } from '@/lib/utils/schema/rider';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import {
  CREATE_RIDER,
  EDIT_RIDER,
  GET_RIDERS,
  GET_ZONES,
} from '@/lib/api/graphql';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useMutation } from '@apollo/client';
import CustomPhoneTextField from '@/lib/ui/useable-components/phone-input-field';

export default function RiderAddForm({
  onHide,
  rider,
  position = 'right',
  isAddRiderVisible,
}: IRidersAddFormComponentProps) {
  const initialValues: IRiderForm = {
    name: '',
    username: '',
    password: '',
    ...rider,
    confirmPassword: rider?.password ?? '',
    phone: rider ? +rider.phone : null,
    zone: rider ? { label: rider.zone.title, code: rider.zone._id } : null,
  };

  // Hooks
  const { showToast } = useToast();

  // Query
  const { data } = useQueryGQL(GET_ZONES, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IRiderZonesResponse | undefined, undefined>;

  // Mutation
  const mutation = rider ? EDIT_RIDER : CREATE_RIDER;
  const [mutate, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_RIDERS }],
  });

  // Form Submission
  const handleSubmit = (
    values: IRiderForm,
    { resetForm }: FormikHelpers<IRiderForm>
  ) => {
    if (data) {
      mutate({
        variables: {
          riderInput: {
            _id: rider ? rider._id : '',
            name: values.name,
            username: values.username,
            password: values.password,
            phone: values.phone?.toString(),
            zone: values.zone?.code,
            available: rider ? rider.available : true,
          },
        },
        onCompleted: () => {
          showToast({
            type: 'success',
            title: 'Success!',
            message: rider ? 'Rider updated' : 'Rider added',
            duration: 3000,
          });
          resetForm();
          onHide();
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
    }
  };

  return (
    <Sidebar
      visible={isAddRiderVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">{rider ? 'Edit' : 'Add'} Rider</span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={RiderSchema}
                onSubmit={handleSubmit}
                enableReinitialize
                validateOnChange={false} // Disable validation on change
                validateOnBlur={false} // Disable validation on blur
              >
                {({
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => {
                  console.log({ errors });
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-4">
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
                              RiderErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

                        <CustomTextField
                          type="text"
                          name="username"
                          placeholder="Username"
                          maxLength={35}
                          value={values.username}
                          onChange={handleChange}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'username',
                              errors?.username,
                              RiderErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

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
                              RiderErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

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
                              RiderErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

                        <CustomDropdownComponent
                          placeholder="Zone"
                          options={
                            data?.zones.map((val) => {
                              return { label: val.title, code: val._id };
                            }) || []
                          }
                          showLabel={true}
                          name="zone"
                          selectedItem={values.zone}
                          setSelectedItem={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'zone',
                              errors?.zone,
                              RiderErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

                        {/* <CustomNumberField
                          min={0}
                          placeholder="Phone Number"
                          name="phone"
                          showLabel={true}
                          value={values.phone}
                          useGrouping={false}
                          onChange={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'phone',
                              errors?.phone,
                              RiderErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        /> */}
                        <CustomPhoneTextField
                          type="text"
                          mask="999-999-9999"
                          placeholder="Phone Number"
                          name="phone"
                          showLabel={true}
                          value={values?.phone?.toString()}
                          onChange={(code: string) => {
                            setFieldValue('phone', code);
                          }}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'phone',
                              errors?.phone,
                              RiderErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />

                        <div className="mt-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                            label={rider ? 'Update' : 'Add'}
                            type="submit"
                            loading={mutationLoading}
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
