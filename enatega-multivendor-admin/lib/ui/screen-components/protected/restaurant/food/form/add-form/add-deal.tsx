import { useTranslations } from 'next-intl';
import { Sidebar } from 'primereact/sidebar';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '@/lib/ui/useable-components/input-field';
import CustomNumberField from '@/lib/ui/useable-components/number-input-field';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import CustomButton from '@/lib/ui/useable-components/button';
import { IDealFormValues } from '@/lib/utils/interfaces/forms/food.form.interface';



interface IAddDealFormProps {
  visible: boolean;
  onHide: () => void;
  onSave: (deal: IDealFormValues) => void;
  initialValues?: IDealFormValues;
  productName: string;
  variationName: string;
}

const AddDealForm = ({
  visible,
  onHide,
  onSave,
  initialValues,
  productName,
  variationName,
}: IAddDealFormProps) => {
  const t = useTranslations();

  const defaultValues: IDealFormValues = {
    dealName: '',
    discountType: 'PERCENTAGE',
    discountValue: 1,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
  };

  const validationSchema = Yup.object().shape({
    dealName: Yup.string().required(t('Deal name is required')),
    discountType: Yup.string().required(t('Discount type is required')),
    discountValue: Yup.number()
      .required(t('Discount value is required'))
      .min(1, t('Value must be positive')),
    startDate: Yup.date().required(t('Start date is required')),
    endDate: Yup.date()
      .required(t('End date is required'))
      .min(Yup.ref('startDate'), t('End date must be after start date')),
  });

  const discountTypeOptions = [
    { label: 'Percentage', value: 'PERCENTAGE' },
    { label: 'Fixed Amount', value: 'FIXED' },
  ];

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={onHide}
      className="w-full sm:w-[500px] dark:text-white dark:bg-dark-950 border dark:border-dark-600"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold dark:text-white">{t('Add Deal')}</h2>

        {/* Read-only info */}
        <div className="rounded-md bg-gray-50 dark:bg-dark-900 p-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <p>
            <strong>{t('Product')}:</strong> {productName}
          </p>
          <p>
            <strong>{t('Variation')}:</strong> {variationName}
          </p>
        </div>

        <Formik
          initialValues={initialValues || defaultValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            onSave(values);
            onHide();
          }}
        >
          {({ values, errors, setFieldValue, touched }) => (
            <Form className="flex flex-col gap-4">
              <CustomTextField
                type="text"
                name="dealName"
                placeholder={t('Deal Name')}
                value={values.dealName}
                onChange={(e) => setFieldValue('dealName', e.target.value)}
                showLabel
                style={{
                  borderColor: touched.dealName && errors.dealName ? 'red' : '',
                }}
              />
              {touched.dealName && errors.dealName && (
                <small className="text-red-500 dark:text-red-400">
                  {errors.dealName}
                </small>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('Discount Type')}
                </label>
                <Dropdown
                  value={values.discountType}
                  options={discountTypeOptions}
                  onChange={(e) => setFieldValue('discountType', e.value)}
                  className="w-full dark:bg-dark-900 dark:text-white"
                  panelClassName="dark:bg-dark-900 dark:border-dark-600"
                  pt={{
                    root: {
                      className:
                        'border border-gray-300 dark:border-dark-600 rounded-md h-10 dark:bg-dark-900',
                    },
                    input: { className: 'text-sm p-2 dark:text-white' },
                  }}
                />
              </div>

              <div>
                <CustomNumberField
                  name="discountValue"
                  placeholder={t('Discount Value')}
                  value={values.discountValue}
                  onChange={setFieldValue}
                  showLabel
                  min={0}
                  prefix={values.discountType === 'FIXED' ? '€' : ''}
                  suffix={values.discountType === 'PERCENTAGE' ? '%' : ''}
                  max={values.discountType === 'PERCENTAGE' ? 100 : undefined}
                  style={{
                    borderColor:
                      touched.discountValue && errors.discountValue
                        ? 'red'
                        : '',
                  }}
                />
                {touched.discountValue && errors.discountValue && (
                  <small className="text-red-500 dark:text-red-400">
                    {errors.discountValue}
                  </small>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Start Date')}
                  </label>
                  <Calendar
                    value={values.startDate}
                    onChange={(e) => setFieldValue('startDate', e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                    className="w-full calendar-no-focus-border dark:bg-dark-900"
                    inputClassName="text-sm dark:bg-dark-900 dark:text-white"
                    panelClassName="dark:bg-dark-900 dark:border-dark-600"
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      height: '2.4rem',
                    }}
                    inputStyle={{
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                    }}
                  />
                  {touched.startDate && errors.startDate && (
                    <small className="text-red-500 dark:text-red-400">
                      {errors.startDate as string}
                    </small>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('End Date')}
                  </label>
                  <Calendar
                    value={values.endDate}
                    onChange={(e) => setFieldValue('endDate', e.value)}
                    showIcon
                    dateFormat="dd/mm/yy"
                    minDate={values.startDate}
                    className="w-full calendar-no-focus-border dark:bg-dark-900"
                    inputClassName="text-sm dark:bg-dark-900 dark:text-white"
                    panelClassName="dark:bg-dark-900 dark:border-dark-600"
                    style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      height: '2.4rem',
                    }}
                    inputStyle={{
                      fontSize: '0.875rem',
                      padding: '0.5rem 0.75rem',
                    }}
                  />
                  {touched.endDate && errors.endDate && (
                    <small className="text-red-500 dark:text-red-400">
                      {errors.endDate as string}
                    </small>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label
                  htmlFor="deal-status"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('Active')}
                </label>
                <InputSwitch
                  inputId="deal-status"
                  checked={values.isActive}
                  onChange={(e) => setFieldValue('isActive', e.value)}
                  pt={{
                    slider: {
                      className: values.isActive
                        ? 'bg-primary-color dark:bg-primary-color'
                        : 'bg-gray-300 dark:bg-gray-600',
                    },
                  }}
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <CustomButton
                  label={t('Save Deal')}
                  type="submit"
                  className="bg-black dark:bg-primary-color text-white px-6 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-primary-dark"
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Sidebar>
  );
};

export default AddDealForm;
