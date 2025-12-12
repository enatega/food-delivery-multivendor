'use client';

// Core imports
import { useContext, useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// PrimeReact components
import { Sidebar } from 'primereact/sidebar';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Interfaces
import {
  IFoodAddFormComponentProps,
  IFoodNew,
  IVariationForm,
} from '@/lib/utils/interfaces';
import { IFoodDetailsForm } from '@/lib/utils/interfaces/forms/food.form.interface';

// Components
import FoodDetails from './food.index';
import VariationAddForm from './variations';
import { useTranslations } from 'next-intl';

// API
import { useMutation } from '@apollo/client';
import {
  CREATE_FOOD,
  EDIT_FOOD,
  GET_FOODS_BY_RESTAURANT_ID,
  CREATE_FOOD_SINGLE_VENDOR,
} from '@/lib/api/graphql';
import {
  CREATE_FOOD_DEAL,
  UPDATE_FOOD_DEAL,
} from '@/lib/api/graphql/mutations/food-deal';
import useToast from '@/lib/hooks/useToast';
import { FoodSchema, VariationSchema } from '@/lib/utils/schema';

// Error Handling
import { ProgressSpinner } from 'primereact/progressspinner';

const FoodForm = ({ position = 'right' }: IFoodAddFormComponentProps) => {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();

  // Context
  const {
    isFoodFormVisible,
    onClearFoodData,
    foodContextData,
    onSetFoodContextData,
  } = useContext(FoodsContext);

  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData.restaurantId;

  // Mutations
  const [createFood, { loading: createFoodLoading }] = useMutation(
    foodContextData?.isEditing ? EDIT_FOOD : CREATE_FOOD_SINGLE_VENDOR,
    {
      refetchQueries: [
        {
          query: GET_FOODS_BY_RESTAURANT_ID,
          variables: { id: restaurantId },
        },
      ],
    }
  );

  const [createFoodDeal] = useMutation(CREATE_FOOD_DEAL);
  const [updateFoodDeal] = useMutation(UPDATE_FOOD_DEAL);

  const onSidebarHideHandler = () => {
    if (!createFoodLoading) {
      onClearFoodData();
    }
  };

  // Initial Values
  const getInitialValues = () => {
    // Basic Food Data
    const basicInfo: IFoodDetailsForm = {
      _id: foodContextData?.food?.data?._id || null,
      title: foodContextData?.food?.data?.title || '',
      description: foodContextData?.food?.data?.description || '',
      image: foodContextData?.food?.data?.image || '',
      category: foodContextData?.food?.data?.category || null,
      subCategory: foodContextData?.food?.data?.subCategory || null,
      inventory: foodContextData?.food?.data?.inventory || null,
      uom: foodContextData?.food?.data?.uom || '',
      minQuantity: foodContextData?.food?.data?.minQuantity || null,
      maxQuantity: foodContextData?.food?.data?.maxQuantity || null,
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
    variations: Yup.array().of(VariationSchema),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    try {
      if (foodContextData?.isEditing) {
        // For editing, use the old EDIT_FOOD mutation
        const _variations = values.variations.map(
          ({ discounted, deal, ...item }: any) => {
            delete item.__typename;
            return {
              ...item,
              discounted: discounted,
              addons: item?.addons?.map((addon: any) => addon.code || addon),
            };
          }
        );

        const foodInput = {
          _id: foodContextData?.food?._id || '',
          restaurant: restaurantId,
          title: values.title,
          description: values.description,
          image: values.image,
          category: values.category?.code || values.category,
          subCategory: values.subCategory?.code || values.subCategory,
          isOutOfStock: false,
          isActive: true,
          variations: _variations,
          inventory: values.inventory ? Number(values.inventory) : undefined,
          uom: values.uom,
          minQuantity: values.minQuantity
            ? Number(values.minQuantity)
            : undefined,
          maxQuantity: values.maxQuantity
            ? Number(values.maxQuantity)
            : undefined,
        };

        const foodResult = await createFood({
          variables: {
            foodInput,
          },
        });

        const editedFood = foodResult.data.editFood;
        const foodId = editedFood._id;
        const createdVariations = editedFood.variations;

        // Handle deals for editing
        const dealPromises = values.variations.map(
          async (variation: any, index: number) => {
            if (variation.deal) {
              const variationId = createdVariations[index]?._id;
              if (!variationId) return;

              const baseDealInput = {
                title: variation.deal.dealName,
                discountType: variation.deal.discountType,
                food: foodId,
                discountValue: variation.deal.discountValue,
                variation: variationId,
                restaurant: restaurantId,
                startDate: variation.deal.startDate.toISOString(),
                endDate: variation.deal.endDate.toISOString(),
                isActive: variation.deal.isActive,
              };

              await createFoodDeal({
                variables: {
                  input: baseDealInput,
                },
              });
            }
          }
        );

        await Promise.all(dealPromises);
      } else {
        // For creating new food, use CREATE_FOOD_SINGLE_VENDOR
        const _variations = values.variations.map(
          ({ discounted, deal, ...item }: any) => {
            delete item.__typename;
            return {
              title: item.title,
              price: Number(item.price),
              discounted: discounted ? Number(discounted) : undefined,
              addons:
                item?.addons?.map((addon: any) => addon.code || addon) || [],
              isOutOfStock: item.isOutOfStock || false,
            };
          }
        );

        // Find first deal if any (API accepts single deal at food level)
        const firstDealVariation = values.variations.find((v: any) => v.deal);
        const dealInput = firstDealVariation?.deal
          ? {
              title: firstDealVariation.deal.dealName,
              discountType: firstDealVariation.deal.discountType,
              startDate: firstDealVariation.deal.startDate.toISOString(),
              endDate: firstDealVariation.deal.endDate.toISOString(),
              discountValue: Number(firstDealVariation.deal.discountValue),
              isActive: firstDealVariation.deal.isActive,
            }
          : undefined;

        const foodInput = {
          food: {
            restaurant: restaurantId,
            category: values.category?.code || values.category,
            subCategory:
              values.subCategory?.code || values.subCategory || undefined,
            title: values.title,
            description: values.description || undefined,
            image: values.image || undefined,
            isActive: true,
            isOutOfStock: false,
            inventory: values.inventory ? Number(values.inventory) : 0,
            UOM: values.uom || '',
            orderQuantity: {
              minimum: values.minQuantity ? Number(values.minQuantity) : 0,
              maximum: values.maxQuantity ? Number(values.maxQuantity) : 0,
            },
          },
          variations: _variations,
          deal: dealInput,
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
        message: t('Food and deals saved successfully'),
      });

      onClearFoodData();
    } catch (error: any) {
      console.error('Food Form Error', error);
      let message = error.message || t('Something went wrong');
      if (error.graphQLErrors?.length > 0) {
        message = error.graphQLErrors[0].message;
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

        <Formik
          initialValues={getInitialValues()}
          validationSchema={CombinedSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-6 pb-4">
              {/* Food Details Section */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg">
                  <FoodDetails />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">
                    {t('Variations')}
                  </h3>
                  <VariationAddForm />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t pt-4 pb-12 bg-white flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onSidebarHideHandler}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  {t('Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center min-w-[100px]"
                >
                  {isSubmitting ? (
                    <ProgressSpinner
                      style={{ width: '20px', height: '20px' }}
                      strokeWidth="4"
                    />
                  ) : (
                    t('Save')
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Sidebar>
  );
};

export default FoodForm;
