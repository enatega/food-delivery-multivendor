// Core
import React from 'react';
import { Form, Formik } from 'formik';

// Custom Components
import CustomCommissionTextField from '../../custom-commission-input';
import CustomButton from '../../button';

// Interfaces and Types
import {
  ICommissionColumnProps,
  ICommissionRateRestaurantResponse,
} from '@/lib/utils/interfaces';
import { useTranslations } from 'next-intl';

export const COMMISSION_RATE_COLUMNS = ({
  handleSave,
  handleCommissionRateChange,
  loadingRestaurant,
}: ICommissionColumnProps & { loadingRestaurant: string | null }) => {
  // Hooks
  const t = useTranslations();
  return [
    {
      headerName: t('Name'),
      propertyName: 'name',
      body: (restaurant: ICommissionRateRestaurantResponse) => (
        <span style={{ fontWeight: 'bold' }}>{restaurant.name}</span>
      ),
    },
    {
      headerName: t('Set Commission Rate'),
      propertyName: 'commissionRate',
      body: (restaurant: ICommissionRateRestaurantResponse) => (
        <Formik
          initialValues={{
            [`commissionRate-${restaurant._id}`]: restaurant.commissionRate,
          }}
          onSubmit={() => {
            handleSave(restaurant._id);
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="flex">
                <CustomCommissionTextField
                  type="number"
                  name={`commissionRate-${restaurant._id}`}
                  value={String(values[`commissionRate-${restaurant._id}`])}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    handleCommissionRateChange(
                      restaurant._id,
                      parseFloat(e.target.value)
                    );
                  }}
                  min={0}
                  max={100}
                  showLabel={false}
                  loading={false}
                />
              </div>
            </Form>
          )}
        </Formik>
      ),
    },
    {
      headerName: t('Actions'),
      propertyName: 'action',
      body: (restaurant: ICommissionRateRestaurantResponse) => (
        <Formik initialValues={{}} onSubmit={() => handleSave(restaurant._id)}>
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <CustomButton
                type="submit"
                className="mt-2 flex h-10 w-24 rounded-md border border-gray-500 bg-white dark:bg-dark-950 px-4 text-black dark:text-white transition-colors duration-200 hover:bg-black hover:text-white"
                label={t('Save')}
                rounded={false}
                loading={loadingRestaurant === restaurant._id || isSubmitting}
                disabled={loadingRestaurant === restaurant._id || isSubmitting}
              />
            </Form>
          )}
        </Formik>
      ),
    },
  ];
};
