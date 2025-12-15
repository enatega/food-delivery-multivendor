// Core
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldArray, useFormikContext, FormikErrors } from 'formik';
import { Fieldset } from 'primereact/fieldset';
import React, { useContext, useMemo, useState } from 'react';

// Context
import { FoodsContext } from '@/lib/context/restaurant/foods.context';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

// Interface and Types
import {
  IAddon,
  IAddonByRestaurantResponse,
  IDropdownSelectItem,
  IFoodVariationsAddRestaurantComponentProps,
  IQueryResult,
  IVariationForm,
} from '@/lib/utils/interfaces';
import { IDealFormValues } from './add-deal';

// Constants and Methods
import { MAX_PRICE, MIN_PRICE, VariationErrors } from '@/lib/utils/constants';
import { onErrorMessageMatcher } from '@/lib/utils/methods';

// Components
import CustomInputSwitch from '@/lib/ui/useable-components/custom-input-switch';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import AddonAddForm from '../../../add-on/add-form';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import CustomButton from '@/lib/ui/useable-components/button';
import AddDealForm from './add-deal';

// Context
import { ToastContext } from '@/lib/context/global/toast.context';

// API
import { GET_ADDONS_BY_RESTAURANT_ID } from '@/lib/api/graphql';

// Icons
import {
  faAdd,
  faTimes,
  faTag,
  faTrash,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

// Apollo
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useTranslations } from 'next-intl';

const initialFormValuesTemplate: IVariationForm = {
  title: '',
  price: 0,
  discounted: 0,
  addons: [],
  isOutOfStock: false,
};

