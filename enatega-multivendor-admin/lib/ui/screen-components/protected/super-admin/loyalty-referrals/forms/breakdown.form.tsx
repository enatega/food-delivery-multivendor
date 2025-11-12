'use client';
import { useTranslations } from 'next-intl';

// Interfaces
import { IBreakdownForm, ITierForm } from '@/lib/utils/interfaces';

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

export default function BreakdownForm() {
  // Hooks
  const { CURRENCY_SYMBOL, CURRENCY_CODE } = useConfiguration();
  const t = useTranslations();

  const { breakdownFormVisible, setBreakdownFormVisible } = useLoyaltyContext();

  // Initial values
  const initialValues: IBreakdownForm = {
    min: 0,
    max: 1,
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  };

  // Handler
  const onHandleSubmit = (values: IBreakdownForm) => {};

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
