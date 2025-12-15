import { CREATE_BANNER_RESTAURANT, EDIT_BANNER_RESTAURANT } from '@/lib/api/graphql/mutations/bannerRestaurant';
import { GET_BANNER_RESTAURANTS } from '@/lib/api/graphql/queries/bannerRestaurant';
import { GET_FOODS_BY_RESTAURANT_ID } from '@/lib/api/graphql/queries/food';
import useToast from '@/lib/hooks/useToast';
import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';
import {
  BannerRestaurantErrors,
  MAX_LANSDCAPE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
} from '@/lib/utils/constants';
import { ICategory, IFood } from '@/lib/utils/interfaces';
import {
  IBannerRestaurantAddFormComponentProps,
  IBannerRestaurantForm
} from '@/lib/utils/interfaces/banner.restaurant.interface';
import { IDropdownSelectItem } from '@/lib/utils/interfaces/global.interface';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { BannerRestaurantSchema } from '@/lib/utils/schema/banner.restaurant';
import { useMutation, useQuery } from '@apollo/client';
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslations } from 'next-intl';
import { Sidebar } from 'primereact/sidebar';
import { useEffect, useState } from 'react';

const BannerRestaurantAddForm = ({
  isAddBannerVisible,
  onHide,
  banner,
  restaurantId,
  position = 'right',
}: IBannerRestaurantAddFormComponentProps) => {
  console.log("🚀 ~ restaurantId:", restaurantId)
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();
  const [foodItems, setFoodItems] = useState<IDropdownSelectItem[]>([]);

  // Query to get food items from the restaurant
  const { data: foodData, loading: foodLoading } = useQuery(GET_FOODS_BY_RESTAURANT_ID, {
    variables: { id: restaurantId },
    skip: !restaurantId,
    fetchPolicy: 'cache-and-network'
  });
  console.log("🚀 ~ foodData:", foodData)

  

  // Prepare food items for dropdown
  useEffect(() => {
    if (foodData?.restaurant?.categories) {
      const items: IDropdownSelectItem[] = [];
      
      foodData.restaurant.categories.forEach((category: ICategory) => {
        if (category.foods && category.foods.length > 0) {
          category.foods.forEach((food: IFood) => {
            items.push({
              label: food.title,
              code: food._id,
            //   category: category.title || 'General'
            });
          });
        }
      });
      
      setFoodItems(items);
    }
  }, [foodData]);

  //State
  const initialValues: IBannerRestaurantForm = {
    title: banner?.title || '',
    description: banner?.description || '',
    foodId: banner
      ? {
          label: banner.foodTitle || '',
          code: banner.foodId
        }
      : null,
    file: banner?.file || '',
  };

  const mutation = banner ? EDIT_BANNER_RESTAURANT : CREATE_BANNER_RESTAURANT;
  const [mutate, { loading: mutationLoading }] = useMutation(mutation, {
    refetchQueries: [{ query: GET_BANNER_RESTAURANTS, variables: { restaurantId } }],
  });

  // Form Submission
  const handleSubmit = (
    values: IBannerRestaurantForm,
    { resetForm }: FormikHelpers<IBannerRestaurantForm>
  ) => {
    mutate({
      variables: {
        bannerInput: {
          _id: banner ? banner._id : '',
          title: values.title,
          description: values.description,
          file: values.file,
          foodId: values.foodId?.code,
          restaurant: restaurantId
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
                {banner ? t('Edit') : t('Add')} {t('Food Banner')}
              </span>
            </div>

            <div>
              <Formik
                initialValues={initialValues}
                validationSchema={BannerRestaurantSchema}
                onSubmit={handleSubmit}
                enableReinitialize
                validateOnChange={false}
                validateOnBlur={false}
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
                                BannerRestaurantErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                          {errors.title && (
                            <div className="text-red-500 text-xs mt-1">{errors.title}</div>
                          )}
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
                                BannerRestaurantErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                          {errors.description && (
                            <div className="text-red-500 text-xs mt-1">{errors.description}</div>
                          )}
                        </div>

                        <div>
                          <CustomDropdownComponent
                            placeholder={t('Select Food')}
                            options={foodItems}
                            showLabel={true}
                            name="foodId"
                            filter={true}
                            loading={foodLoading}
                            selectedItem={values.foodId}
                            setSelectedItem={setFieldValue}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'foodId',
                                errors?.foodId,
                                BannerRestaurantErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                          
                          {errors.foodId && (
                            <div className="text-red-500 text-xs mt-1">{t('Please select a food item')}</div>
                          )}
                        </div>

                        <div
                          className={`${
                            errors.file && !values.file
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
                          {errors.file && (
                            <div className="text-red-500 text-xs mt-1">{t('Please upload an image or video')}</div>
                          )}
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

export default BannerRestaurantAddForm;