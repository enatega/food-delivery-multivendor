'use client';
import { useTranslations } from 'next-intl';

// Interfaces
import { IBreakdownForm } from '@/lib/utils/interfaces';

// Hooks
import { useLoyaltyContext } from '@/lib/hooks/useLoyalty';

// Formik
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { BreakdownSchema } from '@/lib/utils/schema/breakdown';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import { BreakdownErrors } from '@/lib/utils/constants';
import { useEffect, useState } from 'react';
import {
  FetchLoyaltyBreakdownsDocument,
  useCreateLoyaltyBreakdownMutation,
  useEditLoyaltyBreakdownMutation,
  useFetchLoyaltyBreakdownByIdLazyQuery,
} from '@/lib/graphql-generated';
import useToast from '@/lib/hooks/useToast';

// Initial values
const initialData: IBreakdownForm = {
  min: 0,
  max: 1,
  bronze: 1,
  silver: 1,
  gold: 1,
  platinum: 1,
};

export default function BreakdownForm() {
  // Hooks
  const { CURRENCY_SYMBOL } = useConfiguration();
  const t = useTranslations();
  const {
    loyaltyData,
    setLoyaltyData,
    breakdownFormVisible,
    setBreakdownFormVisible,
  } = useLoyaltyContext();
  const { showToast } = useToast();

  // States
  const [initialValues, setInitialValues] =
    useState<IBreakdownForm>(initialData);

  // API
  const [fetchLoyaltyLevelsById, { loading }] =
    useFetchLoyaltyBreakdownByIdLazyQuery();
  const [createLoyaltyBreakdown, { loading: creatingBreakdown }] =
    useCreateLoyaltyBreakdownMutation();
  const [updateLoyaltyBreakdown, { loading: updatingBreakdown }] =
    useEditLoyaltyBreakdownMutation();

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

      const { min, max, bronze, silver, gold, platinum } =
        data?.fetchLoyaltyBreakdownById || initialData;

      setInitialValues({
        min,
        max,
        bronze,
        silver,
        gold,
        platinum,
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
    setBreakdownFormVisible(false);
    setLoyaltyData({ breakdownId: '' });
  };

  const onHandleSubmit = async (values: IBreakdownForm) => {
    try {
      const { breakdownId } = loyaltyData || {};

      if (breakdownId) {
        await updateLoyaltyBreakdown({
          variables: {
            id: breakdownId,
            input: {
              ...values,
            },
          },
          refetchQueries: [
            {
              query: FetchLoyaltyBreakdownsDocument,
            },
          ],
        });
      } else {
        await createLoyaltyBreakdown({
          variables: {
            input: {
              ...values,
            },
          },
          refetchQueries: [
            {
              query: FetchLoyaltyBreakdownsDocument,
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
  }, [loyaltyData?.breakdownId]);

  return (
    <Sidebar
      visible={breakdownFormVisible}
      onHide={() => setBreakdownFormVisible(false)}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={BreakdownSchema}
        onSubmit={onHandleSubmit}
        validateOnChange={true}
      >
        {({ values, errors, setFieldValue, handleSubmit, isSubmitting }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <CustomNumberField
                  prefix={CURRENCY_SYMBOL + ' '}
                  min={1}
                  max={999999}
                  placeholder={`Enter min amount (${CURRENCY_SYMBOL})`}
                  name="min"
                  showLabel={true}
                  value={values.min}
                  onChange={setFieldValue}
                  isLoading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'min',
                      errors?.min,
                      BreakdownErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />
                <CustomNumberField
                  prefix={CURRENCY_SYMBOL + ' '}
                  min={1}
                  max={999999}
                  placeholder={`Enter max amount (${CURRENCY_SYMBOL})`}
                  name="max"
                  showLabel={true}
                  value={values.max}
                  onChange={setFieldValue}
                  isLoading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'max',
                      errors?.max,
                      BreakdownErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />
                <CustomNumberField
                  min={1}
                  max={999999}
                  placeholder="Enter bronze points"
                  name="bronze"
                  showLabel={true}
                  value={values.bronze}
                  onChange={setFieldValue}
                  isLoading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'bronze',
                      errors?.bronze,
                      BreakdownErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />
                <CustomNumberField
                  min={1}
                  max={999999}
                  placeholder="Enter silver points"
                  name="silver"
                  showLabel={true}
                  value={values.silver}
                  onChange={setFieldValue}
                  isLoading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'silver',
                      errors?.silver,
                      BreakdownErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />
                <CustomNumberField
                  min={1}
                  max={999999}
                  placeholder="Enter gold points"
                  name="gold"
                  showLabel={true}
                  value={values.gold}
                  onChange={setFieldValue}
                  isLoading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'gold',
                      errors?.gold,
                      BreakdownErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <CustomNumberField
                  min={1}
                  max={999999}
                  placeholder="Enter platinum points"
                  name="platinum"
                  showLabel={true}
                  value={values.platinum}
                  onChange={setFieldValue}
                  isLoading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'platinum',
                      errors?.platinum,
                      BreakdownErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting || creatingBreakdown || updatingBreakdown ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : loyaltyData?.breakdownId ? (
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
