import React, { useContext, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { ProfileContext } from '@/lib/context/restaurant/profile.context';
import { ToastContext } from '@/lib/context/global/toast.context';

import CustomButton from '@/lib/ui/useable-components/button';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import CustomMultiSelectComponent from '@/lib/ui/useable-components/custom-multi-select';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomIconTextField from '@/lib/ui/useable-components/input-icon-field';
import CustomPasswordTextField from '@/lib/ui/useable-components/password-input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import CustomUploadImageComponent from '@/lib/ui/useable-components/upload/upload-image';

import {
  MAX_LANSDCAPE_FILE_SIZE,
  MAX_SQUARE_FILE_SIZE,
  ProfileErrors,
  RestaurantErrors,
  SELECTED_SHOPTYPE,
  SHOP_TYPE,
} from '@/lib/utils/constants';
import { RestaurantSchema } from '@/lib/utils/schema/restaurant';
import { EDIT_RESTAURANT, GET_CUISINES } from '@/lib/api/graphql';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import {
  onErrorMessageMatcher,
  onUseLocalStorage,
  toTextCase,
} from '@/lib/utils/methods';

import { RestaurantLayoutContext } from '@/lib/context/restaurant/layout-restaurant.context';

import {
  IUpdateProfileProps,
  IUpdateProfileForm,
  IQueryResult,
} from '@/lib/utils/interfaces';

import {
  ICuisine,
  IGetCuisinesData,
} from '@/lib/utils/interfaces/cuisine.interface';
import { useTranslations } from 'next-intl';
import CustomPhoneTextField from '@/lib/ui/useable-components/phone-input-field';
import { useShopTypes } from '@/lib/hooks/useShopType';

export default function UpdateRestaurantDetails({
  stepperProps,
}: IUpdateProfileProps) {
  const { onStepChange, order } = stepperProps ?? {
    onStepChange: () => {},
    order: -1,
  };

  // Hooks
  const t = useTranslations();

  // Contexts
  const { restaurantLayoutContextData } = useContext(RestaurantLayoutContext);
  const { restaurantId } = restaurantLayoutContextData;

  const { showToast } = useContext(ToastContext);
  const { restaurantProfileResponse, refetchRestaurantProfile } =
    useContext(ProfileContext);

  const [editRestaurant] = useMutation(EDIT_RESTAURANT, {
    onError: ({ graphQLErrors, networkError }) => {
      showToast({
        type: 'error',
        title: t('Edit Store'),
        message:
          graphQLErrors[0]?.message ??
          networkError?.message ??
          t('Store Edit Failed'),
        duration: 2500,
      });
    },
    onCompleted: async () => {
      showToast({
        type: 'success',
        title: t('Store Details Saved'),
        message: t('Store has been updated successfully'),
        duration: 3000,
      });

      await refetchRestaurantProfile();

      onStepChange(order + 1);
    },
  });

  const { dropdownList, loading } = useShopTypes({
    invoke_now: true,
    transform_to_dropdown_list: true,
  });

  const cuisineResponse = useQueryGQL(GET_CUISINES, {
    debounceMs: 300,
  }) as IQueryResult<IGetCuisinesData | undefined, undefined>;

  const cuisinesDropdown = useMemo(
    () =>
      cuisineResponse.data?.cuisines?.map((cuisine: ICuisine) => ({
        label: toTextCase(cuisine.name, 'title'),
        code: cuisine.name,
      })),
    [cuisineResponse.data?.cuisines]
  );

  const initialValues: IUpdateProfileForm = useMemo(() => {
    const restaurantData = restaurantProfileResponse.data?.restaurant;
    return {
      name: restaurantData?.name ?? '',
      username: restaurantData?.username ?? '',
      password: restaurantData?.password ?? '',
      confirmPassword: restaurantData?.password ?? '',
      phoneNumber: restaurantData?.phone ?? '',
      address: restaurantData?.address ?? '',
      deliveryTime: restaurantData?.deliveryTime ?? 0,
      minOrder: restaurantData?.minimumOrder ?? 0,
      salesTax: restaurantData?.tax ?? 0,
      shopType:
        dropdownList?.find((type) => type.label === restaurantData?.shopType) ??
        null,
      cuisines: Array.isArray(restaurantData?.cuisines)
        ? restaurantData.cuisines.map((cuisine) => ({
            label: toTextCase(cuisine, 'title'),
            code: cuisine,
          }))
        : [],
      image: restaurantData?.image ?? '',
      logo: restaurantData?.logo ?? '',
      email: restaurantData?.username ?? '',
      orderprefix: restaurantData?.orderPrefix ?? '',
    };
  }, [restaurantProfileResponse.data?.restaurant, dropdownList]);

  const onEditRestaurant = async (data: IUpdateProfileForm) => {
    if (!restaurantId) {
      showToast({
        type: 'error',
        title: t('Edit Store'),
        message: t('Store Edit Failed - Please select a vendor'),
        duration: 2500,
      });
      return;
    }

    try {
      await editRestaurant({
        variables: {
          restaurantInput: {
            _id: restaurantId,
            name: data.name,
            phone: data.phoneNumber,
            address: data.address,
            image: data.image,
            logo: data.logo,
            deliveryTime: data.deliveryTime,
            minimumOrder: data.minOrder,
            username: data.username,
            password: data.password,
            shopType: data.shopType?.code,
            salesTax: data.salesTax,
            orderPrefix: data.orderprefix,
            cuisines: data.cuisines.map((cuisine) => cuisine.code),
          },
        },
      });
      onUseLocalStorage('save', SELECTED_SHOPTYPE, data.shopType?.code);
    } catch (error) {
      showToast({
        type: 'error',
        title: t('Store Details'),
        message: t('Something went wrong'),
      });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-start">
      <div className="h-full w-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col mb-2">
            <span className="text-lg">{t('Update Profile')}</span>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={RestaurantSchema}
            onSubmit={(values) => {
              return onEditRestaurant(values);
            }}
            validateOnChange={false}
            enableReinitialize
          >
            {({
              touched,
              values,
              errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <div className="space-y-3 mb-2">
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
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

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
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

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
                            ProfileErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>

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
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />
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

                    <CustomTextField
                      placeholder={t('Address')}
                      name="address"
                      type="text"
                      maxLength={100}
                      showLabel={true}
                      value={values.address}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'address',
                          errors?.address,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />
                    {errors.address && touched.address && (
                      <small className="p-error">{errors.address}</small>
                    )}

                    <CustomNumberField
                      suffix=" m"
                      min={0}
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
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

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
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomNumberField
                      suffix=" %"
                      min={0}
                      max={100}
                      placeholder={t('Service Charges')}
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
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomTextField
                      placeholder={t('Order Prefix')}
                      name="orderprefix"
                      type="text"
                      maxLength={100}
                      showLabel={true}
                      value={values.orderprefix}
                      onChange={handleChange}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'orderprefix',
                          errors?.orderprefix,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

                    <CustomDropdownComponent
                      name="shopType"
                      placeholder={t('Shop Category')}
                      selectedItem={values.shopType}
                      setSelectedItem={setFieldValue}
                      options={dropdownList || []}
                      loading={loading}
                      showLabel={true}
                      style={{
                        borderColor: onErrorMessageMatcher(
                          'shopType',
                          errors?.shopType,
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

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
                          ProfileErrors
                        )
                          ? 'red'
                          : '',
                      }}
                    />

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
                            ProfileErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
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
                        showExistingImage={true}
                        style={{
                          borderColor: onErrorMessageMatcher(
                            'image',
                            errors?.image as string,
                            ProfileErrors
                          )
                            ? 'red'
                            : '',
                        }}
                      />
                    </div>

                    <div className="flex justify-end items-center mt-4">
                      {errors.address && touched.address && (
                        <small className="p-error mr-4">{errors.address}</small>
                      )}
                      <CustomButton
                        className="w-fit h-10 bg-black text-white border-gray-300 px-8"
                        label={t('Update')}
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
  );
}
