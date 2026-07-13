// Core
import { Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import {
  IQueryResult,
  IZoneAddFormComponentProps,
} from '@/lib/utils/interfaces';
import { IRiderZonesResponse } from '@/lib/utils/interfaces';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
// Utilities and Constants
import { ZoneErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';
import { ZoneSchema } from '@/lib/utils/schema';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import { CREATE_ZONE, EDIT_ZONE, GET_ZONES } from '@/lib/api/graphql';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { ApolloError, useMutation } from '@apollo/client';
import { IZoneForm } from '@/lib/utils/interfaces/forms/zone.form.interface';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomGoogleMapsLocationZoneBounds from '@/lib/ui/useable-components/google-maps/location-bounds-zone';
import { TPolygonPoints } from '@/lib/utils/types';
import { useTranslations } from 'next-intl';
import { GoogleMapsContext } from '@/lib/context/global/google-maps.context';
import { ChangeEvent, useContext } from 'react';

const DESCRIPTION_MAX_LENGTH = 100;

export default function ZoneAddForm({
  onHide,
  zone,
  position = 'right',
  isAddZoneVisible,
}: IZoneAddFormComponentProps) {
  // State
  const initialValues: IZoneForm = {
    _id: zone?._id ?? '',
    title: zone?.title || '',
    description: zone?.description || '',
    coordinates: zone?.location?.coordinates ?? [[[]]],
  };

  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // Context
  const { isLoaded } = useContext(GoogleMapsContext);

  // Query
  const { data } = useQueryGQL(GET_ZONES, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IRiderZonesResponse | undefined, undefined>;

  // Mutation
  const [createZone, { loading: mutationLoading }] = useMutation(
    zone ? EDIT_ZONE : CREATE_ZONE,
    {
      refetchQueries: [{ query: GET_ZONES }],
    }
  );

  // Form Submission
  const handleSubmit = (
    values: IZoneForm,
    { resetForm }: FormikHelpers<IZoneForm>
  ) => {
    if (values.coordinates[0].length < 2) {
      return showToast({
        type: 'error',
        title: 'Zone not selected',
        message: 'Please provide a valid zone',
      });
    }
    if (data) {
      createZone({
        variables: {
          zone: {
            _id: zone ? zone._id : '',
            title: values.title,
            description: values.description,
            coordinates:
              Array.isArray(values.coordinates) &&
              Array.isArray(values.coordinates[0]) &&
              Array.isArray(values.coordinates[0][0]) &&
              values.coordinates[0][0].length > 1
                ? values.coordinates
                : [[[0, 0]]],
          },
        },
        onCompleted: () => {
          showToast({
            type: 'success',
            title: `${zone ? t('New') : t('Edit')} ${t('Zone')}`,
            message: `${t('Zone has been')} ${zone ? t('updated') : t('added')} ${t('successfully')}`,
          });
          resetForm();
          onHide();
        },
        onError: ({ graphQLErrors, networkError }: ApolloError) => {
          const message =
            graphQLErrors[0]?.message ??
            networkError?.message ??
            t('Something went wrong, Please try again');

          showToast({
            type: 'error',
            title: `${zone ? t('New') : t('Edit')} ${t('Zone')}`,
            message,
          });
        },
      });
    }
  };




  return (
    <Sidebar
      visible={isAddZoneVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {zone ? t('Edit') : t('Add')} {t('Zone')}
              </span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={ZoneSchema}
                onSubmit={handleSubmit}
                enableReinitialize
                validateOnChange={false}
              >
                {({
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                }) => {
                  const handleDescriptionChange = (
                    event: ChangeEvent<HTMLTextAreaElement>
                  ) => {
                    const { value } = event.target;
                    if (value.length > DESCRIPTION_MAX_LENGTH) {
                      showToast({
                        type: 'error',
                        title: t('Description'),
                        message: t('Character limit of max length 100'),
                      });
                      setFieldValue(
                        'description',
                        value.slice(0, DESCRIPTION_MAX_LENGTH)
                      );
                      return;
                    }
                    handleChange(event);
                  };

                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="mb-4 space-y-4">
                        <div>
                          <CustomTextField
                            type="text"
                            name="title"
                            placeholder={t('Title')}
                            maxLength={35}
                            value={values.title}
                            onChange={handleChange}
                            showLabel={true}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'title',
                                errors?.title,
                                ZoneErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                        <div>
                          <CustomTextAreaField
                            name="description"
                            placeholder={t('Description')}
                            value={values.description}
                            onChange={handleDescriptionChange}
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            showLabel={true}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'description',
                                errors?.description,
                                ZoneErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>

                        {isLoaded && (
                          <CustomGoogleMapsLocationZoneBounds
                            key={values?._id}
                            _id={values?._id ?? ''}
                            _path={values?.coordinates}
                            onSetZoneCoordinates={(path: TPolygonPoints) =>
                              setFieldValue('coordinates', path)
                            }
                          />
                        )}

                        <div className="mt-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit  border-gray-300 border dark:border-dark-600 bg-black px-8 text-white "
                            label={zone ? t('Update') : t('Add')}
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
