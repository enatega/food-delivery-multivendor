
// import { createBanner, editBanner } from '@/lib/api/graphql/mutation/banners';
import { CREATE_BANNER, EDIT_BANNER, GET_RESTAURANTS } from '@/lib/api/graphql';
import { GET_BANNERS } from '@/lib/api/graphql/queries/banners';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';
// import useToast from '@/lib/hooks/useToast';
import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';
import {
  ACTION_TYPES,
  BannersErrors,
  MAX_LANSDCAPE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  SCREEN_NAMES,
} from '@/lib/utils/constants';
import {
  IQueryResult,
  IRestaurantsResponseGraphQL,
} from '@/lib/utils/interfaces';
import { IBannersAddFormComponentProps } from '@/lib/utils/interfaces/banner.interface';
import { IBannersForm } from '@/lib/utils/interfaces/forms/banners.form.interface';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { getLabelByCode } from '@/lib/utils/methods/label-by-code';
import { BannerSchema } from '@/lib/utils/schema/banner';
import { useMutation } from '@apollo/client';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslations } from 'next-intl';
import { Sidebar } from 'primereact/sidebar';
import { use, useMemo } from 'react';

const BannersAddForm = ({
  isAddBannerVisible,
  onHide,
  banner,
  position = 'right',
}: IBannersAddFormComponentProps) => {
  // Queries
  const { data, loading } = useQueryGQL(GET_RESTAURANTS, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IRestaurantsResponseGraphQL | undefined, undefined>;

  // Hooks
  const t = useTranslations();
  
  const RESTAURANT_NAMES = useMemo(() => {
    return data?.restaurants?.data?.map((v) => ({
      label: v.name,
      code: v._id,
    })) ?? []; // Using nullish coalescing operator
  }, [data]);
  console.log(data, 'data from restaurants query');
  //State
  const initialValues: IBannersForm = {
    title: banner?.title || '',
    description: banner?.description || '',
    action: banner
      ? {
        label: getLabelByCode(ACTION_TYPES, banner.action),
        code: banner.action,
      }
      : null,
    screen: banner
      ? banner.action === 'Navigate Specific Page'
        ? {
          label: getLabelByCode(SCREEN_NAMES, banner.screen),
          code: banner.screen,
        }
        : banner.action === 'Navigate Specific Restaurant'
          ? {
            label: banner.screen,
            code: banner.screen,
          }
          : null
      : null,
    file: banner?.file || '',
  };

  // Hooks
  const { showToast } = useToast();

  const mutation = banner ? EDIT_BANNER : CREATE_BANNER;
  const [mutate, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_BANNERS }],
  });

  // Form Submission
  const handleSubmit = (
    values: IBannersForm,
    { resetForm }: FormikHelpers<IBannersForm>
  ) => {
    if (data) {
      mutate({
        variables: {
          bannerInput: {
            _id: banner ? banner._id : '',
            title: values.title,
            description: values.description,
            file: values.file,
            action: values.action?.code,
            screen: values.screen?.code,
          },
        },
        onCompleted: () => {
          showToast({
            type: 'success',
            title: t('Success'),
            message: banner ? t('Banner updated') : t('Banner added'),
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
            message = t('ActionFailedTryAgain');
          }
          showToast({
            type: 'error',
            title: t('Error'),
            message,
            duration: 3000,
          });
        },
      });
    }
  };

  return (
    <Sidebar
      visible={isAddBannerVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px] py-4"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {banner ? t('Edit') : t('Add')} {t('Banner')}
              </span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={BannerSchema}
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
                  return (
                    <Form onSubmit={handleSubmit}>
                      <div className="space-y-4">
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
                                BannersErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>
                        <div>
                          <CustomTextField
                            type="text"
                            name="description"
                            placeholder={t('Description')}
                            maxLength={35}
                            value={values.description}
                            onChange={handleChange}
                            showLabel={true}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'description',
                                errors?.description,
                                BannersErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>

                        <div>
                          <CustomDropdownComponent
                            placeholder={t('Actions')}
                            options={ACTION_TYPES}
                            showLabel={true}
                            name="action"
                            filter={false}
                            selectedItem={values.action}
                            setSelectedItem={setFieldValue}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'action',
                                errors?.action,
                                BannersErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>

                        <div>
                          <CustomDropdownComponent
                            placeholder={t('Screen')}
                            options={
                              values.action?.code ===
                                'Navigate Specific Restaurant'
                                ? RESTAURANT_NAMES
                                : values.action?.code ===
                                  'Navigate Specific Page'
                                  ? SCREEN_NAMES
                                  : []
                            }
                            showLabel={true}
                            name="screen"
                            // loading={loading && values.action?.code === 'Navigate Specific Restaurant'}
                            selectedItem={values.screen}
                            setSelectedItem={setFieldValue}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'screen',
                                errors?.screen,
                                BannersErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        </div>

                        <div
                          className={`${errors.file && !values.file
                            ? 'border-red-500'
                            : 'border-gray-200'
                            } rounded-lg border p-4`}
                        >
                          <CustomUploadImageComponent
                            key={'file'}
                            name="file"
                            title={t('Upload file')}
                            fileTypes={[
                              'image/jpg',
                              'image/webp',
                              'video/mp4',
                              '.webm',
                              'video/webm',
                              '.mp4',
                              'image/jpeg',
                              'image/gif',
                            ]}
                            maxFileHeight={841}
                            maxFileWidth={1980}
                            maxFileSize={MAX_LANSDCAPE_FILE_SIZE}
                            maxVideoSize={MAX_VIDEO_FILE_SIZE}
                            orientation="LANDSCAPE"
                            onSetImageUrl={setFieldValue}
                            showExistingImage={banner ? true : false}
                            existingImageUrl={banner && values.file}
                          />
                        </div>

                        <div className="m-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                            label={banner ? t('Update') : t('Add')}
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
};

export default BannersAddForm;
