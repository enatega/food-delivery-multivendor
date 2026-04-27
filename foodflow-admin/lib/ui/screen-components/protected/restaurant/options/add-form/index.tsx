// Core
import { FieldArray, Form, Formik, FormikErrors } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// Interface and Types
import { IOptionForm } from '@/lib/utils/interfaces/forms';

// Components

// Utilities and Constants

//Toast
import useToast from '@/lib/hooks/useToast';

//GraphQL
import {
  CREATE_OPTIONS,
  EDIT_OPTION,
  GET_OPTIONS_BY_RESTAURANT_ID,
} from '@/lib/api/graphql';
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import CustomButton from '@/lib/ui/useable-components/button';
import CustomTextAreaField from '@/lib/ui/useable-components/custom-text-area-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import { OptionErrors } from '@/lib/utils/constants';
import { IOptionsAddFormComponentProps } from '@/lib/utils/interfaces';
import {
  omitExtraAttributes,
  onErrorMessageMatcher,
} from '@/lib/utils/methods';
import { OptionSchema } from '@/lib/utils/schema';
import { useMutation } from '@apollo/client';
import { faAdd, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fieldset } from 'primereact/fieldset';
import { useContext } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

// State
const initialFormValuesTemplate: IOptionForm = {
  title: '',
  description: '',
  price: 1,
};
const initialEditFormValuesTemplate: IOptionForm = {
  _id: '',
  title: '',
  description: '',
  price: 1,
};

export default function OptionAddForm({
  onHide,
  option,
  position = 'right',
  isAddOptionsVisible,
}: IOptionsAddFormComponentProps) {
  // Hooks
  const t = useTranslations();
  const { showToast } = useToast();
  const { theme } = useTheme();

  // Context
  const { CURRENT_SYMBOL } = useConfiguration();
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Constants
  const initialValues = {
    options: [
      {
        ...initialFormValuesTemplate,
        ...option,
      },
    ],
  };

  // Mutation
  const [createOption, { loading: mutationLoading }] = useMutation(
    option ? EDIT_OPTION : CREATE_OPTIONS,
    {
      refetchQueries: [
        {
          query: GET_OPTIONS_BY_RESTAURANT_ID,
          variables: { id: restaurantId },
        },
      ],
      onCompleted: () => {
        showToast({
          type: 'success',
          title: t('New Option'),
          message: `${t('Option have been')} ${option ? t('edited') : t('added')} ${t('successfully')}.`,
        });

        onHide();
      },
      onError: (error) => {
        let message = '';
        try {
          message = error.graphQLErrors[0]?.message;
        } catch (err) {
          message = t('Something went wrong');
        }
        showToast({
          type: 'error',
          title: t('New Option'),
          message,
        });
      },
    }
  );

  // Form Submission
  const handleSubmit = ({ options }: { options: IOptionForm[] }) => {
    createOption({
      variables: {
        optionInput: {
          restaurant: restaurantId,
          options: option
            ? omitExtraAttributes(options[0], initialEditFormValuesTemplate)
            : options,
        },
      },
    });
  };

  return (
    <Sidebar
      visible={isAddOptionsVisible}
      position={position}
      onHide={onHide}
      className="w-full sm:w-[450px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div className="flex h-full w-full items-center justify-start">
        <div className="h-full w-full">
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex flex-col">
              <span className="text-lg">
                {option ? t('Edit') : t('Add')} {t('Option')}
              </span>
            </div>

            <div className="mb-2">
              <Formik
                initialValues={initialValues}
                validationSchema={OptionSchema}
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
                  const _errors: FormikErrors<IOptionForm>[] =
                    (errors?.options as FormikErrors<IOptionForm>[]) ?? [];

                  return (
                    <Form onSubmit={handleSubmit}>
                      <div>
                        <FieldArray name="options">
                          {({ remove, push }) => (
                            <div>
                              {values.options.length > 0 &&
                                values.options.map(
                                  (value: IOptionForm, index: number) => {
                                    return (
                                      <div
                                        className="mb-2"
                                        key={`option-${index}`}
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
                                            legend={`${t('Option')} ${index + 1} ${value.title ? `(${value.title})` : ''}`}
                                            toggleable
                                            className='dark:text-white dark:bg-dark-950 '
                                          >
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                              <div>
                                                <CustomTextField
                                                  type="text"
                                                  name={`options[${index}].title]`}
                                                  placeholder={t('Title')}
                                                  maxLength={35}
                                                  value={value.title}
                                                  onChange={(e) =>
                                                    setFieldValue(
                                                      `options[${index}].title`,
                                                      e.target.value
                                                    )
                                                  }
                                                  showLabel={true}
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'title',
                                                        _errors[index]?.title,
                                                        OptionErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>
                                              <div>
                                                <CustomNumberField
                                                  name={`options[${index}].price`}
                                                  prefix={CURRENT_SYMBOL}
                                                  min={1}
                                                  max={99999}
                                                  minFractionDigits={0}
                                                  maxFractionDigits={2}
                                                  placeholder={t('Price')}
                                                  showLabel={true}
                                                  value={value.price}
                                                  onChangeFieldValue={
                                                    setFieldValue
                                                  }
                                                  style={{
                                                    borderColor:
                                                      onErrorMessageMatcher(
                                                        'price',
                                                        _errors[index]?.price,
                                                        OptionErrors
                                                      )
                                                        ? 'red'
                                                        : '',
                                                  }}
                                                />
                                              </div>
                                              <div className="col-span-1 sm:col-span-2">
                                                <CustomTextAreaField
                                                  name={`[options[${index}].description]`}
                                                  placeholder={t('Description')}
                                                  value={value.description}
                                                  onChange={handleChange}
                                                  showLabel={true}
                                                  className={''}
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
                                            </div>
                                          </Fieldset>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              {!option && (
                                <div className="mt-4 flex justify-end">
                                  <TextIconClickable
                                    className="w-full rounded border dark:border-dark-600 border-black bg-transparent text-black dark:text-white"
                                    icon={faAdd}
                                    iconStyles={{ color: theme === 'dark' ? 'white' : 'black' }}
                                    title={t('Add New Option')}
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
                            className="h-10 w-fit border dark:border-dark-600 border-gray-300 bg-black px-8 text-white"
                            label={option ? t('Update') : t('Add')}
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
}
