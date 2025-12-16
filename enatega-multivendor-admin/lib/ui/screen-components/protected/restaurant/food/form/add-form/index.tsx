'use client';

// Core imports
import { useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// PrimeReact components
import { Sidebar } from 'primereact/sidebar';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Interfaces
import { IFoodAddFormComponentProps } from '@/lib/utils/interfaces';
import {
  IFoodDetailsForm,
  IFoodNewFormValues, // Added
  IVariationInput,
  IFoodInput,
  IVariationForm,
} from '@/lib/utils/interfaces/forms/food.form.interface';
import { IDropdownSelectItem } from '@/lib/utils/interfaces/global.interface';

// Components
import FoodDetails from './food.index';
import VariationAddForm from './variations';
import { useTranslations } from 'next-intl';

// API
import { ApolloError, useMutation } from '@apollo/client';
import {
  GET_FOODS_BY_RESTAURANT_ID,
  CREATE_FOOD_SINGLE_VENDOR,
  UPDATE_FOOD_SINGLE_VENDOR,
  GET_ALL_FOODS_PAGINATED,
} from '@/lib/api/graphql';
import useToast from '@/lib/hooks/useToast';
import { FoodSchema, VariationSchema } from '@/lib/utils/schema';

// Error Handling
import { ProgressSpinner } from 'primereact/progressspinner';

const FoodForm = ({ position = 'right' }: IFoodAddFormComponentProps) => {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // Context
  const { isFoodFormVisible, onClearFoodData, foodContextData } =
    useContext(FoodsContext);

  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData.restaurantId;

  // Mutations
  const [createFood, { loading: createFoodLoading }] = useMutation(
    CREATE_FOOD_SINGLE_VENDOR,
    {
      refetchQueries: [
        {
          query: GET_FOODS_BY_RESTAURANT_ID,
          variables: { id: restaurantId },
        },
        {
          query: GET_ALL_FOODS_PAGINATED,
          variables: {
            restaurantId,
            page: 1, // Reset to page 1 after creating new food
            limit: 10,
          },
        },
      ],
    }
  );

  const [updateFood, { loading: updateFoodLoading }] = useMutation(
    UPDATE_FOOD_SINGLE_VENDOR,
    {
      refetchQueries: [
        {
          query: GET_FOODS_BY_RESTAURANT_ID,
          variables: { id: restaurantId },
        },
        {
          query: GET_ALL_FOODS_PAGINATED,
          variables: {
            restaurantId,
            page: 1, // Reset to page 1 after updating food
            limit: 10,
          },
        },
      ],
    }
  );

  const onSidebarHideHandler = () => {
    if (!createFoodLoading && !updateFoodLoading) {
      onClearFoodData();
    }
  };

  // Initial Values
  const getInitialValues = () => {
    // Basic Food Data
    const basicInfo: IFoodDetailsForm = {
      _id: foodContextData?.food?.data?._id || '',
      title: foodContextData?.food?.data?.title || '',
      description: foodContextData?.food?.data?.description || '',
      image: foodContextData?.food?.data?.image || '',
      category: foodContextData?.food?.data?.category || null,
      subCategory: foodContextData?.food?.data?.subCategory || null,
      inventory: foodContextData?.food?.data?.inventory || null,
      uom: foodContextData?.food?.data?.uom || '',
      minQuantity: foodContextData?.food?.data?.minQuantity || null,
      maxQuantity: foodContextData?.food?.data?.maxQuantity || null,
      isActive: foodContextData?.food?.data?.isActive ?? true, // Added default
      __typename: foodContextData?.food?.data?.__typename ?? 'Food', // Added default
      isOutOfStock: foodContextData?.food?.data?.isOutOfStock ?? false, // Added default
    };

    // Variations Data
    const variations = (
      (foodContextData?.food?.variations ?? []).length > 0
        ? foodContextData?.food?.variations
        : [
            {
              title: '',
              price: 0,
              discounted: 0,
              addons: [],
              isOutOfStock: false,
            },
          ]
    ) as IVariationForm[];

    return {
      ...basicInfo,
      variations,
    };
  };

  // Validation Schema
  const CombinedSchema = Yup.object().shape({
    ...FoodSchema.fields,
    variations: Yup.array()
      .of(VariationSchema)
      .min(1, 'At least one variation is required')
      .required('Required'),
  });

  const handleSubmit = async (
    values: IFoodNewFormValues, // Changed from IFoodNew
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setSubmitting(true);
    try {
      if (foodContextData?.isEditing) {
        // For editing, use UPDATE_FOOD_SINGLE_VENDOR
        const _variations: IVariationInput[] = values.variations.map((item) => {
          const variation: IVariationInput = {
            id: item._id,
            title: item.title,
            price: Number(item.price),
            discounted: item.discounted ? Number(item.discounted) : undefined,
            addons: item?.addons ? (item.addons.map((addon: IDropdownSelectItem | string) => (typeof addon === 'object' ? addon.code : addon)).filter(Boolean) as string[]) : [],
            isOutOfStock: item.isOutOfStock || false,
          };

          // Add deal if present
          if (item.deal) {
            let dealTitle: string;
            let dealDiscountType: string;
            let dealDiscountValue: number;
            let dealStartDate: Date;
            let dealEndDate: Date;
            let dealIsActive: boolean;

            if ('name' in item.deal && typeof item.deal.name === 'string') { // IFoodDealType
                dealTitle = item.deal.name;
                dealDiscountType = item.deal.type;
                dealDiscountValue = item.deal.value;
                dealStartDate = new Date(item.deal.startDate);
                dealEndDate = new Date(item.deal.endDate);
                dealIsActive = item.deal.isActive;
            } else if ('dealName' in item.deal && item.deal.dealName) { // IDealFormValues or IDeal with dealName
                dealTitle = item.deal.dealName;
                dealDiscountType = item.deal.discountType || '';
                dealDiscountValue = item.deal.discountValue || 0;
                dealStartDate = item.deal.startDate instanceof Date ? item.deal.startDate : new Date(item.deal.startDate);
                dealEndDate = item.deal.endDate instanceof Date ? item.deal.endDate : new Date(item.deal.endDate);
                dealIsActive = item.deal.isActive ?? true;
            } else {
                // Skip deal if no valid title found
                return variation;
            }

            variation.deal = {
              title: dealTitle,
              discountType: dealDiscountType,
              startDate: dealStartDate.toISOString(),
              endDate: dealEndDate.toISOString(),
              discountValue: dealDiscountValue,
              isActive: dealIsActive,
            };
          }

          return variation;
        });

        const foodInput: IFoodInput = {
          food: {
            restaurant: restaurantId,
            category: (values.category?.code || values.category) as string,
            title: values.title,
            description: values.description || undefined,
            subCategory:
              (values.subCategory?.code || values.subCategory || undefined) as string,
            image: values.image || undefined,
            isActive: true,
            isOutOfStock: false,
            inventory: values.inventory ? Number(values.inventory) : undefined,
            UOM: values.uom || undefined,
            orderQuantity: {
              min: values.minQuantity ? Number(values.minQuantity) : 0,
              max: values.maxQuantity ? Number(values.maxQuantity) : 0,
            },
          },
          variations: _variations,
        };

        await updateFood({
          variables: {
            foodId: foodContextData?.food?._id || '',
            foodInput,
          },
        });
      } else {
        // For creating new food, use CREATE_FOOD_SINGLE_VENDOR
        const _variations: IVariationInput[] = values.variations.map((item) => {
          const variation: IVariationInput = {
            title: item.title,
            price: Number(item.price),
            discounted: item.discounted ? Number(item.discounted) : undefined,
            addons: item?.addons ? (item.addons.map((addon: IDropdownSelectItem | string) => (typeof addon === 'object' ? addon.code : addon)).filter(Boolean) as string[]) : [],
            isOutOfStock: item.isOutOfStock || false,
          };

          // Add deal if present
          if (item.deal) {
            let dealTitle: string;
            let dealDiscountType: string;
            let dealDiscountValue: number;
            let dealStartDate: Date;
            let dealEndDate: Date;
            let dealIsActive: boolean;

            if ('name' in item.deal && typeof item.deal.name === 'string') { // IFoodDealType
                dealTitle = item.deal.name;
                dealDiscountType = item.deal.type;
                dealDiscountValue = item.deal.value;
                dealStartDate = new Date(item.deal.startDate);
                dealEndDate = new Date(item.deal.endDate);
                dealIsActive = item.deal.isActive;
            } else if ('dealName' in item.deal && item.deal.dealName) { // IDealFormValues or IDeal with dealName
                dealTitle = item.deal.dealName;
                dealDiscountType = item.deal.discountType || '';
                dealDiscountValue = item.deal.discountValue || 0;
                dealStartDate = item.deal.startDate instanceof Date ? item.deal.startDate : new Date(item.deal.startDate);
                dealEndDate = item.deal.endDate instanceof Date ? item.deal.endDate : new Date(item.deal.endDate);
                dealIsActive = item.deal.isActive ?? true;
            } else {
                // Skip deal if no valid title found
                return variation;
            }

            variation.deal = {
              title: dealTitle,
              discountType: dealDiscountType,
              startDate: dealStartDate.toISOString(),
              endDate: dealEndDate.toISOString(),
              discountValue: dealDiscountValue,
              isActive: dealIsActive,
            };
          }

          return variation;
        });

        const foodInput: IFoodInput = {
          food: {
            restaurant: restaurantId,
            category: (values.category?.code || values.category) as string,
            subCategory:
              (values.subCategory?.code || values.subCategory || undefined) as string,
            title: values.title,
            description: values.description || undefined,
            image: values.image || undefined,
            isActive: true,
            isOutOfStock: false,
            inventory: values.inventory ? Number(values.inventory) : 0,
            UOM: values.uom || '',
            orderQuantity: {
              min: values.minQuantity ? Number(values.minQuantity) : 0,
              max: values.maxQuantity ? Number(values.maxQuantity) : 0,
            },
          },
          variations: _variations,
        };

        await createFood({
          variables: {
            foodInput,
          },
        });
      }

      showToast({
        type: 'success',
        title: t('Success'),
        message: t('Food saved successfully'),
      });

      onClearFoodData();
    } catch (error: unknown) {
      console.error('Food Form Error', error);
      let message = t('Something went wrong');
      if (error instanceof Error) {
        message = error.message;
        if (
          'graphQLErrors' in error &&
          Array.isArray(error.graphQLErrors) &&
          error.graphQLErrors.length > 0
        ) {
          message = (error.graphQLErrors as ApolloError['graphQLErrors'])[0].message;
        }
      }
      showToast({
        type: 'error',
        title: t('Error'),
        message: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sidebar
      visible={isFoodFormVisible}
      position={position}
      onHide={onSidebarHideHandler}
      blockScroll
      className="w-full sm:w-[600px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div className="pb-6">
        <h2 className="text-xl font-bold mb-4">
          {foodContextData?.isEditing ? t('Edit Product') : t('Add Product')}
        </h2>

        <Formik<IFoodNewFormValues> // Added explicit type here
          initialValues={getInitialValues()}
          validationSchema={CombinedSchema}
          enableReinitialize
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors: formErrors, isValid }) => {
            // Log validation errors to console for debugging
            if (Object.keys(formErrors).length > 0) {
              console.log('Form validation errors:', formErrors);
            }
            const isLoading =
              isSubmitting || createFoodLoading || updateFoodLoading;
            return (
              <Form className="flex flex-col gap-6 pb-4">
                {/* Food Details Section */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-dark-950 rounded-lg">
                    <FoodDetails />
                  </div>

                  <div className="border-t dark:border-dark-600 pt-4">
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">
                      {t('Variations')}
                    </h3>
                    <VariationAddForm />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t dark:border-dark-600 pt-4 pb-12 bg-white dark:bg-dark-950">
                  {/* Error Summary */}
                  {Object.keys(formErrors).length > 0 && !isValid && (
                    <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-800 dark:text-red-300 font-semibold mb-1">
                        {t('Please fix the following errors:')}
                      </p>
                      <ul className="text-xs text-red-700 dark:text-red-300 list-disc list-inside">
                        {Object.entries(formErrors).map(([key, value]) => {
                          if (key === 'variations' && Array.isArray(value)) {
                            return (value as Array<Record<string, string> | undefined>).map(
                              (varError, idx: number) => {
                                if (varError && typeof varError === 'object') {
                                  return Object.entries(varError).map(
                                    ([field, msg]) => (
                                      <li key={`${key}-${idx}-${field}`}>
                                        Variation {idx + 1} - {field}:{' '}
                                        {msg as string}
                                      </li>
                                    )
                                  );
                                }
                                return null;
                              }
                            );
                          }
                          return (
                            <li key={key}>
                              {key}: {value as string}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onSidebarHideHandler}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-900"
                      disabled={isLoading}
                    >
                      {t('Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-black dark:bg-primary-color text-white rounded-md hover:bg-gray-800 dark:hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                    >
                      {isLoading ? (
                        <ProgressSpinner
                          style={{ width: '20px', height: '20px' }}
                          strokeWidth="4"
                        />
                      ) : (
                        t('Save')
                      )}
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Sidebar>
  );
};

export default FoodForm;
