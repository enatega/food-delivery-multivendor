'use client';
// Contexts
import { CREATE_CUISINE, EDIT_CUISINE, GET_CUISINES } from '@/lib/api/graphql';

// Contexts
import { ToastContext } from '@/lib/context/global/toast.context';

// Components
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { IAddCuisineProps } from '@/lib/utils/interfaces/cuisine.interface';

// Schema
import { CuisineFormSchema } from '@/lib/utils/schema';
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';

// Hooks
import { ApolloError, useMutation } from '@apollo/client';
import { useContext } from 'react';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import {
  CuisineErrors,
  MAX_SQUARE_FILE_SIZE,
} from '@/lib/utils/constants';
import { useTranslations } from 'next-intl';
import { useShopTypes } from '@/lib/hooks/useShopType';

export default function CuisineForm({
  setVisible,
  setIsEditing,
  isEditing,
  visible,
}: IAddCuisineProps) {
  // Utility function to capitalize the first word of a string
  const capitalizeFirstWord = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Hooks
  const t = useTranslations();
  const { showToast } = useContext(ToastContext);

  // Initial values
  const initialValues = {
    _id: isEditing.bool ? isEditing?.data?._id : '',
    name: isEditing.bool ? isEditing?.data?.name : '',
    description: isEditing.bool ? isEditing?.data?.description : '',
    shopType: {
      label: capitalizeFirstWord(isEditing?.data?.shopType ?? ''),
      code: isEditing?.data?.shopType.toLocaleLowerCase() ?? '',
    },
    image: isEditing.bool ? isEditing.data.image : '',
  };
  const { dropdownList, loading } = useShopTypes({
    invoke_now: true,
    transform_to_dropdown_list: true,
  });

  // Mutations
  const [CreateCuisine, { loading: createCuisineLoading }] = useMutation(
    CREATE_CUISINE,
    {
      onError,
      onCompleted: () => {
        showToast({
          title: `${!isEditing.bool ? t('New') : t('Edit')} ${t('Cuisine')}`,
          type: 'success',
          message: `${t('Cuisine has been')} ${!isEditing.bool ? t('Created') : t('edited')} ${t('successfully')}`,
          duration: 2000,
        });
      },
      refetchQueries: [{ query: GET_CUISINES }],
    }
  );
  console.log(isEditing.data);

  const [editCuisine, { loading: editCuisineLoading }] = useMutation(
    EDIT_CUISINE,
    {
      onError,
      onCompleted: () => {
        showToast({
          title: `${!isEditing.bool ? t('New') : t('Edit')} ${t('Cuisine')}`,
          type: 'success',
          message: `${t('Cuisine has been')} ${!isEditing.bool ? t('Created') : t('edited')} ${t('successfully')}`,
          duration: 2000,
        });
      },
      refetchQueries: [{ query: GET_CUISINES }],
    }
  );

  // API Handlers
  function onError({ cause, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: `${isEditing.bool ? t('Edit') : t('New')}  ${t('Cuisine')}`,
      message:
        cause?.message ??
        networkError?.message ??
        ` ${t('Cuisine')} ${isEditing.bool ? t('Edition') : t('Creation')}  ${t('Failed')}`,
      duration: 2500,
    });
  }

  return (
    <Sidebar
      visible={visible}
      onHide={() => {
        setIsEditing({
          bool: false,
          data: {
            __typename: '',
            _id: '',
            description: '',
            name: '',
            shopType: '',
            image: '',
          },
        });
        setVisible(false);
      }}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <div className="flex flex-col gap-4">
        <h2 className="mb-3 text-xl font-bold">
          {isEditing.bool ? t('Edit') : t('Add')} {t('Cuisine')}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={CuisineFormSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            let formData;
            if (!isEditing.bool) {
              formData = {
                name: values.name,
                description: values.description,
                shopType: values.shopType.label,
                image: values.image,
              };
            } else {
              formData = {
                _id: values._id,
                name: values.name,
                description: values.description,
                shopType: values.shopType.label,
                image: values.image,
              };
            }
            if (!isEditing.bool) {
              await CreateCuisine({
                variables: {
                  cuisineInput: formData,
                },
              });
            } else {
              await editCuisine({
                variables: {
                  cuisineInput: formData,
                },
              });
            }

            setVisible(false);
            setSubmitting(false);
            setIsEditing({
              bool: false,
              data: {
                __typename: '',
                _id: '',
                description: '',
                name: '',
                shopType: '',
                image: '',
              },
            });
          }}
          validateOnChange={false}
          enableReinitialize
        >
          {({
            errors,
            handleSubmit,
            handleChange,
            values,
            isSubmitting,
            setFieldValue,
            touched,
          }) => {
            return (
              <Form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <CustomTextField
                    showLabel={true}
                    name="name"
                    onChange={handleChange}
                    value={values.name}
                    type="text"
                    error={touched.name && errors.name ? errors.name : ''}
                    placeholder={t('Name')}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'name',
                        errors?.name,
                        CuisineErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />

                  <CustomTextAreaField
                    showLabel={true}
                    label={t('Description')}
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                    error={
                      touched.description && errors.description
                        ? errors.description
                        : ''
                    }
                    placeholder={t('Description')}
                    rows={5}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'description',
                        errors?.description,
                        CuisineErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />

                  <CustomDropdownComponent
                    name="shopType"
                    options={dropdownList ?? []}
                    selectedItem={values.shopType}
                    setSelectedItem={setFieldValue}
                    placeholder={t('Shop Category')}
                    showLabel={true}
                    loading={loading}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'shopType',
                        errors?.shopType?.code,
                        CuisineErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />

                  <CustomUploadImageComponent
                    name="image"
                    error={touched.image && errors.image ? errors.image : ''}
                    onSetImageUrl={setFieldValue}
                    title={t('Upload Image')}
                    existingImageUrl={
                      isEditing.bool ? isEditing.data.image : ''
                    }
                    showExistingImage={
                      isEditing.bool && isEditing.data.image ? true : false
                    }
                    fileTypes={['image/jpeg', 'image/jpg', 'image/webp']}
                    maxFileHeight={1080}
                    maxFileWidth={1080}
                    maxFileSize={MAX_SQUARE_FILE_SIZE}
                    orientation="SQUARE"
                  />

                  <button
                    className="float-end my-2 block rounded-md bg-black px-12 py-2 text-white"
                    disabled={
                      isSubmitting || createCuisineLoading || editCuisineLoading
                    }
                    type="submit"
                  >
                    {isSubmitting ||
                    createCuisineLoading ||
                    editCuisineLoading ? (
                      <ProgressSpinner
                        className="m-0 h-6 w-6 items-center self-center p-0"
                        strokeWidth="5"
                        style={{ fill: 'white', accentColor: 'white' }}
                        color="white"
                      />
                    ) : isEditing.bool ? (
                      t('Update')
                    ) : (
                      t('Add')
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Sidebar>
  );
}
