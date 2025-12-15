// Core
import { FieldArray, Form, Formik, FormikErrors } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import { IAddonForm } from '@/lib/utils/interfaces/forms';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import OptionsAddForm from '@/lib/ui/screen-components/protected/restaurant/options/add-form';

// Utilities and Constants
import { AddonsErrors, OptionErrors } from '@/lib/utils/constants';

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import {
  CREATE_ADDONS,
  EDIT_ADDON,
  GET_ADDONS_BY_RESTAURANT_ID,
  GET_OPTIONS_BY_RESTAURANT_ID,
} from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  IAddonAddFormComponentProps,
  IDropdownSelectItem,
  IOptions,
  IOptionsByRestaurantResponse,
  IQueryResult,
} from '@/lib/utils/interfaces';
import {
  omitExtraAttributes,
  onErrorMessageMatcher,
  toTextCase,
} from '@/lib/utils/methods';
import { AddonSchema } from '@/lib/utils/schema';
import { useMutation } from '@apollo/client';
import { faAdd, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fieldset } from 'primereact/fieldset';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
// State
const initialFormValuesTemplate: IAddonForm = {
  title: '',
  description: '',
  quantityMinimum: 1,
  quantityMaximum: 1,
  options: null,
};
const initialEditFormValuesTemplate: IAddonForm = {
  _id: '',
  title: '',
  description: '',
  quantityMinimum: 1,
  quantityMaximum: 1,
  options: null,
};

