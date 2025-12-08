// Hooks
import useToast from '@/lib/hooks/useToast';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomLoader from '@/lib/ui/useable-components/custom-progress-indicator';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';

// Interfaces
import {
  ISubCategoriesAddFormProps,
  ISubCategory,
} from '@/lib/utils/interfaces';

// Schema
import { SubCategoriesSchema } from '@/lib/utils/schema/sub-categories';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';

// Formik
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';

// Prime React
import { Sidebar } from 'primereact/sidebar';

// GraphQL
import {
  GET_CATEGORY_BY_RESTAURANT_ID,
  GET_RESTAURANTS,
} from '@/lib/api/graphql';
import { Fieldset } from 'primereact/fieldset';
import {
  GET_SUBCATEGORIES,
  GET_SUBCATEGORIES_BY_PARENT_ID,
} from '@/lib/api/graphql/queries/sub-categories';
import { CREATE_SUB_CATEGORIES } from '@/lib/api/graphql/mutations/sub-category';

// Contexts
import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';
import { useTranslations } from 'next-intl';

export default function SubCategoriesAddForm({
  onHide,
  isAddSubCategoriesVisible,
}: ISubCategoriesAddFormProps) {
  // Hooks
  const t = useTranslations();

  // Context
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const restaurantId = restaurantLayoutContextData?.restaurantId || '';

  // Toast
  const { showToast } = useToast();

  // Initial Values
  const initialValues: { subCategories: ISubCategory[] } = {
    subCategories: [
      {
        parentCategoryId: isAddSubCategoriesVisible.parentCategoryId,
        title: '',
      },
    ],
  };

  // Mutations
  const [
    createSubCategories,
    { loading: subCategoriesLoading, error: subCategoriesError },
  ] = useMutation(CREATE_SUB_CATEGORIES, {
    refetchQueries: [
      {
        query: GET_CATEGORY_BY_RESTAURANT_ID,
        variables: { id: restaurantId },
      },
      {
        query: GET_SUBCATEGORIES,
      },
      {
        query: GET_SUBCATEGORIES_BY_PARENT_ID,
        variables: {
          parentCategoryId: isAddSubCategoriesVisible.parentCategoryId,
        },
      },
    ],
    onError: (error) => {
      return showToast({
        type: 'error',
        title: t('Create Sub-Categories'),
        message:
          error?.clientErrors[0].message ||
          subCategoriesError?.clientErrors[0].message ||
          error?.networkError?.message ||
          subCategoriesError?.networkError?.message ||
          error?.graphQLErrors[0]?.message ||
          subCategoriesError?.graphQLErrors[0]?.message ||
          error?.cause?.message ||
          subCategoriesError?.cause?.message ||
          t('An error occured while adding the new sub-categories'),
      });
    },
  });

  // Handlers
  async function handleFormSubmit(
    values: ISubCategory[],
    formikHelpers: FormikHelpers<{ subCategories: ISubCategory[] }>
  ) {
    try {
      if (values.filter((subCategory) => !subCategory.title).length > 0) {
        return showToast({
          type: 'warn',
          title: t('Create Sub-Categories'),
          message: t('Title for each sub-category is a required field'),
        });
      }
      const response = await createSubCategories({
        variables: {
          subCategories: values,
        },
        refetchQueries: [
          { query: GET_RESTAURANTS },
          {
            query: GET_SUBCATEGORIES_BY_PARENT_ID,
            variables: {
              parentCategoryId: isAddSubCategoriesVisible.parentCategoryId,
            },
          },
        ],
      });
      const errMsg = response?.errors?.map((e) => {
        return JSON.stringify(e.message);
      });
      showToast({
        title: t(`Create Sub-Category`),
        type: response.errors?.length ? 'error' : 'success',
        message: response.errors?.length
          ? JSON.stringify(errMsg)
          : t(`Created Sub-Category Successfully`),
      });
      formikHelpers.resetForm();
      isAddSubCategoriesVisible.bool = false;
    } catch (error) {
      return showToast({
        type: 'error',
        title: t('Create Sub-Categories'),
        message:
          subCategoriesError?.cause?.message ||
          subCategoriesError?.graphQLErrors[0]?.message ||
          subCategoriesError?.clientErrors[0].message ||
          subCategoriesError?.networkError?.message ||
          t('An error occured while adding the new sub-categories'),
      });
    }
  }
  return (
    <Sidebar
      onHide={onHide}
      visible={isAddSubCategoriesVisible.bool}
      position="right"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values, formikHelpers) =>
          handleFormSubmit(values.subCategories, formikHelpers)
        }
        validationSchema={SubCategoriesSchema}
      >
        {({ handleChange, values, handleSubmit }) => (
          <Form>
            <FieldArray name="subCategories">
              {({ remove, push }) => (
                <div>
                  {values?.subCategories?.map((value: ISubCategory, index) => {
                    value.parentCategoryId =
                      isAddSubCategoriesVisible.parentCategoryId;
                    return (
                      <div key={index} className=" rounded-lg shadow-sm">
                        <Fieldset
                          legend={`${t('Sub-Category')} #${index + 1} ${value.title ? `(${value.title})` : ''}`}
                          toggleable
                          className="my-1"
                        >
                          {/* Sub-Category Field and Remove Button */}
                          <div className="flex-col justify-center items-center">
                            <TextIconClickable
                              icon={faTrash}
                              iconStyles={{ color: 'red' }}
                              className="text-red-500 hover:text-red-700 transition-colors justify-self-end"
                              title=""
                              onClick={() => {
                                if (index > 0) {
                                  remove(index);
                                } else {
                                  showToast({
                                    type: 'warn',
                                    title: t('Remove Sub-Category'),
                                    message: `${t('At least one Sub-Category is required')}.`,
                                  });
                                }
                              }}
                            />
                            <CustomTextField
                              name={`subCategories[${index}].title`}
                              value={value.title}
                              maxLength={15}
                              onChange={handleChange}
                              placeholder={t('Title')}
                              showLabel={true}
                              type="text"
                            />
                          </div>
                        </Fieldset>
                        {/* Add More Button */}
                        {index === values.subCategories.length - 1 && (
                          <div className="mt-4">
                            <TextIconClickable
                              icon={faAdd}
                              title={t('Add More')}
                              onClick={() =>
                                push({
                                  title: '',
                                  parentCategoryId: '',
                                })
                              }
                              className="w-full flex justify-center items-center py-2 border border-dashed border-gray-400 rounded-md text-gray-600 hover:text-black  hover:border-black transition-all"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </FieldArray>
            {subCategoriesLoading ? (
              <CustomLoader />
            ) : (
              <CustomButton
                label={t('Submit')}
                className="h-10 w-fit border-gray-300 bg-black px-8 text-white block m-auto my-2"
                onClick={() => handleSubmit()}
                type="submit"
              />
            )}
          </Form>
        )}
      </Formik>
    </Sidebar>
  );
}
