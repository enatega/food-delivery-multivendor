// Core
import { useFormikContext } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useTranslations } from 'next-intl';

// Interface and Types
import {
  ICategory,
  ICategoryByRestaurantResponse,
  IDropdownSelectItem,
  IQueryResult,
  ISubCategory,
  ISubCategoryByParentIdResponse,
  IFoodNew, // Added IFoodNew
} from '@/lib/utils/interfaces';

// Constants and Methods
import { FoodErrors, MAX_LANSDCAPE_FILE_SIZE } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

// Components
import CategoryAddForm from '../../../category/add-form';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// API
import { GET_CATEGORY_BY_RESTAURANT_ID } from '@/lib/api/graphql';
import { GET_SUBCATEGORIES_BY_PARENT_ID } from '@/lib/api/graphql/queries/sub-categories';

// Prime React
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

// Icons
import { faAdd } from '@fortawesome/free-solid-svg-icons';

// Components
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import InputSkeleton from '@/lib/ui/useable-components/custom-skeletons/inputfield.skeleton';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import { useTheme } from 'next-themes';

export default function FoodDetails() {
  // Hooks
  const t = useTranslations();
  const { theme } = useTheme();
  // Formik Context (from Parent)
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<IFoodNew>();

  // Context
  const { foodContextData } = useContext(FoodsContext);
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

  // Set initial dropdown state based on values (for edit mode)
  const [categoryDropDown, setCategoryDropDown] = useState<
    IDropdownSelectItem | undefined
  >(values.category?.code ? values.category : undefined);

  // Queries
  const {
    data,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQueryGQL(
    GET_CATEGORY_BY_RESTAURANT_ID,
    { id: restaurantId ?? '' },
    {
      fetchPolicy: 'no-cache',
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
    [data?.restaurant?.categories]
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
    if (foodContextData?.isEditing && categoriesDropdown) {
      // Find full object for dropdown
      const editing_category = categoriesDropdown?.find(
        (_category) =>
          // Handle both object format and ID format potentially
          _category.code ===
          (foodContextData?.food?.data.category?.code ||
            foodContextData?.food?.data.category)
      );
      if (editing_category && !categoryDropDown) {
        setCategoryDropDown(editing_category);
        setFieldValue('category', editing_category);
      }
    }
  }, [categoriesDropdown, foodContextData?.isEditing]);

  // ✅ Nutrition helpers
  const nutritionFacts = values.nutritionFacts || [];

  const addNutritionRow = () => {
    setFieldValue('nutritionFacts', [
      ...nutritionFacts,
      { name: '', quantity: '' },
    ]);
  };

  const removeNutritionRow = (index: number) => {
    setFieldValue(
      'nutritionFacts',
      nutritionFacts.filter((_, i) => i !== index)
    );
  };

  const updateNutrition = (
    index: number,
    key: 'name' | 'quantity',
    val: string
  ) => {
    const updated = [...nutritionFacts];
    updated[index][key] = val;
    setFieldValue('nutritionFacts', updated);
  };

  return (
    <div className="w-full h-full flex items-center justify-start dark:text-white dark:bg-dark-950">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div>
            <div className="space-y-3">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="category"
                    className="text-sm font-[500] dark:text-gray-300"
                  >
                    {t('Category')} <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    name="category"
                    value={values.category}
                    placeholder={t('Select Category')}
                    className="md:w-20rem p-dropdown-no-box-shadow m-0 h-10 w-full border border-gray-300 dark:border-dark-600 dark:bg-dark-900 dark:text-white p-0 align-middle text-sm focus:shadow-none focus:outline-none"
                    panelClassName="border-gray-200 dark:border-dark-600 border-2 dark:bg-dark-900"
                    onChange={(e: DropdownChangeEvent) => {
                      handleChange(e);
                      setCategoryDropDown(e.value);
                    }}
                    options={categoriesDropdown ?? []}
                    loading={categoriesLoading}
                    panelFooterTemplate={() => {
                      return (
                        <div className="flex justify-between space-x-2 dark:bg-dark-900">
                          <TextIconClickable
                            className="w-full h-fit rounded text-black dark:text-white"
                            icon={faAdd}
                            iconStyles={{ color: 'currentColor' }}
                            title={t('Add New Category')}
                            onClick={() => setIsAddCategoryVisible(true)}
                          />
                        </div>
                      );
                    }}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'category',
                        errors?.category as string,
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
                      placeholder={t('Select Sub-Category')}
                      showLabel={true}
                      extraFooterButton={{
                        onChange: () => {
                          setIsAddSubCategoriesVisible((prev) => ({
                            bool: !prev.bool,
                            parentCategoryId: values?.category?.code ?? '',
                          }));
                          refetchSubCategories({
                            parentCategoryId:
                              values?.category?.code ||
                              categoryDropDown?.code ||
                              '',
                          });
                        },
                        title: t('Add Sub-Category'),
                      }}
                      selectedItem={values.subCategory}
                      setSelectedItem={setFieldValue}
                      options={
                        subCategoriesDropdown ?? selectedSubCategories ?? []
                      }
                      isLoading={subCategoriesLoading}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'subCategory',
                          errors?.subCategory as string,
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
                    placeholder={t('Title')}
                    maxLength={35}
                    value={values.title}
                    onChange={handleChange}
                    showLabel={true}
                    isRequired={true}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'title',
                        errors?.title as string,
                        FoodErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />
                </div>
                <div>
                  <CustomNumberField
                    name="inventory"
                    placeholder={t('Inventory')}
                    value={values.inventory}
                    onChangeFieldValue={setFieldValue}
                    showLabel={true}
                    min={0}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'inventory',
                        errors?.inventory as string,
                        FoodErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />
                </div>
                <div>
                  <CustomTextField
                    type="text"
                    name="uom"
                    placeholder={t('UOM (e.g kg, ltr)')}
                    value={values.uom}
                    onChange={handleChange}
                    showLabel={true}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'uom',
                        errors?.uom as string,
                        FoodErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />
                </div>

                {/* Min & Max Order Quantity Row */}
                <div className="flex w-full gap-4">
                  <div className="w-1/2">
                    <CustomNumberField
                      name="minQuantity"
                      placeholder={t('Min QTY Order')}
                      value={values.minQuantity}
                      onChangeFieldValue={setFieldValue}
                      showLabel={true}
                      min={0}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'minQuantity',
                          errors?.minQuantity as string,
                          FoodErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                  <div className="w-1/2">
                    <CustomNumberField
                      name="maxQuantity"
                      placeholder={t('Max QTY Order')}
                      value={values.maxQuantity}
                      onChangeFieldValue={setFieldValue}
                      showLabel={true}
                      min={0}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'maxQuantity',
                          errors?.maxQuantity as string,
                          FoodErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <CustomTextField
                    type="text"
                    name="ingredients"
                    placeholder={t('Ingredients')}
                    value={values.ingredients}
                    onChange={handleChange}
                    showLabel={true}
                  />
                </div>

                <div>
                  <CustomTextField
                    type="text"
                    name="usage"
                    placeholder={t('Usage')}
                    value={values.usage}
                    onChange={handleChange}
                    showLabel={true}
                  />
                </div>

                {/* Nutrition Facts */}
                <div className="space-y-2">
                  <label className="text-sm font-[500] ">
                    {t('Nutrition Facts')}
                  </label>
                  <div>
                    <CustomTextField
                      type="text"
                      name="nutritionDetail"
                      placeholder={t(
                        'Nutrition Detail (e.g. Amount per 100ml)'
                      )}
                      value={values.nutritionDetail}
                      onChange={handleChange}
                      showLabel={false}
                    />
                  </div>

                  {nutritionFacts.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end">
                      <div className="w-1/2">
                        <CustomTextField
                          type="text"
                          name={`nutritionFacts.${index}.name`}
                          placeholder={t('name (e.g Fat)')}
                          value={item.name}
                          showLabel={false}
                          onChange={(e) =>
                            updateNutrition(index, 'name', e.target.value)
                          }
                        />
                      </div>

                      <div className="w-1/2">
                        <CustomTextField
                          type="text"
                          name={`nutritionFacts.${index}.quantity`}
                          placeholder={t('quantity (e.g 20g)')}
                          value={item.quantity}
                          showLabel={false}
                          onChange={(e) =>
                            updateNutrition(index, 'quantity', e.target.value)
                          }
                        />
                      </div>

                      {nutritionFacts.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 text-sm"
                          onClick={() => removeNutritionRow(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <TextIconClickable
                    icon={faAdd}
                    title={t('Add More Nutrition')}
                    iconStyles={
                      theme === 'dark'
                        ? {
                            color: 'white',
                          }
                        : { color: 'gray' }
                    }
                    onClick={addNutritionRow}
                    className="border border-gray-300 dark:border-dark-600 mt-2"
                  />
                </div>

                <div>
                  <CustomTextAreaField
                    name="description"
                    label={t('Description')}
                    placeholder={t('Description')}
                    value={values.description}
                    onChange={handleChange}
                    showLabel={true}
                    className={''}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'description',
                        errors?.description as string,
                        FoodErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />{' '}
                </div>

                <div>
                  <CustomUploadImageComponent
                    key="image"
                    name="image"
                    title={t('Upload Image')}
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
                    isRequired={true}
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
            </div>
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
        // Add this prop to trigger refetch after category add/edit
        onCategoryAdded={() => {
          refetchCategories();
        }}
      />
    </div>
  );
}
