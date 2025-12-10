'use client';
import { useTranslations } from 'next-intl';

// Interfaces
import {
  IDropdownSelectItem,
  ILevelForm,
} from '@/lib/utils/interfaces';

// Hooks
import { useLoyaltyContext } from '@/lib/hooks/useLoyalty';

// Schema
import {
  CustomerLevelSchema,
  DriverLevelSchema,
} from '@/lib/utils/schema/level';

// Formik
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import { LevelErrors, LOYALTY_LEVELS } from '@/lib/utils/constants';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import {
  FetchLoyaltyLevelsByUserTypeDocument,
  useCreateLoyaltyLevelMutation,
  useEditLoyaltyLevelMutation,
  useFetchLoyaltyLevelByIdLazyQuery,
} from '@/lib/graphql-generated';
import useToast from '@/lib/hooks/useToast';
import { useEffect, useState } from 'react';

// Initial values
const initialData: ILevelForm = {
  type: null,
  value: 0.0,
};

export default function LevelForm() {
  // Hooks
  const t = useTranslations();
  const { CURRENCY_SYMBOL } = useConfiguration();
  const {
    loyaltyType,
    levelFormVisible,
    setLevelFormVisible,
    loyaltyData,
    setLoyaltyData,
  } = useLoyaltyContext();
  const { showToast } = useToast();

  // States
  const [initialValues, setInitialValues] = useState<ILevelForm>(initialData);

  // API
  const [fetchLoyaltyLevelsById, { loading }] =
    useFetchLoyaltyLevelByIdLazyQuery();
  const [createLoyaltyLevel, { loading: creatingLevel }] =
    useCreateLoyaltyLevelMutation();
  const [updateLoyaltyLevel, { loading: updatingLevel }] =
    useEditLoyaltyLevelMutation();

  // Handler
  const init = async () => {
    try {
      const { levelId } = loyaltyData || {};

      if (!levelId) return;

      const { data } = await fetchLoyaltyLevelsById({
        variables: {
          id: levelId,
        },
      });

      if (!data) {
        showToast({
          type: 'error',
          title: 'Failed to fetch',
          message: 'Something went wrong. Please try again later',
        });
        return;
      }

      const { amount, points, name } = data?.fetchLoyaltyLevelById || {};

      setInitialValues({
        type: LOYALTY_LEVELS.find(
          (ll) => ll.code === name
        ) as IDropdownSelectItem,
        value:
          (loyaltyType === 'Customer Loyalty Program' ? points : amount) || 0,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Failed to fetch',
        message: (error as Error)?.message || 'Please try again later',
      });
    }
  };

  const onHide = () => {
    setLevelFormVisible(false);
    setLoyaltyData({ levelId: '' });
  };

  const onHandleSubmit = async (values: ILevelForm) => {
    try {
      const { levelId } = loyaltyData || {};

      if (!values?.type?.code || !values?.value) {
        showToast({
          type: 'warn',
          title: 'Missing Fields',
          message: 'Enter complete details',
        });
        return;
      }

      const userType =
        loyaltyType === 'Customer Loyalty Program' ? 'customer' : 'driver';

      if (levelId) {
        await updateLoyaltyLevel({
          variables: {
            id: levelId,
            input: {
              name: values.type?.code,
              ...(loyaltyType === 'Customer Loyalty Program'
                ? { points: values.value }
                : { amount: values.value }),
            },
          },
          refetchQueries: [
            {
              query: FetchLoyaltyLevelsByUserTypeDocument,
              variables: {
                userType:
                  loyaltyType === 'Customer Loyalty Program'
                    ? 'customer'
                    : 'driver',
              },
            },
          ],
        });
      } else {
        await createLoyaltyLevel({
          variables: {
            input: {
              userType,
              name: values.type?.code,
              ...(loyaltyType === 'Customer Loyalty Program'
                ? { points: values.value }
                : { amount: values.value }),
            },
          },
          refetchQueries: [
            {
              query: FetchLoyaltyLevelsByUserTypeDocument,
              variables: {
                userType:
                  loyaltyType === 'Customer Loyalty Program'
                    ? 'customer'
                    : 'driver',
              },
            },
          ],
        });
      }
      onHide();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed.',
        message: (err as Error)?.message || 'Please try again later',
      });
    }
  };

  // Use Effect
  useEffect(() => {
    init();
  }, [loyaltyData?.levelId]);

  return (
    <Sidebar
      visible={levelFormVisible}
      onHide={() => {
        setLevelFormVisible(false);
        setLoyaltyData({ levelId: '' });
      }}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={
          loyaltyType === 'Customer Loyalty Program'
            ? CustomerLevelSchema
            : DriverLevelSchema
        }
        onSubmit={onHandleSubmit}
        validateOnChange={true}
        enableReinitialize
      >
        {({ values, errors, setFieldValue, handleSubmit, isSubmitting }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <CustomDropdownComponent
                  name="type"
                  placeholder="Select Level Type"
                  selectedItem={values.type}
                  setSelectedItem={setFieldValue}
                  options={LOYALTY_LEVELS}
                  showLabel={true}
                  loading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'type',
                      errors?.type,
                      LevelErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                {loyaltyType === 'Customer Loyalty Program' ? (
                  <CustomNumberField
                    min={0}
                    max={999999}
                    placeholder="Type Points"
                    minFractionDigits={2}
                    maxFractionDigits={2}
                    name="value"
                    showLabel={true}
                    value={values.value}
                    onChange={setFieldValue}
                    isLoading={loading}
                    style={{
                      borderColor: onErrorMessageMatcher(
                        'value',
                        errors?.value,
                        LevelErrors
                      )
                        ? 'red'
                        : '',
                    }}
                  />
                ) : (
                  <CustomNumberField
                    min={0}
                    max={999999}
                    minFractionDigits={2}
                    maxFractionDigits={2}
                    placeholder={`Enter Amount (${CURRENCY_SYMBOL})`}
                    name="value"
                    showLabel={true}
                    value={values.value}
                    onChange={setFieldValue}
                  />
                )}

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting || creatingLevel || updatingLevel ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : loyaltyData?.levelId ? (
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
