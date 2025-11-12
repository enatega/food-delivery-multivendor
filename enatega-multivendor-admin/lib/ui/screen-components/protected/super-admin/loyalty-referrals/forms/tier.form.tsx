'use client';
import { useTranslations } from 'next-intl';

// Interfaces
import { ILevelForm, ILevelFormProps, ITierForm } from '@/lib/utils/interfaces';

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
import {
  LOYALTY_LEVELS,
  LOYALTY_TIER,
  TierErrors,
} from '@/lib/utils/constants';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import { useConfiguration } from '@/lib/hooks/useConfiguration';
import { TierSchema } from '@/lib/utils/schema/tier';
import { onErrorMessageMatcher } from '@/lib/utils/methods';

export default function TierForm() {
  // Hooks
  const t = useTranslations();
  const { CURRENCY_SYMBOL } = useConfiguration();
  const { loyaltyType, tierFormVisible, setTierFormVisible } =
    useLoyaltyContext();

  // Initial values
  const initialValues: ITierForm = {
    type: null,
    value: 0,
  };

  // Handler
  const onHandleSubmit = (values: ITierForm) => {};

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
                  {isSubmitting ? (
                    <ProgressSpinner
                      className="m-0 h-6 w-6 items-center self-center p-0"
                      strokeWidth="5"
                      style={{ fill: 'white', accentColor: 'white' }}
                      color="white"
                    />
                  ) : false ? (
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
