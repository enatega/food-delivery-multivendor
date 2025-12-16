'use client';

// Components
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';
import { ILoyaltyLevel } from '@/lib/ui/screens/super-admin/referral-wallet';

// Formik
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';

// Hooks
import useToast from '@/lib/hooks/useToast';
import { useTranslations } from 'next-intl';

interface ILoyaltyLevelsFormProps {
  setVisible: (visible: boolean) => void;
  isEditing: IEditState<ILoyaltyLevel>;
  visible: boolean;
  setIsEditing: (editing: IEditState<ILoyaltyLevel>) => void;
}

export default function LoyaltyLevelsForm({
  setVisible,
  /* eslint-disable-next-line */
  isEditing: _isEditing, // Renamed to _isEditing
  visible,
  setIsEditing,
}: ILoyaltyLevelsFormProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // Validation Schema
  const LoyaltyLevelsSchema = Yup.object().shape({
    silver: Yup.number()
      .required('Silver points is required')
      .min(0, 'Points must be 0 or greater'),
    gold: Yup.number()
      .required('Gold points is required')
      .min(0, 'Points must be 0 or greater'),
    platinum: Yup.number()
      .required('Platinum points is required')
      .min(0, 'Points must be 0 or greater'),
  });

  // Initial values
  const initialValues = {
    silver: 2000,
    gold: 5000,
    platinum: 5000,
  };

  // Reset form
  const resetForm = () => {
    setIsEditing({
      bool: false,
      data: {
        _id: '',
        name: '',
        pointsRequired: 0,
        benefits: '',
      },
    });
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
        validationSchema={LoyaltyLevelsSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          // TODO: Replace with actual GraphQL mutation
          setTimeout(() => {
            showToast({
              title: t('Loyalty Levels'),
              type: 'success',
              message: t('Loyalty levels have been updated successfully'),
              duration: 2000,
            });

            setVisible(false);
            resetForm();
            setSubmitting(false);
          }, 1000);
        }}
        validateOnChange={true}
      >
        {({ errors, handleSubmit, values, isSubmitting, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t('Loyalty Levels')}</h2>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Gold')}
                  </label>
                  <CustomNumberField
                    value={values.gold}
                    name="gold"
                    minFractionDigits={0}
                    maxFractionDigits={0}
                    showLabel={false}
                    placeholder={t('Gold Points')}
                    onChange={setFieldValue}
                    min={0}
                    style={{
                      borderColor: errors?.gold ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.gold && (
                    <p className="text-sm text-red-500">{errors.gold}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Silver')}
                  </label>
                  <CustomNumberField
                    value={values.silver}
                    name="silver"
                    minFractionDigits={0}
                    maxFractionDigits={0}
                    showLabel={false}
                    placeholder={t('Silver Points')}
                    onChange={setFieldValue}
                    min={0}
                    style={{
                      borderColor: errors?.silver ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.silver && (
                    <p className="text-sm text-red-500">{errors.silver}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Platinum')}
                  </label>
                  <CustomNumberField
                    value={values.platinum}
                    name="platinum"
                    minFractionDigits={0}
                    maxFractionDigits={0}
                    showLabel={false}
                    placeholder={t('Platinum Points')}
                    onChange={setFieldValue}
                    min={0}
                    style={{
                      borderColor: errors?.platinum ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.platinum && (
                    <p className="text-sm text-red-500">{errors.platinum}</p>
                  )}
                </div>

                <button
                  className="float-end h-10 w-fit rounded-md border-gray-300 bg-black px-8 text-white disabled:opacity-50"
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
                  ) : (
                    t('Update')
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
