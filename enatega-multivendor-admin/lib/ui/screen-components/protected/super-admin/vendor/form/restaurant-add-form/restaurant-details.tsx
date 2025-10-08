// Core
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Form, Formik } from 'formik';
import { useContext, useMemo } from 'react';

// Prime React

// Interface and Types
import {
  IAddRestaurantComponentProps,
  ICreateRestaurant,
  ICreateRestaurantResponse,
  IDropdownSelectItem,
  IQueryResult,
  IRestaurantsByOwnerResponseGraphQL,
} from '@/lib/utils/interfaces';

// Core
import { RestaurantContext } from '@/lib/context/super-admin/restaurant.context';

// Components
import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomIconTextField from '@/lib/ui/useable-components/input-icon-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

// Constants
import {
  MAX_LANSDCAPE_FILE_SIZE,
  MAX_SQUARE_FILE_SIZE,
  RestaurantErrors,
  SHOP_TYPE,
} from '@/lib/utils/constants';

// Interface
import { IRestaurantForm } from '@/lib/utils/interfaces';
import {
  ICuisine,
  IGetCuisinesData,
} from '@/lib/utils/interfaces/cuisine.interface';

// Methods
import { onErrorMessageMatcher } from '@/lib/utils/methods/error';

// Schemas
import {
  CREATE_RESTAURANT,
  GET_CUISINES,
  GET_RESTAURANTS,
  GET_RESTAURANTS_BY_OWNER,
} from '@/lib/api/graphql';
import { ToastContext } from '@/lib/context/global/toast.context';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { toTextCase } from '@/lib/utils/methods';
import { RestaurantSchema } from '@/lib/utils/schema/restaurant';
import {
  ApolloCache,
  ApolloError,
  useMutation,
  useQuery,
} from '@apollo/client';
import { useTranslations } from 'next-intl';
import CustomPhoneTextField from '@/lib/ui/useable-components/phone-input-field';

const initialValues: IRestaurantForm = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  address: '',
  deliveryTime: 1,
  minOrder: 1,
  salesTax: 0.0,
  shopType: null,
  cuisines: [],
  image:
    'https://t4.ftcdn.net/jpg/04/76/57/27/240_F_476572792_zMwqHpmGal1fzh0tDJ3onkLo88IjgNbL.jpg',
  logo: 'https://res.cloudinary.com/dc6xw0lzg/image/upload/v1735894342/dvi5fjbsgdlrzwip0whg.jpg',
};

