// Core
import { ErrorMessage, Form, Formik, FormikHelpers } from 'formik';

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
import { VEHICLE_TYPE } from '@/lib/utils/constants';
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
import { useTranslations } from 'next-intl';

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
    vehicleType: rider
      ? VEHICLE_TYPE.find((vt) => vt?.code === rider?.vehicleType) || null
      : null,
    confirmPassword: rider?.password ?? '',
    phone: rider ? +rider.phone : null,
    zone: rider ? { label: rider.zone.title, code: rider.zone._id } : null,
  };


  // Hooks
  const t = useTranslations();
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
  const handleSubmit = async (
    values: IRiderForm,
    { resetForm }: FormikHelpers<IRiderForm>
  ) => {
    await mutate({
      variables: {
        riderInput: {
          _id: rider ? rider._id : '',
          name: values.name,
          username: values.username,
          password: values.password,
          phone: values.phone?.toString(),
          zone: values.zone?.code,
          vehicleType: values.vehicleType?.code,
          available: rider ? rider.available : true,
        },
      },
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('Success'),
          message: rider ? t('Rider updated') : t('Rider added'),
          duration: 3000,
        });
        resetForm();
        onHide();
      },
      onError: (error) => {
        const message =
          error.graphQLErrors[0]?.message ||
          error.message ||
          t('ActionFailedTryAgain');

        showToast({
          type: 'error',
          title: t('Error'),
          message,
          duration: 3000,
        });
      },
    });
  };

  return (
    <Sidebar
      visible={isAddRiderVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {rider ? t('Edit') : t('Add')} {t('Rider')}
              </span>
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
                  setFieldTouched,
                  touched,
                }) => {
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <CustomTextField
                          type="text"
                          name="name"
                          placeholder={t('Name')}
                          maxLength={35}
                          value={values.name}
                          onChange={handleChange}
                          showLabel={true}
                          error={touched.name ? errors.name : undefined}
                        />

                        <CustomTextField
                          type="text"
                          name="username"
                          placeholder={t('Username')}
                          maxLength={35}
                          value={values.username}
                          onChange={handleChange}
                          showLabel={true}
                          error={touched.username ? errors.username : undefined}
                        />

                        <CustomPasswordTextField
                          placeholder={t('Password')}
                          name="password"
                          maxLength={20}
                          value={values.password}
                          showLabel={true}
                          onChange={handleChange}
                          style={{
                            borderColor:
                              touched.password && errors.password ? 'red' : '',
                          }}
                        />
                        <ErrorMessage
                          name="password"
                          component="p"
                          className="text-sm text-red-500"
                        />

                        <CustomPasswordTextField
                          placeholder={t('Confirm Password')}
                          name="confirmPassword"
                          maxLength={20}
                          showLabel={true}
                          value={values.confirmPassword ?? ''}
                          onChange={handleChange}
                          feedback={false}
                          style={{
                            borderColor:
                              touched.confirmPassword && errors.confirmPassword
                                ? 'red'
                                : '',
                          }}
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="p"
                          className="text-sm text-red-500"
                        />

                        <CustomDropdownComponent
                          placeholder={t('Vehicle Type')}
                          options={VEHICLE_TYPE}
                          showLabel={true}
                          name="vehicleType"
                          selectedItem={values.vehicleType}
                          setSelectedItem={setFieldValue}
                          style={{
                            borderColor:
                              touched.vehicleType && errors.vehicleType
                                ? 'red'
                                : '',
                          }}
                        />
                        <ErrorMessage
                          name="vehicleType"
                          component="p"
                          className="text-sm text-red-500"
                        />

                        <CustomDropdownComponent
                          placeholder={t('Zone')}
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
                            borderColor:
                              touched.zone && errors.zone ? 'red' : '',
                          }}
                        />
                        <ErrorMessage
                          name="zone"
                          component="p"
                          className="text-sm text-red-500"
                        />

                        <CustomPhoneTextField
                          type="text"
                          mask="999-999-9999"
                          placeholder={t('Phone Number')}
                          name="phone"
                          showLabel={true}
                          value={values?.phone?.toString()}
                          // onChange={(code: string) => {
                          //   setFieldValue('phone', code);
                          // }}
                          onChange={(code: string) => {
                            setFieldValue('phone', code);
                            setFieldTouched('phone', true, false); // Mark as touched immediately
                          }}
                          style={{
                            borderColor:
                              touched.phone && errors.phone ? 'red' : '',
                          }}
                        />
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="text-sm text-red-500"
                        />

                        <div className="mt-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit border-gray-300 border dark:border-dark-600 bg-black  px-8 text-white"
                            label={rider ? t('Update') : t('Add')}
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
