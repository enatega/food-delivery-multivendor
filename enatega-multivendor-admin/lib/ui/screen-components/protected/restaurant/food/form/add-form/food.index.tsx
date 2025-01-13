'use client';

// Core
import { Form, Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';

// Interface and Types
import {
  ICategory,
  ICategoryByRestaurantResponse,
  IDropdownSelectItem,
  IFoodDetailsComponentProps,
  IFoodNew,
  IQueryResult,
  ISubCategory,
  ISubCategoryByParentIdResponse,
} from '@/lib/utils/interfaces';
import { IFoodDetailsForm } from '@/lib/utils/interfaces/forms/food.form.interface';

// Constants and Methods
import { FoodErrors, MAX_LANSDCAPE_FILE_SIZE } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

// Components
import CategoryAddForm from '../../../category/add-form';
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// API
import { GET_CATEGORY_BY_RESTAURANT_ID } from '@/lib/api/graphql';
import { GET_SUBCATEGORIES_BY_PARENT_ID } from '@/lib/api/graphql/queries/sub-categories';

// Schema
import { FoodSchema } from '@/lib/utils/schema';

// Prime React
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';

// Components
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import InputSkeleton from '@/lib/ui/useable-components/custom-skeletons/inputfield.skeleton';

const initialValues: IFoodDetailsForm = {
  _id: null,
  title: '',
  description: '',
  image: '',
  category: null,
  subCategory: null,
};
export default function FoodDetails({
  stepperProps,
}: IFoodDetailsComponentProps) {
  // Props
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => {},
    type: '',
    order: -1,
  };

  // Context
  const { onSetFoodContextData, foodContextData } = useContext(FoodsContext);
  const { isAddSubCategoriesVisible, setIsAddSubCategoriesVisible } =
    useContext(RestaurantLayoutContext);
  const {
    restaurantLayoutContextData: { restaurantId },
  } = useContext(RestaurantLayoutContext);

  // State
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(false);
  const [subCategories] = useState<ISubCategory[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<
    IDropdownSelectItem[]
  >([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [categoryDropDown, setCategoryDropDown] =
    useState<IDropdownSelectItem>();
  const [foodInitialValues, setFoodInitialValues] = useState(
    foodContextData?.isEditing || foodContextData?.food?.data?.title
      ? { ...initialValues, ...foodContextData?.food?.data }
      : { ...initialValues }
  );

  // Queries
  const {
    data,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQueryGQL(
    GET_CATEGORY_BY_RESTAURANT_ID,
    { id: restaurantId ?? '' },
    {
      fetchPolicy: 'cache-and-network',
      enabled: !!restaurantId,
    }
  ) as IQueryResult<ICategoryByRestaurantResponse | undefined, undefined>;

  const {
    data: subCategoriesData,
    loading: subCategoriesLoading,
    refetch: refetchSubCategories,
  } = useQueryGQL(
    GET_SUBCATEGORIES_BY_PARENT_ID,
    {
      parentCategoryId: categoryDropDown?.code,
    },
    {
      enabled: !!categoryDropDown?.code,
      fetchPolicy: 'cache-and-network',
    }
  ) as IQueryResult<
    ISubCategoryByParentIdResponse | undefined,
    { parentCategoryId: string }
  >;

  // Memoized Data
  const categoriesDropdown = useMemo(
    () =>
      data?.restaurant?.categories.map((category: ICategory) => {
        return { label: category.title, code: category._id };
      }),
    []
  );

  const subCategoriesDropdown = useMemo(
    () =>
      subCategoriesData?.subCategoriesByParentId.map(
        (sub_category: ISubCategory) => {
          return { label: sub_category.title, code: sub_category._id };
        }
      ),
    [categoryDropDown?.code, subCategoriesData]
  );

  // Handlers
  const onFoodSubmitHandler = (values: IFoodDetailsForm) => {
    const foodData: IFoodNew = {
      _id: foodContextData?.food?.data?._id ?? '',
      title: values.title,
      description: values.description,
      category: values.category,
      subCategory: values.subCategory,
      image: values.image,
      isOutOfStock: false,
      isActive: true,
      __typename: foodContextData?.food?.data?.__typename ?? 'Food',
      variations:
        (foodContextData?.food?.variations ?? []).length > 0
          ? (foodContextData?.food?.variations ?? [])
          : [],
    };

    onSetFoodContextData({
      food: {
        _id: '',
        data: foodData,
        variations:
          (foodContextData?.food?.variations ?? []).length > 0
            ? (foodContextData?.food?.variations ?? [])
            : [],
      },
    });
    onStepChange(order + 1);
  };

  useEffect(() => {
    if (categoryDropDown) {
      const selectedSubCategory: IDropdownSelectItem[] =
        subCategoriesData?.subCategoriesByParentId
          .filter((sub_ctg) => sub_ctg.parentCategoryId)
          .map((sub_ctg_: ISubCategory) => ({
            code: sub_ctg_?._id || '',
            label: sub_ctg_?.title || '',
          })) || [];
      setSelectedSubCategories(selectedSubCategory);
    }
    // setFoodInitialValues((prev)=>({...prev, subCategory:foodContextData?.food?.data.subCategory||null}))
    refetchCategories();
    refetchSubCategories({
      parentCategoryId: categoryDropDown?.code ?? '',
    });
  }, [
    categoryDropDown,
    setIsAddSubCategoriesVisible,
    isAddSubCategoriesVisible,
    subCategoriesData,
  ]);

  // UseEffects
  useEffect(() => {
    if (foodContextData?.isEditing) {
      const editing_category = categoriesDropdown?.find(
        (_category) =>
          _category.code === foodContextData?.food?.data.category?.code
      );
      setFoodInitialValues({
        ...JSON.parse(JSON.stringify(foodInitialValues)),
        category: editing_category,
      });
      setCategoryDropDown(editing_category ?? ({} as IDropdownSelectItem));
    }
  }, [categoriesDropdown]);

  return (
    <div className="w-full h-full flex items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div>
            <Formik
              initialValues={foodInitialValues}
              validationSchema={FoodSchema}
              enableReinitialize={true}
              onSubmit={async (values) => {
                onFoodSubmitHandler(values);
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
                      <div>
                        <label
                          htmlFor="category"
                          className="text-sm font-[500]"
                        >
                          Category
                        </label>
                        <Dropdown
                          name="category"
                          value={values.category}
                          placeholder="Select Category"
                          className="md:w-20rem p-dropdown-no-box-shadow m-0 h-10 w-full border border-gray-300 p-0 align-middle text-sm focus:shadow-none focus:outline-none"
                          panelClassName="border-gray-200 border-2"
                          onChange={(e: DropdownChangeEvent) => {
                            handleChange(e);
                            setCategoryDropDown(e.value);
                          }}
                          options={categoriesDropdown ?? []}
                          loading={categoriesLoading}
                          panelFooterTemplate={() => {
                            return (
                              <div className="flex justify-between space-x-2">
                                <TextIconClickable
                                  className="w-full h-fit rounded  text-black"
                                  icon={faAdd}
                                  iconStyles={{ color: 'black' }}
                                  title={'Add New Category'}
                                  onClick={() => setIsAddCategoryVisible(true)}
                                />
                              </div>
                            );
                          }}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'category',
                              errors?.category,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        {!subCategoriesLoading ? (
                          <CustomDropdownComponent
                            name="subCategory"
                            placeholder="Select Sub-Category"
                            showLabel={true}
                            extraFooterButton={{
                              onChange: () => {
                                setIsAddSubCategoriesVisible((prev) => ({
                                  bool: !prev.bool,
                                  parentCategoryId:
                                    values?.category?.code ?? '',
                                }));
                                refetchSubCategories({
                                  parentCategoryId:
                                    values?.category?.code ||
                                    categoryDropDown?.code ||
                                    '',
                                });
                              },
                              title: 'Add Sub-Category',
                            }}
                            selectedItem={values.subCategory}
                            setSelectedItem={setFieldValue}
                            options={
                              subCategoriesDropdown ??
                              selectedSubCategories ??
                              []
                            }
                            isLoading={subCategoriesLoading}
                            style={{
                              borderColor: onErrorMessageMatcher(
                                'subCategory',
                                errors?.subCategory,
                                FoodErrors
                              )
                                ? 'red'
                                : '',
                            }}
                          />
                        ) : (
                          <InputSkeleton />
                        )}
                      </div>

                      <div>
                        <CustomTextField
                          type="text"
                          name="title"
                          placeholder="Title"
                          maxLength={35}
                          value={values.title}
                          onChange={handleChange}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'title',
                              errors?.title,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <CustomTextAreaField
                          name="description"
                          label="Description"
                          placeholder="Description"
                          value={values.description}
                          onChange={handleChange}
                          showLabel={true}
                          className={''}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'description',
                              errors.description,
                              FoodErrors
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
                          title="Upload Image"
                          fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                          maxFileHeight={841}
                          maxFileWidth={1980}
                          maxFileSize={MAX_LANSDCAPE_FILE_SIZE}
                          orientation="LANDSCAPE"
                          onSetImageUrl={setFieldValue}
                          existingImageUrl={values.image}
                          showExistingImage={
                            foodContextData?.isEditing ? true : false
                          }
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'image',
                              errors?.image as string,
                              FoodErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <CustomButton
                        className="w-fit h-10 bg-black text-white border-gray-300 px-8"
                        label="Next"
                        type="submit"
                        loading={isSubmitting}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>

      <CategoryAddForm
        category={category}
        onHide={() => {
          setIsAddCategoryVisible(false);
          setCategory(null);
        }}
        isAddCategoryVisible={isAddCategoryVisible}
        subCategories={subCategories}
      />
    </div>
  );
}