export default function RestaurantDetails({
  stepperProps,
}: IAddRestaurantComponentProps) {
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => {},
    type: '',
    order: -1,
  };

  // Hooks
  const t = useTranslations();

  // Context
  const { showToast } = useContext(ToastContext);
  const { vendorId, onSetRestaurantContextData } =
    useContext(RestaurantContext);

  // API
  const { data: restaurantData } = useQuery(GET_RESTAURANTS);
  console.log('restaurant data ==> ', restaurantData);
  // Mutation
  const [createRestaurant] = useMutation(CREATE_RESTAURANT, {
    onError,
    onCompleted: ({
      createRestaurant,
    }: {
      createRestaurant?: ICreateRestaurant;
    }) => {
      showToast({
        type: 'success',
        title: t('New Store'),
        message: t(`Store has been added successfully`),
        duration: 3000,
      });

      onSetRestaurantContextData({
        id: createRestaurant?._id ?? '',
      });

      onStepChange(order + 1);
    },
    update: update,
  });

  // call GET_RESTAURANTS query

  const cuisineResponse = useQueryGQL(GET_CUISINES, {
    debounceMs: 300,
  }) as IQueryResult<IGetCuisinesData | undefined, undefined>;
  cuisineResponse.data?.cuisines;

  // Memoized Constants
  const cuisinesDropdown = useMemo(
    () =>
      cuisineResponse.data?.cuisines?.map((cuisin: ICuisine) => {
        return { label: toTextCase(cuisin.name, 'title'), code: cuisin.name };
      }),
    [cuisineResponse.data?.cuisines]
  );

  // Handlers
  const onCreateRestaurant = async (data: IRestaurantForm) => {
    try {
      if (!vendorId) {
        showToast({
          type: 'error',
          title: `${vendorId ? t('Edit') : t('Create')} ${t('Vendor')}`,
          message: t(`Store Creation Failed, Please select a vendor`),
          duration: 2500,
        });
        return;
      }

      // check if values.name is present in restaurantData and show error toast
      const existingRestaurant = restaurantData?.restaurants.find(
        (restaurant :any) =>
          restaurant.name.toLowerCase() === data.name.toLowerCase()
      );
      console.log('existingRestaurant ==> ', existingRestaurant);
      if (existingRestaurant) {
        showToast({
          type: 'error',
          title: `Restaurant Already Exists`,
          message: 'Restaurant with same name already exists',
          duration: 2500,
        });
        return;
      } else {
        await createRestaurant({
          variables: {  
            owner: vendorId,
            restaurant: {
              name: data.name,
              address: data.address,
              phone: data.phoneNumber,
              image: data.image,
              logo: data.logo,
              deliveryTime: data.deliveryTime,
              minimumOrder: data.minOrder,
              username: data.username,
              password: data.password,
              shopType: data.shopType?.code,
              salesTax: data.salesTax,
              cuisines: data.cuisines.map(
                (cuisin: IDropdownSelectItem) => cuisin.code
              ),
            },
          },
        });
      }

      
    } catch (error) {
      showToast({
        type: 'error',
        title: `${vendorId ? t('Edit') : t('Create')} ${t('Vendor')}`,
        message: t(`Store Create Failed`),
        duration: 2500,
      });
    }
  };

  function onError({ graphQLErrors, networkError }: ApolloError) {
    showToast({
      type: 'error',
      title: t('Create Store'),
      message:
        graphQLErrors[0]?.message ??
        networkError?.message ??
        t(`Store Create Failed`),
      duration: 2500,
    });
  }
  function update(
    cache: ApolloCache<unknown>,
    data: ICreateRestaurantResponse
  ): void {
    if (!data) return;

    const cachedData: IRestaurantsByOwnerResponseGraphQL | null =
      cache.readQuery({
        query: GET_RESTAURANTS_BY_OWNER,
        variables: { id: vendorId },
      });

    const cachedRestaurants = cachedData?.restaurantByOwner?.restaurants ?? [];

    cache.writeQuery({
      query: GET_RESTAURANTS_BY_OWNER,
      variables: { id: vendorId },
      data: {
        restaurantByOwner: {
          ...cachedData?.restaurantByOwner,
          restaurants: [...(cachedRestaurants ?? []), createRestaurant],
        },
      },
    });
  }

  return (
    <div className="flex h-full w-full items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="mb-2 flex flex-col">
            <span className="text-lg">{t('Add Store')}</span>
          </div>

          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={RestaurantSchema}
              onSubmit={async (values) => {
                await onCreateRestaurant(values);
              }}
              validateOnChange={false}
            >
              {({
                values,
                touched,
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
              }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-2 space-y-3">
                      <div>
                        <CustomTextField
                          type="text"
                          name="name"
                          placeholder={t('Name')}
                          maxLength={35}
                          value={values.name}
                          onChange={handleChange}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'name',
                              errors?.name,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomIconTextField
                          type="email"
                          name="username"
                          placeholder={t('Email')}
                          maxLength={35}
                          showLabel={true}
                          iconProperties={{
                            icon: faEnvelope,
                            position: 'right',
                            style: { marginTop: '1px' },
                          }}
                          value={values.username}
                          onChange={handleChange}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'username',
                              errors?.username,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomPasswordTextField
                          placeholder={t('Password')}
                          name="password"
                          maxLength={20}
                          value={values.password}
                          showLabel={true}
                          onChange={handleChange}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'password',
                              errors?.password,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomPasswordTextField
                          placeholder={t('Confirm Password')}
                          name="confirmPassword"
                          maxLength={20}
                          showLabel={true}
                          value={values.confirmPassword ?? ''}
                          onChange={handleChange}
                          feedback={false}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'confirmPassword',
                              errors?.confirmPassword,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <label className="mb-[4px] text-[14px] font-medium text-[#09090B]">
                          {t('Phone')}
                        </label>
                        <CustomPhoneTextField
                          mask="999-999-9999"
                          name="phoneNumber"
                          showLabel={true}
                          // placeholder="Phone Number"
                          onChange={(e) => {
                            // console.log("phone number format ==> ", e, code);
                            setFieldValue('phoneNumber', e);
                            // setCountryCode(code);
                          }}
                          value={values.phoneNumber}
                          // value={values.phoneNumber?.toString().match(/\(\+(\d+)\)\s(.+)/)?.[2]}
                          type="text"
                          className="rounded-[6px] border-[#D1D5DB]"
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'phoneNumber',
                              errors?.phoneNumber,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomTextField
                          placeholder={t('Address')}
                          name="address"
                          type="text"
                          maxLength={100}
                          showLabel={true}
                          value={values.address ?? ''}
                          onChange={handleChange}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'address',
                              errors?.address,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                        {errors.address && touched.address && (
                          <small className="ml-1 p-error">
                            {errors.address}
                          </small>
                        )}
                      </div>

                      <div>
                        <CustomNumberField
                          suffix="m"
                          min={1}
                          max={500}
                          placeholder={t('Delivery Time')}
                          name="deliveryTime"
                          showLabel={true}
                          value={values.deliveryTime}
                          onChange={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'deliveryTime',
                              errors?.deliveryTime,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomNumberField
                          min={1}
                          max={99999}
                          placeholder={t('Min Order')}
                          name="minOrder"
                          showLabel={true}
                          value={values.minOrder}
                          onChange={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'minOrder',
                              errors?.minOrder,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <CustomNumberField
                          prefix="%"
                          min={0}
                          max={100}
                          placeholder={t('Sales Tax')}
                          minFractionDigits={2}
                          maxFractionDigits={2}
                          name="salesTax"
                          showLabel={true}
                          value={values.salesTax}
                          onChange={setFieldValue}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'salesTax',
                              errors?.salesTax,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div>
                        <CustomDropdownComponent
                          name="shopType"
                          placeholder={t('Shop Category')}
                          selectedItem={values.shopType}
                          setSelectedItem={setFieldValue}
                          options={SHOP_TYPE}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'shopType',
                              errors?.shopType,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div>
                        <CustomMultiSelectComponent
                          name="cuisines"
                          placeholder={t('Cuisines')}
                          options={cuisinesDropdown ?? []}
                          selectedItems={values.cuisines}
                          setSelectedItems={setFieldValue}
                          showLabel={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'cuisines',
                              errors?.cuisines as string,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4">
                        <CustomUploadImageComponent
                          key="logo"
                          name="logo"
                          title={t('Upload Profile Image')}
                          fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                          maxFileHeight={1080}
                          maxFileWidth={1080}
                          maxFileSize={MAX_SQUARE_FILE_SIZE}
                          orientation="SQUARE"
                          onSetImageUrl={setFieldValue}
                          existingImageUrl={values.logo}
                          showExistingImage={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'logo',
                              errors?.logo as string,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                        <CustomUploadImageComponent
                          key={'image'}
                          name="image"
                          title={t('Upload Image')}
                          fileTypes={['image/jpg', 'image/webp', 'image/jpeg']}
                          maxFileHeight={841}
                          maxFileWidth={1980}
                          maxFileSize={MAX_LANSDCAPE_FILE_SIZE}
                          orientation="LANDSCAPE"
                          onSetImageUrl={setFieldValue}
                          existingImageUrl={values.image}
                          showExistingImage={true}
                          style={{
                            borderColor: onErrorMessageMatcher(
                              'image',
                              errors?.image as string,
                              RestaurantErrors
                            )
                              ? 'red'
                              : '',
                          }}
                        />
                      </div>

                      <div className="mt-4 flex justify-end items-center">
                        {errors.address && touched.address && (
                          <small className="p-error mr-4">
                            {errors.address}
                          </small>
                        )}
                        <CustomButton
                          className="h-10 w-fit border-gray-300 bg-black px-8 text-white"
                          label={t('Add')}
                          type="submit"
                          loading={isSubmitting}
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
  );
}
