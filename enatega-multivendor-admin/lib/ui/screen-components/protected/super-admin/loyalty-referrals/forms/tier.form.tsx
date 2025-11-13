'use client';
import { useTranslations } from 'next-intl';

// Interfaces
import { IDropdownSelectItem, ITierForm } from '@/lib/utils/interfaces';

// Hooks
import { useLoyaltyContext } from '@/lib/hooks/useLoyalty';

// Formik
import { Form, Formik } from 'formik';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import CustomDropdownComponent from '@/lib/ui/useable-components/custom-dropdown';
import { LOYALTY_TIER, TierErrors } from '@/lib/utils/constants';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import { TierSchema } from '@/lib/utils/schema/tier';
import { onErrorMessageMatcher } from '@/lib/utils/methods';
import {
  useFetchLoyaltyTierByIdLazyQuery,
  useCreateLoyaltyTierMutation,
  useEditLoyaltyTierMutation,
  FetchLoyaltyLevelsByUserTypeDocument,
  FetchLoyaltyTiersDocument,
} from '@/lib/graphql-generated';
import { useEffect, useState } from 'react';
import useToast from '@/lib/hooks/useToast';

// Initial values
const initialData: ITierForm = {
  type: null,
  value: 0,
};

export default function TierForm() {
  // Hooks
  const t = useTranslations();
  const {
    tierFormVisible,
    setTierFormVisible,
    loyaltyData,
    setLoyaltyData,
  } = useLoyaltyContext();
  const { showToast } = useToast();

  // States
  const [initialValues, setInitialValues] = useState<ITierForm>(initialData);

  const [fetchLoyaltyTierById, { loading }] =
    useFetchLoyaltyTierByIdLazyQuery();
  const [createLoyaltyTier, { loading: creatingTier }] =
    useCreateLoyaltyTierMutation();
  const [updateLoyaltyTier, { loading: updatingTier }] =
    useEditLoyaltyTierMutation();

  // Handler
  const init = async () => {
    try {
      const { tierId } = loyaltyData || {};

      if (!tierId) return;

      const { data } = await fetchLoyaltyTierById({
        variables: {
          id: tierId,
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

      const { points, name } = data?.fetchLoyaltyTierById || {};

      setInitialValues({
        type: LOYALTY_TIER.find(
          (ll) => ll.code === name
        ) as IDropdownSelectItem,
        value: points || 0,
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
    setTierFormVisible(false);
    setLoyaltyData({ tierId: '' });
  };

  const onHandleSubmit = async (values: ITierForm) => {
    try {
      const { tierId } = loyaltyData || {};

      if (!values?.type?.code || !values?.value) {
        showToast({
          type: 'warn',
          title: 'Missing Fields',
          message: 'Enter complete details',
        });
        return;
      }

      if (tierId) {
        await updateLoyaltyTier({
          variables: {
            id: tierId,
            input: {
              name: values.type?.code,
              points: values.value,
            },
          },
          refetchQueries: [
            {
              query: FetchLoyaltyLevelsByUserTypeDocument,
            },
          ],
        });
      } else {
        await createLoyaltyTier({
          variables: {
            input: {
              name: values.type?.code,
              points: values.value,
            },
          },
          refetchQueries: [
            {
              query: FetchLoyaltyTiersDocument,
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
  }, [loyaltyData?.tierId]);

  return (
    <Sidebar
      visible={tierFormVisible}
      onHide={() => setTierFormVisible(false)}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={TierSchema}
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
                  options={LOYALTY_TIER}
                  showLabel={true}
                  loading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'type',
                      errors?.type,
                      TierErrors
                    )
                      ? 'red'
                      : '',
                  }}
                />

                <CustomNumberField
                  min={1}
                  max={99999}
                  placeholder="Enter points"
                  name="value"
                  showLabel={true}
                  value={values.value}
                  onChange={setFieldValue}
                  isLoading={loading}
                  style={{
                    borderColor: onErrorMessageMatcher(
                      'value',
                      errors?.value,
                      TierErrors
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
                  {isSubmitting || creatingTier || updatingTier ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : loyaltyData?.tierId ? (
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
