'use client';

// Components
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomTextField from '@/lib/ui/useable-components/input-field';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';
import { IDeal } from '@/lib/ui/screens/super-admin/management/deals';

// Formik
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';

// Hooks
import useToast from '@/lib/hooks/useToast';
import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';

// GraphQL
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import {
  GET_ALL_FOODS,
  GET_ALL_FOOD_DEALS_ADMIN,
} from '@/lib/api/graphql/queries/food';
import {
  CREATE_FOOD_DEAL,
  UPDATE_FOOD_DEAL,
} from '@/lib/api/graphql/mutations/food-deal';

interface IDealsFormProps {
  setVisible: (visible: boolean) => void;
  isEditing: IEditState<IDeal>;
  visible: boolean;
  setIsEditing: (editing: IEditState<IDeal>) => void;
}

interface IProduct {
  id: string;
  title: string;
  image?: string;
  variations: IVariation[];
}

interface IVariation {
  id: string;
  title: string;
  price: number;
  outofstock?: boolean;
}

export default function DealsForm({
  setVisible,
  isEditing,
  visible,
  setIsEditing,
}: IDealsFormProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // States
  const [searchProduct, setSearchProduct] = useState('');
  const [restaurantId, setRestaurantId] = useState('');

  // Get restaurantId from localStorage on client side
  useEffect(() => {
    const id = localStorage.getItem('restaurantId') || '';
    setRestaurantId(id);
  }, []);

  // Fetch products
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useQuery(GET_ALL_FOODS, {
    variables: { restaurantId },
    skip: !restaurantId,
  });

  // Mutations
  const [createFoodDeal, { loading: createLoading }] = useMutation(
    CREATE_FOOD_DEAL,
    {
      refetchQueries: [
        {
          query: GET_ALL_FOOD_DEALS_ADMIN,
          variables: {
            page: 1,
            limit: 10,
            isActive: null,
            search: null,
            restaurantId,
          },
        },
      ],
    }
  );
  const [updateFoodDeal, { loading: updateLoading }] = useMutation(
    UPDATE_FOOD_DEAL,
    {
      refetchQueries: [
        {
          query: GET_ALL_FOOD_DEALS_ADMIN,
          variables: {
            page: 1,
            limit: 10,
            isActive: null,
            search: null,
            restaurantId,
          },
        },
      ],
    }
  );

  const allProducts: IProduct[] = productsData?.getAllfoods || [];

  // Handle products fetch error
  useEffect(() => {
    if (productsError) {
      let message = '';
      try {
        message =
          productsError.graphQLErrors?.[0]?.message || productsError.message;
      } catch (err) {
        message = t('Failed to load products');
      }
      showToast({
        type: 'error',
        title: t('Error'),
        message,
        duration: 3000,
      });
    }
  }, [productsError, showToast, t]);

  // Validation Schema
  const DealsFormSchema = Yup.object().shape({
    dealName: Yup.string().required('Deal name is required'),
    productId: Yup.string().required('Product is required'),
    variationId: Yup.string().required('Variation is required'),
    discountType: Yup.string()
      .required('Discount type is required')
      .oneOf(['PERCENTAGE', 'FIXED', 'percentage_off', 'fixed_amount_off']),
    discountValue: Yup.number()
      .required('Discount value is required')
      .min(0, 'Discount value must be greater than 0'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    isActive: Yup.boolean(),
  });

  // Helper function to normalize discount type from API to form
  const normalizeDiscountTypeFromAPI = (type: string) => {
    if (type === 'PERCENTAGE' || type === 'percentage_off') {
      return 'PERCENTAGE';
    }
    if (type === 'FIXED' || type === 'fixed_amount_off') {
      return 'FIXED';
    }
    return 'PERCENTAGE';
  };

  // Helper function to convert discount type from form to API
  const convertDiscountTypeToAPI = (type: string) => {
    if (type === 'PERCENTAGE') {
      return 'PERCENTAGE';
    }
    if (type === 'FIXED') {
      return 'FIXED';
    }
    return 'PERCENTAGE';
  };

  // Initial values
  const initialValues = {
    _id: isEditing.bool ? isEditing.data.id || isEditing.data._id : '',
    dealName: isEditing.bool ? isEditing.data.title || '' : '',
    productId: isEditing.bool ? isEditing.data.food || '' : '',
    variationId: isEditing.bool ? isEditing.data.variation || '' : '',
    discountType: isEditing.bool
      ? normalizeDiscountTypeFromAPI(
          isEditing.data.discountType || isEditing.data.dealType || 'PERCENTAGE'
        )
      : 'PERCENTAGE',
    discountValue: isEditing.bool ? (isEditing.data.discountValue ?? 0) : 0,
    startDate: isEditing.bool
      ? new Date(
          typeof isEditing.data.startDate === 'string' &&
          !isNaN(Number(isEditing.data.startDate))
            ? Number(isEditing.data.startDate)
            : isEditing.data.startDate
        )
      : new Date(),
    endDate: isEditing.bool
      ? new Date(
          typeof isEditing.data.endDate === 'string' &&
          !isNaN(Number(isEditing.data.endDate))
            ? Number(isEditing.data.endDate)
            : isEditing.data.endDate
        )
      : new Date(),
    isActive: isEditing.bool ? (isEditing.data.isActive ?? true) : true,
  };

  // Discount type options
  const discountTypeOptions = [
    { label: 'Percentage', value: 'PERCENTAGE' },
    { label: 'Fixed Amount', value: 'FIXED' },
  ];

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchProduct.toLowerCase())
    );
  }, [allProducts, searchProduct]);

  // Product option template
  const productOptionTemplate = (option: IProduct) => {
    return (
      <div className="flex items-center gap-2">
        {option.image && (
          <img
            src={option.image}
            alt={option.title}
            className="h-8 w-8 rounded object-cover"
          />
        )}
        <span>{option.title}</span>
      </div>
    );
  };

  // Selected product template
  const selectedProductTemplate = (option: IProduct | null) => {
    if (!option) {
      return <span>{t('Select a product')}</span>;
    }
    return (
      <div className="flex items-center gap-2">
        {option.image && (
          <img
            src={option.image}
            alt={option.title}
            className="h-8 w-8 rounded object-cover"
          />
        )}
        <span>{option.title}</span>
      </div>
    );
  };

  // Variation option template
  const variationOptionTemplate = (option: IVariation) => {
    return (
      <div className="flex items-center justify-between">
        <span>{option.title}</span>
        <span className="text-sm text-gray-500">${option.price}</span>
      </div>
    );
  };

  // Reset form
  const resetForm = () => {
    setIsEditing({
      bool: false,
      data: {
        __typename: '',
        _id: '',
        vendor: '',
        vendorId: '',
        dealType: 'PERCENTAGE',
        discount: 0,
        startDate: '',
        endDate: '',
        description: '',
      },
    });
    setSearchProduct('');
  };

  return (
    <Sidebar
      visible={visible}
      onHide={() => {
        setVisible(false);
        resetForm();
      }}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={DealsFormSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          const baseInput = {
            title: values.dealName,
            discountType: convertDiscountTypeToAPI(values.discountType),
            food: values.productId,
            discountValue: values.discountValue,
            variation: values.variationId,
            restaurant: restaurantId,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            isActive: values.isActive,
          };

          try {
            if (isEditing.bool) {
              await updateFoodDeal({
                variables: {
                  id: values._id,
                  input: {
                    ...baseInput,
                  },
                },
              });
            } else {
              await createFoodDeal({
                variables: {
                  input: {
                    ...baseInput,
                  },
                },
              });
            }

            showToast({
              title: `${isEditing.bool ? t('Edit') : t('New')} ${t('Deal')}`,
              type: 'success',
              message: `${t('Deal has been')} ${isEditing.bool ? t('updated') : t('added')} ${t('successfully')}`,
              duration: 2000,
            });

            // Only close and reset form on success
            setVisible(false);
            resetForm();
          } catch (error: any) {
            console.error('DealsForm Error:', error);
            let message = '';
            try {
              if (error instanceof ApolloError) {
                if (error.graphQLErrors && error.graphQLErrors.length > 0) {
                  message = error.graphQLErrors[0].message;
                } else if (error.networkError) {
                  // Attempt to extract body from network error if possible, though typically complex types
                  // Cast to any to access internal properties if known, or just use message
                  const networkErr = error.networkError as any;
                  if (networkErr?.result?.errors?.length > 0) {
                    message = networkErr.result.errors[0].message;
                  } else if (networkErr?.bodyText) {
                    try {
                      const body = JSON.parse(networkErr.bodyText);
                      message =
                        body?.errors?.[0]?.message ||
                        body?.message ||
                        networkErr.message;
                    } catch {
                      message = error.message;
                    }
                  } else {
                    message = error.message;
                  }
                } else {
                  message = error.message;
                }
              } else {
                message = (error as Error).message;
              }
            } catch (err) {
              message = t('ActionFailedTryAgain');
            }
            showToast({
              type: 'error',
              title: t('Error'),
              message,
              duration: 3000,
            });
            // Do not close or reset form on error
          } finally {
            setSubmitting(false);
          }
        }}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ errors, handleSubmit, values, isSubmitting, setFieldValue }) => {
          const selectedProduct =
            allProducts.find((p) => p.id === values.productId) || null;

          const availableVariations = selectedProduct?.variations || [];

          const selectedVariation =
            availableVariations.find((v) => v.id === values.variationId) ||
            null;

          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  {isEditing.bool ? t('Edit') : t('Add')} {t('Deal')}
                </h2>

                <CustomTextField
                  value={values.dealName}
                  name="dealName"
                  showLabel={true}
                  placeholder={t('Deal Name')}
                  type="text"
                  onChange={(e) => setFieldValue('dealName', e.target.value)}
                  style={{
                    borderColor: errors?.dealName ? 'red' : '#d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem',
                  }}
                />
                {errors.dealName && (
                  <p className="text-sm text-red-500">
                    {errors.dealName as string}
                  </p>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Select Product')}
                  </label>
                  <Dropdown
                    value={selectedProduct}
                    options={filteredProducts}
                    onChange={(e) => {
                      setFieldValue('productId', e.value.id);
                      // Clear variation when product changes
                      setFieldValue('variationId', '');
                    }}
                    optionLabel="title"
                    dataKey="id"
                    placeholder={t('Select a product')}
                    filter
                    filterBy="title"
                    filterPlaceholder={t('Search products...')}
                    onFilter={(e) => setSearchProduct(e.filter)}
                    itemTemplate={productOptionTemplate}
                    valueTemplate={selectedProductTemplate}
                    className="w-full"
                    disabled={productsLoading || !!productsError}
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                  {productsError && (
                    <p className="mt-1 text-sm text-red-500">
                      {t('Failed to load products. Please try again.')}
                    </p>
                  )}
                  {errors.productId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.productId as string}
                    </p>
                  )}
                </div>

                {/* Variation Dropdown - Shows when product is selected */}
                {selectedProduct && availableVariations.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {t('Select Variation')}
                    </label>
                    <Dropdown
                      value={selectedVariation}
                      options={availableVariations}
                      onChange={(e) => setFieldValue('variationId', e.value.id)}
                      optionLabel="title"
                      dataKey="id"
                      placeholder={t('Select a variation')}
                      itemTemplate={variationOptionTemplate}
                      valueTemplate={(option) =>
                        option ? option.title : t('Select a variation')
                      }
                      className="w-full"
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                      }}
                    />
                    {errors.variationId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.variationId as string}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Discount Type')}
                  </label>
                  <Dropdown
                    value={values.discountType}
                    options={discountTypeOptions}
                    onChange={(e) => setFieldValue('discountType', e.value)}
                    placeholder={t('Select type')}
                    className="w-full"
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                    }}
                  />
                  {errors.discountType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.discountType as string}
                    </p>
                  )}
                </div>

                <div>
                  <CustomNumberField
                    value={values.discountValue}
                    name="discountValue"
                    minFractionDigits={0}
                    maxFractionDigits={2}
                    showLabel={true}
                    suffix={values.discountType === 'PERCENTAGE' ? '%' : ''}
                    prefix={values.discountType === 'FIXED' ? '€' : ''}
                    placeholder={t('Discount Value')}
                    onChange={setFieldValue}
                    min={0}
                    max={values.discountType === 'PERCENTAGE' ? 100 : undefined}
                    style={{
                      borderColor: errors?.discountValue ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.discountValue && (
                    <p className="text-sm text-red-500">
                      {errors.discountValue as string}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {t('Start Date')}
                    </label>
                    <Calendar
                      value={values.startDate}
                      onChange={(e) => setFieldValue('startDate', e.value)}
                      showIcon
                      dateFormat="dd/mm/yy"
                      className="w-full calendar-no-focus-border"
                      inputClassName="text-sm"
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        height: '2.4rem',
                      }}
                      inputStyle={{
                        fontSize: '0.875rem',
                        padding: '0.5rem 0.75rem',
                      }}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.startDate as string}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {t('End Date')}
                    </label>
                    <Calendar
                      value={values.endDate}
                      onChange={(e) => setFieldValue('endDate', e.value)}
                      showIcon
                      dateFormat="dd/mm/yy"
                      minDate={values.startDate}
                      className="w-full calendar-no-focus-border"
                      inputClassName="text-sm"
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        height: '2.4rem',
                      }}
                      inputStyle={{
                        fontSize: '0.875rem',
                        padding: '0.5rem 0.75rem',
                      }}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.endDate as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between  !mb-10 ">
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    {t('Status')}
                  </label>
                  <InputSwitch
                    inputId="isActive"
                    checked={values.isActive}
                    onChange={(e) => setFieldValue('isActive', e.value)}
                  />
                </div>

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white disabled:opacity-50"
                  disabled={isSubmitting || createLoading || updateLoading}
                  type="submit"
                >
                  {isSubmitting || createLoading || updateLoading ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : isEditing.bool ? (
                    t('Update')
                  ) : (
                    t('Add')
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Sidebar>
  );
}