export default function VariationAddForm() {
  // Hooks
  const t = useTranslations();

  // Formik Context
  const { values, errors, setFieldValue } = useFormikContext<any>();

  // State
  const [isAddAddonVisible, setIsAddAddonVisible] = useState(false);
  const [addon, setAddon] = useState<IAddon | null>(null);

  // Deal State
  const [isAddDealVisible, setIsAddDealVisible] = useState(false);
  const [activeVariationIndex, setActiveVariationIndex] = useState<
    number | null
  >(null);

  // Context
  const { showToast } = useContext(ToastContext);
  const { foodContextData } = useContext(FoodsContext); // Still used for isEditing check if needed for general logic, but values come from Formik
  const {
    restaurantLayoutContextData: { restaurantId },
    option,
    setOption,
  } = useContext(RestaurantLayoutContext);

  // Query
  const { data, loading } = useQueryGQL(
    GET_ADDONS_BY_RESTAURANT_ID,
    { id: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchAddonsByRestaurantCompleted,
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<IAddonByRestaurantResponse | undefined, undefined>;

  // Memoized Data
  const addonsDropdown = useMemo(
    () =>
      data?.restaurant?.addons.map((addon: IAddon) => {
        return { label: addon.title, code: addon._id };
      }),
    [data?.restaurant?.addons]
  );

  // API Handlers
  function onFetchAddonsByRestaurantCompleted() {}
  function onErrorFetchAddonsByRestaurant() {
    showToast({
      type: 'error',
      title: t('Addons Fetch'),
      message: t('Addons fetch failed'),
      duration: 2500,
    });
  }

  // Deal Handlers
  const onAddDealClick = (index: number) => {
    setActiveVariationIndex(index);
    setIsAddDealVisible(true);
  };

  const onSaveDeal = (dealData: IDealFormValues) => {
    if (activeVariationIndex !== null) {
      setFieldValue(`variations[${activeVariationIndex}].deal`, dealData);
      showToast({
        type: 'success',
        title: t('Deal Added'),
        message: t(
          'Deal attached to variation. It will be saved when you save the food.'
        ),
        duration: 3000,
      });
    }
  };

  const onDeleteDeal = (index: number) => {
    setFieldValue(`variations[${index}].deal`, undefined); // Or null
    showToast({
      type: 'info',
      title: t('Deal Removed'),
      message: t('Deal removed from variation.'),
      duration: 2000,
    });
  };

  const _errors: FormikErrors<IVariationForm>[] =
    (errors?.variations as FormikErrors<IVariationForm>[]) ?? [];

  return (
    <div className="flex h-full w-full items-center justify-start dark:text-white dark:bg-dark-950 ">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="mb-2">
            <div>
              <FieldArray name="variations">
                {({ remove, push }) => (
                  <div>
                    {values.variations.length > 0 &&
                      values.variations.map((value: any, index: number) => {
                        return (
                          <div className="mb-2" key={`variations-${index}`}>
                            <div className="relative">
                              {(foodContextData?.isEditing || !!index) && (
                                <button
                                  className="absolute -right-1 top-2 z-10"
                                  onClick={() => remove(index)}
                                  type="button"
                                >
                                  <FontAwesomeIcon
                                    icon={faTimes}
                                    size="lg"
                                    color="#FF6347"
                                  />
                                </button>
                              )}
                              <Fieldset
                                legend={`${t('Variation')} ${index + 1} ${value.title ? `(${value.title})` : ''}`}
                                toggleable
                                className="dark:bg-dark-900 dark:border-dark-600"
                                pt={{
                                  legend: {
                                    className:
                                      'dark:bg-dark-900 dark:text-white',
                                  },
                                  content: { className: 'dark:bg-dark-900' },
                                  togglerIcon: { className: 'dark:text-white' },
                                }}
                              >
                                <div className="grid grid-cols-12 gap-4">
                                  <div className="col-span-12 sm:col-span-12">
                                    <CustomTextField
                                      type="text"
                                      name={`variations[${index}].title`}
                                      placeholder={t('Title')}
                                      maxLength={35}
                                      value={value.title}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `variations[${index}].title`,
                                          e.target.value
                                        )
                                      }
                                      showLabel={true}
                                      isRequired={true}
                                      style={{
                                        borderColor: onErrorMessageMatcher(
                                          'title',
                                          _errors[index]?.title as string,
                                          VariationErrors
                                        )
                                          ? 'red'
                                          : '',
                                      }}
                                    />
                                  </div>

                                  <div className="relative col-span-6 sm:col-span-6">
                                    <CustomNumberField
                                      name={`variations[${index}].price`}
                                      min={MIN_PRICE}
                                      max={MAX_PRICE}
                                      minFractionDigits={0}
                                      maxFractionDigits={2}
                                      placeholder={t('Price')}
                                      showLabel={true}
                                      value={value.price}
                                      onChangeFieldValue={setFieldValue}
                                      style={{
                                        borderColor: onErrorMessageMatcher(
                                          'price',
                                          _errors[index]?.price as string,
                                          VariationErrors
                                        )
                                          ? 'red'
                                          : '',
                                      }}
                                    />
                                    {value.discounted > 0 && (
                                      <div className="absolute bottom-[-15px] left-[2px] font-semibold text-[10px] flex gap-2 dark:text-gray-300">
                                        <p>
                                          {t('Actual Price')}&nbsp;: &nbsp;
                                          <span className="line-through">
                                            {value.price + value.discounted}
                                          </span>
                                        </p>
                                        ,
                                        <p>
                                          {t('Discounted Price')}
                                          &nbsp;: &nbsp;
                                          <span>{value.price}</span>
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="col-span-6 sm:col-span-6">
                                    <CustomNumberField
                                      name={`variations[${index}].discounted`}
                                      min={0}
                                      placeholder={t('Discount Price')}
                                      showLabel={true}
                                      value={value.discounted}
                                      onChangeFieldValue={setFieldValue}
                                      style={{
                                        borderColor: onErrorMessageMatcher(
                                          'discounted',
                                          _errors[index]?.discounted as string,
                                          VariationErrors
                                        )
                                          ? 'red'
                                          : '',
                                      }}
                                    />
                                  </div>

                                  <div className="col-span-12 sm:col-span-12">
                                    <CustomMultiSelectComponent
                                      name={`variations[${index}].addons`}
                                      placeholder={t('Addons')}
                                      options={addonsDropdown ?? []}
                                      selectedItems={
                                        value.addons ?? [
                                          { code: '', label: '' },
                                        ]
                                      }
                                      setSelectedItems={setFieldValue}
                                      showLabel={true}
                                      extraFooterButton={{
                                        title: t('Add New Addon'),
                                        onChange: () =>
                                          setIsAddAddonVisible(true),
                                      }}
                                      isLoading={loading}
                                      style={{
                                        borderColor: onErrorMessageMatcher(
                                          'addons',
                                          _errors[index]?.addons as string,
                                          VariationErrors
                                        )
                                          ? 'red'
                                          : '',
                                      }}
                                    />

                                    <div className="col-span-12 mt-4 flex justify-between items-center sm:col-span-12 w-full">
                                      {/* Deal Section */}
                                      <div className="flex-1">
                                        {value.deal ? (
                                          <div className="flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700/50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center gap-3 flex-1">
                                              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-800/30 rounded-full">
                                                <FontAwesomeIcon
                                                  icon={faTag}
                                                  className="text-green-600 dark:text-green-400"
                                                />
                                              </div>
                                              <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-bold text-green-900 dark:text-green-300">
                                                  {value.deal.dealName}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-800/40 px-2 py-0.5 rounded-full">
                                                    {value.deal.discountType ===
                                                    'PERCENTAGE'
                                                      ? `${value.deal.discountValue}% OFF`
                                                      : `€${value.deal.discountValue} OFF`}
                                                  </span>
                                                  {value.deal.isActive ? (
                                                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                      {t('Active')}
                                                    </span>
                                                  ) : (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                      {t('Inactive')}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  onAddDealClick(index)
                                                }
                                                className="flex items-center justify-center w-8 h-8 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-150"
                                                title={t('Edit Deal')}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faEdit}
                                                  className="text-sm"
                                                />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  onDeleteDeal(index)
                                                }
                                                className="flex items-center justify-center w-8 h-8 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors duration-150"
                                                title={t('Remove Deal')}
                                              >
                                                <FontAwesomeIcon
                                                  icon={faTrash}
                                                  className="text-sm"
                                                />
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <TextIconClickable
                                            className="h-8 w-fit rounded border border-gray-300 dark:border-dark-600 bg-black dark:bg-primary-color text-white px-3 text-xs hover:bg-gray-800 dark:hover:bg-primary-dark"
                                            title={t('Add Deal')}
                                            onClick={() =>
                                              onAddDealClick(index)
                                            }
                                            icon={faTag}
                                            iconStyles={{ color: 'white' }}
                                          />
                                        )}
                                      </div>

                                      <CustomInputSwitch
                                        label={t('Out of Stock')}
                                        loading={false}
                                        isActive={value.isOutOfStock}
                                        onChange={() => {
                                          setFieldValue(
                                            `variations[${index}].isOutOfStock`,
                                            !value.isOutOfStock
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Fieldset>
                            </div>
                          </div>
                        );
                      })}
                    <div className="mt-4 flex justify-end">
                      <TextIconClickable
                        className="w-full rounded border border-black dark:border-dark-600 bg-transparent dark:bg-dark-900 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-dark-800"
                        icon={faAdd}
                        iconStyles={{ color: 'currentColor' }}
                        title={t('Add New Variation')}
                        onClick={() => push(initialFormValuesTemplate)}
                      />
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>
          </div>
        </div>
      </div>
      <div>
        <AddonAddForm
          className="z-[999]"
          isAddOptionsVisible={isAddAddonVisible}
          setIsAddOptionsVisible={setIsAddAddonVisible}
          option={option}
          setOption={setOption}
          addon={addon}
          onHide={() => {
            setIsAddAddonVisible(false);
            setAddon(null);
          }}
          isAddAddonVisible={isAddAddonVisible}
        />

        {/* Add Deal Form Sidebar */}
        {activeVariationIndex !== null && (
          <AddDealForm
            visible={isAddDealVisible}
            onHide={() => {
              setIsAddDealVisible(false);
              setActiveVariationIndex(null);
            }}
            onSave={onSaveDeal}
            productName={values.title || t('New Product')}
            variationName={
              values.variations[activeVariationIndex]?.title ||
              t('New Variation')
            }
            initialValues={values.variations[activeVariationIndex]?.deal}
          />
        )}
      </div>
    </div>
  );
}
