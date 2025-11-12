'use client';
import { useTranslations } from 'next-intl';

// Interfaces
import { ILevelForm, ILevelFormProps } from '@/lib/utils/interfaces';

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

export default function LevelForm(props: ILevelFormProps) {
  // Hooks
  const t = useTranslations();
  const { CURRENCY_SYMBOL } = useConfiguration();
  const { loyaltyType, levelFormVisible, setLevelFormFormVisible } =
    useLoyaltyContext();

  // Initial values
  const customerInitialValues: ILevelForm = {
    type: null,
    value: 0.00,
  };
  const driverInitialValues: ILevelForm = {
    type: null,
    value: 0.00,
  };

  // Handler
  const onHandleSubmit = (values: ILevelForm) => {};

  return (
    <Sidebar
      visible={levelFormVisible}
      onHide={() => setLevelFormFormVisible(false)}
      position="right"
      className="w-full sm:w-[450px]"
    >
      <Formik
        initialValues={
          loyaltyType === 'Customer Loyalty Program'
            ? customerInitialValues
            : driverInitialValues
        }
        validationSchema={
          loyaltyType === 'Customer Loyalty Program'
            ? CustomerLevelSchema
            : DriverLevelSchema
        }
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
                  options={LOYALTY_LEVELS}
                  showLabel={true}
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
