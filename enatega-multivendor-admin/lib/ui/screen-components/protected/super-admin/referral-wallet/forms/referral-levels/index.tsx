'use client';

// Components
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';

// Interfaces
import { IEditState } from '@/lib/utils/interfaces';
import { IReferralLevel } from '@/lib/ui/screens/super-admin/referral-wallet';

// Formik
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

// Prime react
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { Slider } from 'primereact/slider';

// Hooks
import useToast from '@/lib/hooks/useToast';
import { useTranslations } from 'next-intl';

interface IReferralLevelsFormProps {
  setVisible: (visible: boolean) => void;
  isEditing: IEditState<IReferralLevel>;
  visible: boolean;
  setIsEditing: (editing: IEditState<IReferralLevel>) => void;
}

export default function ReferralLevelsForm({
  setVisible,
  isEditing,
  visible,
  setIsEditing,
}: IReferralLevelsFormProps) {
  // Hooks
  const { showToast } = useToast();
  const t = useTranslations();

  // Validation Schema
  const ReferralLevelsSchema = Yup.object().shape({
    level1: Yup.number()
      .required('Level 1 points is required')
      .min(0, 'Points must be 0 or greater'),
    level2: Yup.number()
      .required('Level 2 points is required')
      .min(0, 'Points must be 0 or greater'),
    level3: Yup.number()
      .required('Level 3 points is required')
      .min(0, 'Points must be 0 or greater'),
    maxReferrals: Yup.number()
      .required('Max referrals is required')
      .min(1, 'Max referrals must be at least 1'),
  });

  // Initial values
  const initialValues = {
    level1: 200,
    level2: 150,
    level3: 100,
    maxReferrals: 50,
  };

  // Reset form
  const resetForm = () => {
    setIsEditing({
      bool: false,
      data: {
        _id: '',
        name: '',
        referralsRequired: 1,
        pointsPerReferral: 10,
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
        validationSchema={ReferralLevelsSchema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);

          // TODO: Replace with actual GraphQL mutation
          setTimeout(() => {
            showToast({
              title: t('Referral Levels'),
              type: 'success',
              message: t('Referral levels have been updated successfully'),
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
                <h2 className="text-xl font-bold">{t('Referral Levels')}</h2>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Level 1 (Direct)')}
                  </label>
                  <CustomNumberField
                    value={values.level1}
                    name="level1"
                    minFractionDigits={0}
                    maxFractionDigits={0}
                    showLabel={false}
                    placeholder={t('Level 1 Points')}
                    onChange={setFieldValue}
                    min={0}
                    style={{
                      borderColor: errors?.level1 ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.level1 && (
                    <p className="text-sm text-red-500">{errors.level1}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Level 2 (Indirect)')}
                  </label>
                  <CustomNumberField
                    value={values.level2}
                    name="level2"
                    minFractionDigits={0}
                    maxFractionDigits={0}
                    showLabel={false}
                    placeholder={t('Level 2 Points')}
                    onChange={setFieldValue}
                    min={0}
                    style={{
                      borderColor: errors?.level2 ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.level2 && (
                    <p className="text-sm text-red-500">{errors.level2}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t('Level 3 (Indirect)')}
                  </label>
                  <CustomNumberField
                    value={values.level3}
                    name="level3"
                    minFractionDigits={0}
                    maxFractionDigits={0}
                    showLabel={false}
                    placeholder={t('Level 3 Points')}
                    onChange={setFieldValue}
                    min={0}
                    style={{
                      borderColor: errors?.level3 ? 'red' : '#d1d5db',
                      backgroundColor: '#fff',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                      height: '2.5rem',
                    }}
                  />
                  {errors.level3 && (
                    <p className="text-sm text-red-500">{errors.level3}</p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t('Max Referrals')}
                    </label>
                    <span className="text-sm font-semibold text-gray-900">
                      {values.maxReferrals} per user
                    </span>
                  </div>
                  <Slider
                    value={values.maxReferrals}
                    onChange={(e) => setFieldValue('maxReferrals', e.value)}
                    min={1}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  {errors.maxReferrals && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.maxReferrals}
                    </p>
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
