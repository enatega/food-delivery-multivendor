// Core
import { FieldArray, Form, Formik, FormikErrors } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import { IAddonForm } from '@/lib/utils/interfaces/forms';

// Components

// Utilities and Constants

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
import CustomButton from '@/lib/ui/useable-components/button';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { AddonsErrors, OptionErrors } from '@/lib/utils/constants';
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
  const { showToast } = useToast();
  // Context

  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
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
  function onFetchAddonsByRestaurantCompleted() {}
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
    // filter default addon
    const filteredAddons = addons.filter(
      (addon) => addon.title !== 'Default Addon'
    );

    console.log("Submitting Addons:", filteredAddons);

    createAddons({
      variables: {
        addonInput: {
          restaurant: restaurantId,
          addons: addon
            ? mapOptions([
                omitExtraAttributes(filteredAddons[0], initialEditFormValuesTemplate),
              ])[0]
            : mapOptions(filteredAddons),
        },
      },
    });
  };

  return (
    <Sidebar
      visible={isAddAddonVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px]"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {addon ? t('Edit') : t('Add')} {t('Option')}
              </span>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={AddonSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="mt-4 flex justify-end">
                    <CustomButton
                      className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                      label={addon ? t('Edit') : t('Add')}
                      type="submit"
                      loading={mutationLoading}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