export default function AddonAddForm({
  onHide,
  addon,
  position = 'right',
  isAddAddonVisible,

}: IAddonAddFormComponentProps) {
  // Hooks
  const t = useTranslations();
  const { theme } = useTheme();
  const { showToast } = useToast();
  // Context

  const { restaurantLayoutContextData, setIsAddOptionsVisible,
    option,
    setOption,
    isAddOptionsVisible, } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  const [initialValues, setInitialValues] = useState({
    addons: [
      {
        ...initialFormValuesTemplate,
      },
    ],
  });

  // Query
  const { data } = useQueryGQL(
    GET_OPTIONS_BY_RESTAURANT_ID,
    { id: restaurantId },
    {
      fetchPolicy: 'network-only',
      enabled: !!restaurantId,
      onCompleted: onFetchAddonsByRestaurantCompleted,
      onError: onErrorFetchAddonsByRestaurant,
    }
  ) as IQueryResult<IOptionsByRestaurantResponse | undefined, undefined>;

  // Memoized Constants
  const optionsDropdown = useMemo(
    () =>
      data?.restaurant?.options.map((option: IOptions) => {
        return { label: toTextCase(option.title, 'title'), code: option._id };
      }),
    [data?.restaurant?.options]
  );

  // Mutation
  const [createAddons, { loading: mutationLoading }] = useMutation(
    addon ? EDIT_ADDON : CREATE_ADDONS,
    {
      refetchQueries: [
        {
          query: GET_ADDONS_BY_RESTAURANT_ID,
          variables: { id: restaurantId },
        },
      ],
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('New Addon'),
          message: `${t('Addon have been')} ${addon ? t('edited') : t('added')} ${t('successfully')}.`,
        });

        onHide();
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = `${t('Something went wrong')}.`;
        }
        showToast({
          type: 'error',
          title: t('New Addon'),
          message,
        });
      },
    }
  );

  // Handlers
  // Complete and Error
  function onFetchAddonsByRestaurantCompleted() { }
  function onErrorFetchAddonsByRestaurant() {
    showToast({
      type: 'error',
      title: t('Addons Fetch'),
      message: t('Addons fetch failed'),
      duration: 2500,
    });
  }

  function mapOptions(addons: IAddonForm[]) {
    return addons.map((addon) => ({
      ...addon,
      options: addon?.options?.map(
        (option: IDropdownSelectItem) => option.code
      ),
    }));
  }
  // Form Submission
  const handleSubmit = ({ addons }: { addons: IAddonForm[] }) => {
    createAddons({
      variables: {
        addonInput: {
          restaurant: restaurantId,
          addons: addon
            ? mapOptions([
              omitExtraAttributes(addons[0], initialEditFormValuesTemplate),
            ])[0]
            : mapOptions(addons),
        },
      },
    });
  };

  const mapOptionIds = (
    optionIds: string[],
    optionsData: { label: string; code: string }[]
  ) => {
    if (!addon) return;

    const matched_options = optionIds.map((id) => {
      const matchedOption = optionsData.find((op) => op.code === id);
      return { label: matchedOption?.label, code: matchedOption?.code };
    });

    const updated_addon = addon
      ? JSON.parse(JSON.stringify(addon))
      : ({} as IAddonForm);
    delete updated_addon.options;

    setInitialValues({
      addons: [
        {
          ...initialFormValuesTemplate,
          ...updated_addon,
          options: matched_options,
        },
      ],
    });
  };

  // UseEffects
  useEffect(() => {
    mapOptionIds((addon?.options as string[]) ?? [], optionsDropdown ?? []);
  }, [addon, optionsDropdown]);

  return (
    <Sidebar
      visible={isAddAddonVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[500px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {addon ? t('Edit') : t('Add')} {t('Addons')}
              </span>
            </div>

            <div className="mb-2">
              <Formik
                initialValues={initialValues}
                validationSchema={AddonSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  handleChange,
                  setFieldValue,
                  handleSubmit,
                }) => {
                  const _errors: FormikErrors<IAddonForm>[] =
                    (errors?.addons as FormikErrors<IAddonForm>[]) ?? [];

                  return (
                    <Form onSubmit={handleSubmit}>
                      <div>
                        <FieldArray name="addons">
                          {({ remove, push }) => (
                            <div>
                              {values.addons.length > 0 &&
                                values.addons.map(
                                  (value: IAddonForm, index: number) => {
                                    return (
                                      <div
                                        className="mb-2"
                                        key={`addon-${index}`}
                                      >
                                        <div className="relative">
                                          {!!index && (
                                            <button
                                              className="absolute -right-1 top-2"
                                              onClick={() => remove(index)}
                                            >
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                size="lg"
                                                color="#FF6347"
                                              />
                                            </button>
                                          )}
                                          <Fieldset
                                            legend={`${t('Addons')} ${index + 1} ${value.title ? `(${value.title})` : ''}`}
                                            toggleable
                                            className='dark:text-white dark:bg-dark-950 '
                                          >
                                            <div className="grid grid-cols-12 gap-4">
                                              <div className="col-span-12 sm:col-span-12">
                                                <CustomTextField
                                                  type="text"
                                                  name={`addons[${index}].title`}
                                                  placeholder={t('Title')}
                                                  maxLength={35}
                                                  value={value.title}
                                                  onChange={(e) =>
                                                    setFieldValue(
                                                      `addons[${index}].title`,
                                                      e.target.value
                                                    )
                                                  }
                                                  showLabel={true}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'title',
                                                        _errors[index]?.title,
                                                        AddonsErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>
                                              <div className="col-span-6 sm:col-span-6">
                                                <CustomNumberField
                                                  name={`addons[${index}].quantityMinimum`}
                                                  min={1}
                                                  max={99999}
                                                  minFractionDigits={0}
                                                  maxFractionDigits={0}
                                                  placeholder={t(
                                                    'Minimum Quantity'
                                                  )}
                                                  showLabel={true}
                                                  value={value.quantityMinimum}
                                                  onChangeFieldValue={
                                                    setFieldValue
                                                  }
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'quantityMinimum',
                                                        _errors[index]
                                                          ?.quantityMinimum,
                                                        AddonsErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>
                                              <div className="col-span-6 sm:col-span-6">
                                                <CustomNumberField
                                                  name={`addons[${index}].quantityMaximum`}
                                                  min={1}
                                                  max={99999}
                                                  minFractionDigits={0}
                                                  maxFractionDigits={0}
                                                  placeholder={t(
                                                    'Maximum Quantity'
                                                  )}
                                                  showLabel={true}
                                                  value={value.quantityMaximum}
                                                  onChangeFieldValue={
                                                    setFieldValue
                                                  }
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'quantityMaximum',
                                                        _errors[index]
                                                          ?.quantityMaximum,
                                                        AddonsErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>

                                              <div className="col-span-12 sm:col-span-12">
                                                <CustomTextAreaField
                                                  name={`addons[${index}].description`}
                                                  placeholder={t('Description')}
                                                  value={value.description}
                                                  onChange={handleChange}
                                                  showLabel={true}
                                                  maxLength={40}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'description',
                                                        _errors[index]
                                                          ?.description,
                                                        OptionErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>

                                              <div className="col-span-12 sm:col-span-12">
                                                <CustomMultiSelectComponent
                                                  name={`addons[${index}].options`}
                                                  placeholder={t('Options')}
                                                  options={
                                                    optionsDropdown ?? []
                                                  }
                                                  selectedItems={value.options}
                                                  setSelectedItems={
                                                    setFieldValue
                                                  }
                                                  extraFooterButton={{
                                                    onChange: () => {
                                                      setIsAddOptionsVisible(
                                                        true
                                                      );
                                                    },
                                                    title: t('Add Option'),
                                                  }}
                                                  showLabel={true}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'options',
                                                        _errors[index]
                                                          ?.options as string,
                                                        AddonsErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </Fieldset>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              {!addon && (
                                <div className="mt-4 flex justify-end">
                                  <TextIconClickable
                                    className="w-full rounded border dark:border-dark-600  border-black bg-transparent text-black dark:text-white"
                                    icon={faAdd}
                                    iconStyles={{ color: theme === 'dark' ? 'secondary-color' : 'dark-950' }}
                                    title={t('Add New Addon')}
                                    onClick={() =>
                                      push(initialFormValuesTemplate)
                                    }
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </FieldArray>

                        <div className="mt-4 flex justify-end">
                          <CustomButton
                            className="h-10 w-fit border dark:border-dark-600 border-gray-300  bg-black  px-8 text-white"
                            label={addon ? t('Update') : t('Add')}
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
      <OptionsAddForm
        option={option}
        onHide={() => {
          setIsAddOptionsVisible(false);
          setOption(null);
        }}
        isAddOptionsVisible={isAddOptionsVisible}
      />
    </Sidebar>
  );
}
